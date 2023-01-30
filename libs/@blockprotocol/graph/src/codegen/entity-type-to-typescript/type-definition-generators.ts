// Generate imports for types we use from elsewhere
export const generateImportStatements = () =>
  `import { Entity, JsonObject } from "@blockprotocol/graph";\n\n`;

// Generate a typed Entity, given the name of the type to use in its Properties generic slot
export const generateEntityDefinition = (
  name: string,
  propertyTypeName: string,
) => `
export type ${name} = Entity<${propertyTypeName}>;\n`;

/*
 * Generate the type returned by functions which extract a link entity and its right entity from the subgraph
 * @see link-entity.ts
 */
export const generateLinkEntityAndRightEntityDefinition = (
  typeNames: {
    sourceEntityTypeName: string;
    linkEntityTypeName: string;
    rightEntityTypeNames: string[];
  },
  options?: { minItems: number; maxItems: number },
) => {
  const { sourceEntityTypeName, linkEntityTypeName, rightEntityTypeNames } =
    typeNames;
  const { minItems, maxItems: _maxItems } = options ?? {}; // @todo tuple when minItems > 0 and/or maxItems is defined

  const typeName = `${sourceEntityTypeName}${linkEntityTypeName}Links`;

  const typeDefinition = `export type ${typeName} = ${!minItems ? "[] |" : ""}
  {
    linkEntity: ${linkEntityTypeName};
    rightEntity: ${rightEntityTypeNames.join(" | ")};
  }[];\n\n`;

  return { typeDefinition, typeName };
};

// Generate a type which is a map of link URIs on an entity's schema to how those links are returned by subgraph utility fns
// Also generates a type for just the values of that map
export const generateEntityLinkMapDefinition = (
  entityTypeName: string,
  uriToLinkEntityAndRightEntityDefinitionName: {
    [versionedUri: string]: string;
  },
) => {
  const mapTypeName = `${entityTypeName}LinksByLinkTypeId`;
  const linkAndRightEntitiesUnionName = `${entityTypeName}LinkAndRightEntities`;

  return {
    mapTypeName,
    linkAndRightEntitiesUnionName,
    linkDefinitionString: `export type ${mapTypeName} = {
${Object.entries(uriToLinkEntityAndRightEntityDefinitionName)
  .map(([versionedUri, typeName]) => `  "${versionedUri}": ${typeName};`)
  .join("\n")}
};

export type ${linkAndRightEntitiesUnionName} = NonNullable<
  ${mapTypeName}[keyof ${mapTypeName}]
>;`,
  };
};
