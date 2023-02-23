import { EntityType, EntityTypeWithMetadata } from "@blockprotocol/graph";

import { generateOntologyUri } from "../../../../shared/schema";
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

  const { baseUrl, versionedUrl } = generateOntologyUri({
    author,
    kind,
    title: incompleteSchema.title,
    version,
  });

  const entityType: Required<EntityType> = {
    additionalProperties: false,
    allOf: incompleteSchema.allOf ?? [],
    description: incompleteSchema.description ?? "",
    examples: incompleteSchema.examples ?? [],
    $id: versionedUrl,
    kind,
    links: incompleteSchema.links ?? {},
    properties: incompleteSchema.properties ?? {},
    required: incompleteSchema.required ?? [],
    title: incompleteSchema.title,
    type: "object",
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
