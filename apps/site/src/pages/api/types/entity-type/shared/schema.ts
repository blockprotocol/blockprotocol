import {
  ENTITY_TYPE_META_SCHEMA,
  EntityType,
  EntityTypeWithMetadata,
} from "@blockprotocol/graph";

import { generateOntologyUrl } from "../../../../shared/schema";
import { SystemDefinedProperties } from "../../shared/constants";

export const generateEntityTypeWithMetadata = (data: {
  author: `@${string}`;
  schema: Omit<EntityType, SystemDefinedProperties>;
  version: number;
}): EntityTypeWithMetadata => {
  const { author, schema: incompleteSchema, version } = data;

  if (!incompleteSchema.title.trim()) {
    throw new Error("Type is missing a title");
  }

  const kind = "entityType";

  const { baseUrl, versionedUrl } = generateOntologyUrl({
    author,
    kind,
    title: incompleteSchema.title,
    version,
  });

  const entityType: Required<EntityType> = {
    $schema: ENTITY_TYPE_META_SCHEMA,
    $id: versionedUrl,
    kind,
    title: incompleteSchema.title,
    type: "object",
    allOf: incompleteSchema.allOf ?? [],
    description: incompleteSchema.description ?? "",
    examples: incompleteSchema.examples ?? [],
    links: incompleteSchema.links ?? {},
    properties: incompleteSchema.properties ?? {},
    required: incompleteSchema.required ?? [],
  } as const;

  return {
    metadata: {
      recordId: {
        baseUrl,
        version,
      },
    },
    schema: entityType,
  };
};
