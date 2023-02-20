import { Entity } from "./entity";
import { DataTypeWithMetadata } from "./ontology/data-type";
import { EntityTypeWithMetadata } from "./ontology/entity-type";
import { PropertyTypeWithMetadata } from "./ontology/property-type";
import { Edges } from "./subgraph/edges";
import { GraphResolveDepths } from "./subgraph/graph-resolve-depths";
import { SubgraphTemporalAxes } from "./subgraph/temporal-axes";
import {
  EntityVertexId,
  OntologyTypeVertexId,
  Vertices,
} from "./subgraph/vertices";

export * from "./ontology";
export * from "./subgraph/edges";
export * from "./subgraph/element-mappings";
export * from "./subgraph/graph-resolve-depths";
export * from "./subgraph/temporal-axes";
export * from "./subgraph/vertices";

export type DataTypeRootType = {
  vertexId: OntologyTypeVertexId;
  element: DataTypeWithMetadata;
};

export type PropertyTypeRootType = {
  vertexId: OntologyTypeVertexId;
  element: PropertyTypeWithMetadata;
};

export type EntityTypeRootType = {
  vertexId: OntologyTypeVertexId;
  element: EntityTypeWithMetadata;
};

export type EntityRootType<Temporal extends boolean> = {
  vertexId: EntityVertexId;
  element: Entity<Temporal>;
};

export type SubgraphRootType<Temporal extends boolean> =
  | DataTypeRootType
  | PropertyTypeRootType
  | EntityTypeRootType
  | EntityRootType<Temporal>;

export type Subgraph<
  Temporal extends boolean,
  RootType extends SubgraphRootType<Temporal> = SubgraphRootType<Temporal>,
> = {
  roots: RootType["vertexId"][];
  vertices: Vertices<Temporal>;
  edges: Edges<Temporal>;
  depths: GraphResolveDepths;
} & (Temporal extends true ? { temporalAxes: SubgraphTemporalAxes } : {});

export const isTemporalSubgraph = <
  RootType extends SubgraphRootType<boolean> = SubgraphRootType<boolean>,
>(
  subgraph: Subgraph<boolean, RootType>,
): subgraph is Subgraph<true, RootType> => {
  return (subgraph as Subgraph<true>).temporalAxes !== undefined;
};
