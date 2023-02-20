import type {
  PropertyType,
  PropertyTypeWithMetadata,
} from "@blockprotocol/graph";
import type { BaseUri, VersionedUri } from "@blockprotocol/type-system/slim";
import {
  extractBaseUri,
  extractVersion,
} from "@blockprotocol/type-system/slim";
import { Db, ObjectId } from "mongodb";

import { User } from "../../../../../lib/api/model/user.model";
import { generateOntologyUri } from "../../../../shared/schema";
import { SystemDefinedProperties } from "../../shared/constants";
import { generatePropertyTypeWithMetadata } from "./schema";

export const COLLECTION_NAME = "bp-property-types";

export type DbPropertyType = {
  recordId: {
    baseUri: BaseUri;
    version: number;
  };
  createdAt: Date;
  userId: ObjectId;
  propertyTypeWithMetadata: PropertyTypeWithMetadata;
};

export const getPropertyTypes = async (
  db: Db,
  params: { latestOnly: boolean; user?: User },
): Promise<DbPropertyType[]> => {
  const { latestOnly, user } = params;

  const matcher = user ? { userId: new ObjectId(user.id) } : {};

  if (latestOnly) {
    return await db
      .collection(COLLECTION_NAME)
      .aggregate<DbPropertyType>([
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
    .collection<DbPropertyType>(COLLECTION_NAME)
    .find(matcher)
    .toArray();
};

export const getPropertyType = async (
  db: Db,
  params: {
    baseUri?: BaseUri;
    versionedUri?: VersionedUri;
  },
): Promise<DbPropertyType | null> => {
  const { baseUri, versionedUri } = params;

  if (versionedUri && baseUri) {
    throw new Error(
      "Please provide only one of baseUri or versionedUri. You sent both.",
    );
  }

  if (versionedUri) {
    const propertyType = await db
      .collection<DbPropertyType>(COLLECTION_NAME)
      .findOne({
        "propertyTypeWithMetadata.schema.$id": versionedUri,
      });

    return propertyType ?? null;
  }

  if (!baseUri) {
    throw new Error("You must provide one of baseUri or versionedUri");
  }

  const propertyTypes = await db
    .collection(COLLECTION_NAME)
    .aggregate<DbPropertyType>([
      { $match: { "recordId.baseUri": baseUri } },
      { $sort: { "recordId.version": -1 } },
      { $limit: 1 },
    ])
    .toArray();

  return propertyTypes?.[0] ?? null;
};

export const createPropertyType = async (
  db: Db,
  params: {
    schema: Partial<Omit<PropertyType, SystemDefinedProperties>> &
      Required<Pick<PropertyType, "title" | "oneOf">>;
    user: User;
  },
): Promise<DbPropertyType> => {
  const { schema, user } = params;

  const { versionedUri } = generateOntologyUri({
    author: `@${user.shortname!}`,
    kind: "propertyType",
    title: schema.title,
    version: 1,
  });

  const propertyTypeWithExistingId = await getPropertyType(db, {
    versionedUri,
  });

  if (propertyTypeWithExistingId) {
    throw new Error(
      `User already has an property type with id ${versionedUri}`,
    );
  }

  let propertyTypeWithMetadata;
  try {
    propertyTypeWithMetadata = generatePropertyTypeWithMetadata({
      author: `@${user.shortname!}`,
      schema,
      version: 1,
    });
  } catch (err) {
    throw new Error(
      `Invalid property type: ${
        err instanceof Error ? err.message : "unknown error"
      }`,
    );
  }

  const now = new Date();

  const insertionData = {
    propertyTypeWithMetadata,
    createdAt: now,
    userId: new ObjectId(user.id),
    recordId: propertyTypeWithMetadata.metadata.recordId,
  };

  await db.collection<DbPropertyType>(COLLECTION_NAME).insertOne(insertionData);

  return insertionData;
};

export const updatePropertyType = async (
  db: Db,
  params: {
    versionedUri: VersionedUri;
    schema: Omit<PropertyType, SystemDefinedProperties>;
    user: User;
  },
): Promise<DbPropertyType> => {
  const { versionedUri, schema, user } = params;

  const baseUri = extractBaseUri(versionedUri);

  const existingPropertyType = await getPropertyType(db, { baseUri });

  if (!existingPropertyType) {
    throw new Error(
      `Cannot find property type with versionedUri ${versionedUri}`,
    );
  }

  if (existingPropertyType.userId.toString() !== user.id) {
    throw new Error("You do not have permission to update this property type");
  }

  const latestVersion =
    existingPropertyType.propertyTypeWithMetadata.metadata.recordId.version;
  const versionUpdateRequestAt = extractVersion(versionedUri);

  if (versionUpdateRequestAt !== latestVersion) {
    const updateRequestAgainstVersion = extractVersion(versionedUri);
    throw new Error(
      `Can only request an update using the latest type version, which is ${latestVersion} – the provided URI used ${updateRequestAgainstVersion}`,
    );
  }

  let propertyTypeWithMetadata;
  try {
    propertyTypeWithMetadata = generatePropertyTypeWithMetadata({
      author: `@${user.shortname!}`,
      schema,
      version:
        existingPropertyType.propertyTypeWithMetadata.metadata.recordId
          .version + 1,
    });
  } catch (err) {
    throw new Error(
      `Invalid property type: ${
        err instanceof Error ? err.message : "unknown error"
      }`,
    );
  }

  const now = new Date();

  const insertionData = {
    propertyTypeWithMetadata,
    createdAt: now,
    userId: new ObjectId(user.id),
    recordId: propertyTypeWithMetadata.metadata.recordId,
  };

  await db.collection<DbPropertyType>(COLLECTION_NAME).insertOne(insertionData);

  return insertionData;
};
