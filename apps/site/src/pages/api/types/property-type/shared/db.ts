import type {
  PropertyType,
  PropertyTypeWithMetadata,
} from "@blockprotocol/graph";
import type { BaseUrl, VersionedUrl } from "@blockprotocol/type-system/slim";
import {
  extractBaseUrl,
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
    baseUrl: BaseUrl;
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
            _id: "$recordId.baseUrl",
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
    baseUrl?: BaseUrl;
    versionedUrl?: VersionedUrl;
  },
): Promise<DbPropertyType | null> => {
  const { baseUrl, versionedUrl } = params;

  if (versionedUrl && baseUrl) {
    throw new Error(
      "Please provide only one of baseUrl or versionedUrl. You sent both.",
    );
  }

  if (versionedUrl) {
    const propertyType = await db
      .collection<DbPropertyType>(COLLECTION_NAME)
      .findOne({
        "propertyTypeWithMetadata.schema.$id": versionedUrl,
      });

    return propertyType ?? null;
  }

  if (!baseUrl) {
    throw new Error("You must provide one of baseUrl or versionedUrl");
  }

  const propertyTypes = await db
    .collection(COLLECTION_NAME)
    .aggregate<DbPropertyType>([
      { $match: { "recordId.baseUrl": baseUrl } },
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

  const { versionedUrl } = generateOntologyUri({
    author: `@${user.shortname!}`,
    kind: "propertyType",
    title: schema.title,
    version: 1,
  });

  const propertyTypeWithExistingId = await getPropertyType(db, {
    versionedUrl,
  });

  if (propertyTypeWithExistingId) {
    throw new Error(
      `User already has an property type with id ${versionedUrl}`,
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
    versionedUrl: VersionedUrl;
    schema: Omit<PropertyType, SystemDefinedProperties>;
    user: User;
  },
): Promise<DbPropertyType> => {
  const { versionedUrl, schema, user } = params;

  const baseUrl = extractBaseUrl(versionedUrl);

  const existingPropertyType = await getPropertyType(db, { baseUrl });

  if (!existingPropertyType) {
    throw new Error(
      `Cannot find property type with versionedUrl ${versionedUrl}`,
    );
  }

  if (existingPropertyType.userId.toString() !== user.id) {
    throw new Error("You do not have permission to update this property type");
  }

  const latestVersion =
    existingPropertyType.propertyTypeWithMetadata.metadata.recordId.version;
  const versionUpdateRequestAt = extractVersion(versionedUrl);

  if (versionUpdateRequestAt !== latestVersion) {
    const updateRequestAgainstVersion = extractVersion(versionedUrl);
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
