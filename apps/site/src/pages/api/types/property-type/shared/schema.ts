/*
 @todo - We should be able to import from the `@blockprotocol/graph` package here but we're running into strange errors
   with named exports, CommonJS, and ESM modules from the dependency on `/core`
 */
import { PropertyType, PropertyTypeWithMetadata } from "@blockprotocol/graph";
import { PROPERTY_TYPE_META_SCHEMA } from "@blockprotocol/type-system/slim";

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
