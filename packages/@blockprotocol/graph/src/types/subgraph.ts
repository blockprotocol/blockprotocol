import { Entity, EntityEditionId } from "./entity";
import { OntologyTypeEditionId } from "./ontology";
import { EntityTypeWithMetadata } from "./ontology/entity-type";
import { Edges } from "./subgraph/edges";
import { GraphResolveDepths } from "./subgraph/graph-resolve-depths";
import { Vertices } from "./subgraph/vertices";

export type SubgraphRootTypes = {
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
