import type { EntityType, EntityTypeWithMetadata } from "@blockprotocol/graph";
import type { BaseUrl, VersionedUrl } from "@blockprotocol/type-system/slim";
import {
  extractBaseUrl,
  extractVersion,
} from "@blockprotocol/type-system/slim";
import { Db, ObjectId } from "mongodb";

import { User } from "../../../../../lib/api/model/user.model";
import { generateOntologyUrl } from "../../../../shared/schema";
import { SystemDefinedProperties } from "../../shared/constants";
import { removeAdditionalProperties } from "../../shared/temp-patch";
import { generateEntityTypeWithMetadata } from "./schema";

export const COLLECTION_NAME = "bp-entity-types";

export type DbEntityType = {
  recordId: {
    baseUrl: BaseUrl;
    version: number;
  };
  createdAt: Date;
  userId: ObjectId;
  entityTypeWithMetadata: EntityTypeWithMetadata;
};

export const getEntityTypes = async (
  db: Db,
  params: { latestOnly: boolean; user?: User },
): Promise<DbEntityType[]> => {
  const { latestOnly, user } = params;

  const matcher = user ? { userId: new ObjectId(user.id) } : {};

  if (latestOnly) {
    return await db
      .collection(COLLECTION_NAME)
      .aggregate<DbEntityType>([
        { $match: matcher },
        { $sort: { "recordId.version": -1 } },
        {
          $group: {
            _id: "$recordId.baseUrl",
            doc_with_max_ver: { $first: "$$ROOT" },
          },
        },
        { $replaceWith: "$doc_with_max_ver" },
      ])
      .toArray();
  }

  return await db
    .collection<DbEntityType>(COLLECTION_NAME)
    .find(matcher)
    .toArray();
};

export const getEntityType = async (
  db: Db,
  params: {
    baseUrl?: BaseUrl;
    versionedUrl?: VersionedUrl;
  },
): Promise<DbEntityType | null> => {
  const { baseUrl, versionedUrl } = params;

  if (versionedUrl && baseUrl) {
    throw new Error(
      "Please provide only one of baseUrl or versionedUrl. You sent both.",
    );
  }

  if (versionedUrl) {
    const entityType = await db
      .collection<DbEntityType>(COLLECTION_NAME)
      .findOne({
        "entityTypeWithMetadata.schema.$id": versionedUrl,
      });

    return entityType ?? null;
  }

  if (!baseUrl) {
    throw new Error("You must provide one of baseUrl or versionedUrl");
  }

  const entityTypes = await db
    .collection(COLLECTION_NAME)
    .aggregate<DbEntityType>([
      { $match: { "recordId.baseUrl": baseUrl } },
      { $sort: { "recordId.version": -1 } },
      { $limit: 1 },
    ])
    .toArray();

  return entityTypes?.[0] ?? null;
};

export const createEntityType = async (
  db: Db,
  params: {
    schema: Partial<Omit<EntityType, SystemDefinedProperties>> & {
      title: string;
    };
    user: User;
  },
): Promise<DbEntityType> => {
  const { schema, user } = params;

  const { versionedUrl } = generateOntologyUrl({
    author: `@${user.shortname!}`,
    kind: "entityType",
    title: schema.title,
    version: 1,
  });

  const entityTypeWithExistingId = await getEntityType(db, {
    versionedUrl,
  });

  if (entityTypeWithExistingId) {
    throw new Error(`User already has an entity type with id ${versionedUrl}`);
  }

  let entityTypeWithMetadata;
  try {
    entityTypeWithMetadata = generateEntityTypeWithMetadata({
      author: `@${user.shortname!}`,
      schema: {
        ...schema,
        properties: schema.properties ?? {},
      },
      version: 1,
    });
  } catch (err) {
    throw new Error(
      `Invalid entity type: ${
        err instanceof Error ? err.message : "unknown error"
      }`,
    );
  }

  const now = new Date();

  /* @todo - remove this when the type-editor uses a newer version of the type-system */
  removeAdditionalProperties(entityTypeWithMetadata);

  const insertionData = {
    entityTypeWithMetadata,
    createdAt: now,
    userId: new ObjectId(user.id),
    recordId: entityTypeWithMetadata.metadata.recordId,
  };

  await db.collection<DbEntityType>(COLLECTION_NAME).insertOne(insertionData);

  return insertionData;
};

export const updateEntityType = async (
  db: Db,
  params: {
    schema: Omit<EntityType, SystemDefinedProperties>;
    user: User;
    versionedUrl: VersionedUrl;
  },
): Promise<DbEntityType> => {
  const { versionedUrl, schema, user } = params;

  const baseUrl = extractBaseUrl(versionedUrl);

  const existingEntityType = await getEntityType(db, { baseUrl });

  if (!existingEntityType) {
    throw new Error(
      `Cannot find entity type with versionedUrl ${versionedUrl}`,
    );
  }

  if (existingEntityType.userId.toString() !== user.id) {
    throw new Error("You do not have permission to update this entity type");
  }

  const latestVersion =
    existingEntityType.entityTypeWithMetadata.metadata.recordId.version;
  const versionUpdateRequestAt = extractVersion(versionedUrl);

  if (versionUpdateRequestAt !== latestVersion) {
    throw new Error(
      `Can only request an update using the latest type version, which is ${latestVersion} – the provided URL used ${versionUpdateRequestAt}`,
    );
  }

  let entityTypeWithMetadata;
  try {
    entityTypeWithMetadata = generateEntityTypeWithMetadata({
      author: `@${user.shortname!}`,
      schema,
      version:
        existingEntityType.entityTypeWithMetadata.metadata.recordId.version + 1,
    });
  } catch (err) {
    throw new Error(
      `Invalid entity type: ${
        err instanceof Error ? err.message : "unknown error"
      }`,
    );
  }

  /* @todo - remove this when the type-editor uses a newer version of the type-system */
  removeAdditionalProperties(entityTypeWithMetadata);

  const now = new Date();

  const insertionData = {
    entityTypeWithMetadata,
    createdAt: now,
    userId: new ObjectId(user.id),
    recordId: entityTypeWithMetadata.metadata.recordId,
  };

  await db.collection<DbEntityType>(COLLECTION_NAME).insertOne(insertionData);

  return insertionData;
};
