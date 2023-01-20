import { Entity, EntityRecordId } from "./entity.js";
import { OntologyTypeRecordId } from "./ontology.js";
import { DataTypeWithMetadata } from "./ontology/data-type.js";
import { EntityTypeWithMetadata } from "./ontology/entity-type.js";
import { PropertyTypeWithMetadata } from "./ontology/property-type.js";
import { Edges } from "./subgraph/edges.js";
import { GraphResolveDepths } from "./subgraph/graph-resolve-depths.js";
import { Vertices } from "./subgraph/vertices.js";

export * from "./ontology.js";
export * from "./subgraph/edges.js";
export * from "./subgraph/graph-resolve-depths.js";
export * from "./subgraph/time.js";
export * from "./subgraph/vertices.js";

export type SubgraphRootTypes = {
  dataType: {
    recordId: OntologyTypeRecordId;
    element: DataTypeWithMetadata;
  };
  propertyType: {
    recordId: OntologyTypeRecordId;
    element: PropertyTypeWithMetadata;
  };
  entityType: {
    recordId: OntologyTypeRecordId;
    element: EntityTypeWithMetadata;
  };
  entity: {
    recordId: EntityRecordId;
    element: Entity;
  };
};

export type SubgraphRootType = SubgraphRootTypes[keyof SubgraphRootTypes];

export type Subgraph<RootType extends SubgraphRootType = SubgraphRootType> = {
  roots: RootType["recordId"][];
  vertices: Vertices;
  edges: Edges;
  depths: GraphResolveDepths;
};

export type EntityRootedSubgraph = Subgraph<SubgraphRootTypes["entity"]>;
export type DataTypeRootedSubgraph = Subgraph<SubgraphRootTypes["dataType"]>;
export type PropertyTypeRootedSubgraph = Subgraph<
  SubgraphRootTypes["propertyType"]
>;
export type EntityTypeRootedSubgraph = Subgraph<
  SubgraphRootTypes["entityType"]
>;
