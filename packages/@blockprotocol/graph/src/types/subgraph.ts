import { Entity, EntityEditionId } from "./entity.js";
import { OntologyTypeEditionId } from "./ontology.js";
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
    editionId: OntologyTypeEditionId;
    element: DataTypeWithMetadata;
  };
  propertyType: {
    editionId: OntologyTypeEditionId;
    element: PropertyTypeWithMetadata;
  };
  entityType: {
    editionId: OntologyTypeEditionId;
    element: EntityTypeWithMetadata;
  };
  entity: {
    editionId: EntityEditionId;
    element: Entity;
  };
};

export type SubgraphRootType = SubgraphRootTypes[keyof SubgraphRootTypes];

export type Subgraph<RootType extends SubgraphRootType = SubgraphRootType> = {
  roots: RootType["editionId"][];
  vertices: Vertices;
  edges: Edges;
  depths: GraphResolveDepths;
};
