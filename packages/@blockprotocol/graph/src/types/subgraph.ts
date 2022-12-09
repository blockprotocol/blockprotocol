import { Entity, EntityEditionId } from "./entity";
import { OntologyTypeEditionId } from "./ontology";
import { DataTypeWithMetadata } from "./ontology/data-type";
import { EntityTypeWithMetadata } from "./ontology/entity-type";
import { PropertyTypeWithMetadata } from "./ontology/property-type";
import { Edges } from "./subgraph/edges";
import { GraphResolveDepths } from "./subgraph/graph-resolve-depths";
import { Vertices } from "./subgraph/vertices";

export * from "./ontology";
export * from "./subgraph/edges";
export * from "./subgraph/graph-resolve-depths";
export * from "./subgraph/time";
export * from "./subgraph/vertices";

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
