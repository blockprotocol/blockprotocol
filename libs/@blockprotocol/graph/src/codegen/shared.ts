export type LogLevel = "silent" | "warn" | "info" | "debug" | "trace";

export const primitiveLinkEntityTypeId =
  "https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1";

/** The suffix to append to generated types for each class of ontology type */
export const generatedTypeSuffix = {
  dataType: "",
  propertyType: "PropertyValue",
  entityType: "Properties",
};
