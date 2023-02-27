import {
  PROPERTY_TYPE_META_SCHEMA,
  PropertyType,
  PropertyTypeWithMetadata,
} from "@blockprotocol/graph";

import { generateOntologyUrl } from "../../../../shared/schema";
import { SystemDefinedProperties } from "../../shared/constants";

export const generatePropertyTypeWithMetadata = (data: {
  author: `@${string}`;
  schema: Omit<PropertyType, SystemDefinedProperties>;
  version: number;
}): PropertyTypeWithMetadata => {
  const { author, schema: incompleteSchema, version } = data;

  if (!incompleteSchema.title.trim()) {
    throw new Error("Type is missing a title");
  }

  const kind = "propertyType";

  const { baseUrl, versionedUrl } = generateOntologyUrl({
    author,
    kind,
    title: incompleteSchema.title,
    version,
  });

  const propertyType: Required<PropertyType> = {
    $schema: PROPERTY_TYPE_META_SCHEMA,
    $id: versionedUrl,
    kind,
    title: incompleteSchema.title,
    description: incompleteSchema.description ?? "",
    oneOf: incompleteSchema.oneOf ?? [],
  };

  return {
    metadata: {
      recordId: {
        baseUrl,
        version,
      },
    },
    schema: propertyType,
  };
};
