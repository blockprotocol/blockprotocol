import type { EntityType, EntityTypeWithMetadata } from "@blockprotocol/graph";
import { extractVersion } from "@blockprotocol/type-system";
import type { BaseUri, VersionedUri } from "@blockprotocol/type-system/slim";
import { extractBaseUri } from "@blockprotocol/type-system/slim";
import { Db, ObjectId } from "mongodb";

import { User } from "../../../../../lib/api/model/user.model";
import { generateOntologyUri } from "../../../../shared/schema";
import { SystemDefinedProperties } from "../../shared/constants";
import { generateEntityTypeWithMetadata } from "./schema";

export const COLLECTION_NAME = "bp-entity-types";

export type DbEntityType = {
  recordId: {
    baseUri: BaseUri;
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
            _id: "$recordId.baseUri",
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
    baseUri?: BaseUri;
    versionedUri?: VersionedUri;
  },
): Promise<DbEntityType | null> => {
  const { baseUri, versionedUri } = params;

  if (versionedUri && baseUri) {
    throw new Error(
      "Please provide only one of baseUri or versionedUri. You sent both.",
    );
  }

  if (versionedUri) {
    const entityType = await db
      .collection<DbEntityType>(COLLECTION_NAME)
      .findOne({
        "entityTypeWithMetadata.schema.$id": versionedUri,
      });

    return entityType ?? null;
  }

  if (!baseUri) {
    throw new Error("You must provide one of baseUri or versionedUri");
  }

  const entityTypes = await db
    .collection(COLLECTION_NAME)
    .aggregate<DbEntityType>([
      { $match: { "recordId.baseUri": baseUri } },
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

  const { versionedUri } = generateOntologyUri({
    author: `@${user.shortname!}`,
    kind: "entityType",
    title: schema.title,
    version: 1,
  });

  const entityTypeWithExistingId = await getEntityType(db, {
    versionedUri,
  });

  if (entityTypeWithExistingId) {
    throw new Error(`User already has an entity type with id ${versionedUri}`);
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
    versionedUri: VersionedUri;
  },
): Promise<DbEntityType> => {
  const { versionedUri, schema, user } = params;

  const baseUri = extractBaseUri(versionedUri);

  const existingEntityType = await getEntityType(db, { baseUri });

  if (!existingEntityType) {
    throw new Error(
      `Cannot find entity type with versionedUri ${versionedUri}`,
    );
  }

  if (existingEntityType.userId.toString() !== user.id) {
    throw new Error("You do not have permission to update this entity type");
  }

  const latestVersion =
    existingEntityType.entityTypeWithMetadata.metadata.recordId.version;
  const versionUpdateRequestAt = extractVersion(versionedUri);

  if (versionUpdateRequestAt !== latestVersion) {
    const updateRequestAgainstVersion = extractVersion(versionedUri);
    throw new Error(
      `Can only request an update using the latest type version, which is ${latestVersion} – the provided URI used ${updateRequestAgainstVersion}`,
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
