import { VersionedUri } from "@blockprotocol/type-system";
import { PropertyType } from "@blockprotocol/type-system/slim";

import { PropertyTypeRootType, Subgraph } from "../subgraph";
import { OntologyElementMetadata } from "./metadata.js";

/**
 * @todo - Should we re-export this? Should the type-system package be an implementation detail of the graph module?
 *   Or should consumers import it directly? Also raises the question of if we should be re-exporting the functions.
 */
export type { PropertyType };

export type PropertyTypeWithMetadata = {
  schema: PropertyType;
  metadata: OntologyElementMetadata;
};

export type AggregatePropertyTypesData = {
  graphResolveDepths?: Partial<
    Pick<
      Subgraph<true>["depths"],
      "constrainsValuesOn" | "constrainsPropertiesOn"
    >
  >;
};

export type AggregatePropertyTypesResult = {
  results: Subgraph<true, PropertyTypeRootType>;
};

export type GetPropertyTypeData = {
  propertyTypeId: VersionedUri;
};

export type CreatePropertyTypeData = {
  propertyType: Omit<PropertyType, "$id">;
};

export type UpdatePropertyTypeData = {
  propertyTypeId: VersionedUri;
  propertyType: Omit<PropertyType, "$id">;
};
