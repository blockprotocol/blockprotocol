import { PropertyType, VersionedUri } from "@blockprotocol/type-system/slim";

import { PropertyTypeRootType, Subgraph } from "../subgraph.js";
import { OntologyElementMetadata } from "./metadata.js";

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

type SystemDefinedPropertyTypeProperties = "$id" | "kind";

export type CreatePropertyTypeData = {
  propertyType: Omit<PropertyType, SystemDefinedPropertyTypeProperties>;
};

export type UpdatePropertyTypeData = {
  propertyTypeId: VersionedUri;
  propertyType: Omit<PropertyType, SystemDefinedPropertyTypeProperties>;
};
