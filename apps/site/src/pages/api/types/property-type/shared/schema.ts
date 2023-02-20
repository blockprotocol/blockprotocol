import {
  type PropertyType,
  type PropertyTypeWithMetadata,
} from "@blockprotocol/graph";

import { generateOntologyUri } from "../../../../shared/schema";
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

  const { baseUri, versionedUri } = generateOntologyUri({
    author,
    kind,
    title: incompleteSchema.title,
    version,
  });

  const propertyType: Required<PropertyType> = {
    $id: versionedUri,
    description: incompleteSchema.description ?? "",
    oneOf: incompleteSchema.oneOf ?? [],
    kind,
    title: incompleteSchema.title,
  };

  return {
    metadata: {
      recordId: {
        baseUri,
        version,
      },
    },
    schema: propertyType,
  };
};
