import {
  DataTypeRootType,
  EntityRootType,
  EntityTypeRootType,
  isEntityVertexId,
  isOntologyTypeVertexId,
  isTemporalSubgraph,
  PropertyTypeRootType,
  Subgraph,
  SubgraphRootType,
} from "../../types/subgraph";
import { Vertex } from "../../types/subgraph/vertices";
import { mustBeDefined } from "../must-be-defined";
import { getDataTypeByVertexId } from "./element/data-type";
import { getEntityRevision } from "./element/entity";
import { getEntityTypeByVertexId } from "./element/entity-type";
import { getPropertyTypeByVertexId } from "./element/property-type";

/**
 * Returns all root elements.
 *
 * For a narrower return type, first narrow the type of `subgraph` by using one of the helper type-guards:
 * - {@link isDataTypeRootedSubgraph}
 * - {@link isPropertyTypeRootedSubgraph}
 * - {@link isEntityTypeRootedSubgraph}
 * - {@link isEntityRootedSubgraph}
 *
 * @param subgraph
 */
export const getRoots = <
  Temporal extends boolean,
  RootType extends SubgraphRootType<Temporal>,
>(
  subgraph: Subgraph<Temporal, RootType>,
): RootType["element"][] =>
  subgraph.roots.map((rootVertexId) => {
    const root = mustBeDefined(
      subgraph.vertices[rootVertexId.baseId]?.[
        // We could use type-guards here to convince TS that it's safe, but that would be slower, it's currently not
        // smart enough to realise this can produce a value of type `Vertex` as it struggles with discriminating
        // `EntityId` and `BaseUri`
        rootVertexId.revisionId
      ] as Vertex<Temporal>,
      `roots should have corresponding vertices but ${JSON.stringify(
        rootVertexId,
      )} was missing`,
    );

    return root.inner as RootType["element"];
  });

/**
 * A type-guard that can be used to constrain the generic parameter of `Subgraph` to `DataTypeWithMetadata`.
 *
 * Doing so will help TS infer that `getRoots` returns `DataTypeWithMetadata`s, removing the need for additional
 * type checks or casts.
 *
 * @param subgraph
 */
export const isDataTypeRootedSubgraph = <Temporal extends boolean>(
  subgraph: Subgraph<Temporal>,
): subgraph is Subgraph<Temporal, DataTypeRootType> => {
  for (const rootVertexId of subgraph.roots) {
    if (!isOntologyTypeVertexId(rootVertexId)) {
      return false;
    }

    mustBeDefined(
      getDataTypeByVertexId(subgraph, rootVertexId),
      `roots should have corresponding vertices but ${JSON.stringify(
        rootVertexId,
      )} was missing`,
    );
  }

  return true;
};

/**
 * A type-guard that can be used to constrain the generic parameter of `Subgraph` to `PropertyTypeWithMetadata`.
 *
 * Doing so will help TS infer that `getRoots` returns `PropertyTypeWithMetadata`s, removing the need for additional
 * type checks or casts.
 *
 * @param subgraph
 */
export const isPropertyTypeRootedSubgraph = <Temporal extends boolean>(
  subgraph: Subgraph<Temporal>,
): subgraph is Subgraph<Temporal, PropertyTypeRootType> => {
  for (const rootVertexId of subgraph.roots) {
    if (!isOntologyTypeVertexId(rootVertexId)) {
      return false;
    }

    mustBeDefined(
      getPropertyTypeByVertexId(subgraph, rootVertexId),
      `roots should have corresponding vertices but ${JSON.stringify(
        rootVertexId,
      )} was missing`,
    );
  }

  return true;
};

/**
 * A type-guard that can be used to constrain the generic parameter of `Subgraph` to `EntityTypeWithMetadata`.
 *
 * Doing so will help TS infer that `getRoots` returns `EntityTypeWithMetadata`s, removing the need for additional
 * type checks or casts.
 *
 * @param subgraph
 */
export const isEntityTypeRootedSubgraph = <Temporal extends boolean>(
  subgraph: Subgraph<Temporal>,
): subgraph is Subgraph<Temporal, EntityTypeRootType> => {
  for (const rootVertexId of subgraph.roots) {
    if (!isOntologyTypeVertexId(rootVertexId)) {
      return false;
    }

    mustBeDefined(
      getEntityTypeByVertexId(subgraph, rootVertexId),
      `roots should have corresponding vertices but ${JSON.stringify(
        rootVertexId,
      )} was missing`,
    );
  }

  return true;
};

/**
 * A type-guard that can be used to constrain the generic parameter of `Subgraph` to `Entity`.
 *
 * Doing so will help TS infer that `getRoots` returns `Entity`s, removing the need for additional
 * type checks or casts.
 *
 * @param subgraph
 */
export const isEntityRootedSubgraph = <Temporal extends boolean>(
  subgraph: Subgraph<Temporal>,
): subgraph is Subgraph<Temporal, EntityRootType<Temporal>> => {
  for (const rootVertexId of subgraph.roots) {
    if (!isEntityVertexId(rootVertexId)) {
      return false;
    }

    if (isTemporalSubgraph(subgraph)) {
      mustBeDefined(
        getEntityRevision(
          subgraph as Subgraph<true>,
          rootVertexId.baseId,
          rootVertexId.revisionId,
        ),
        `roots should have corresponding vertices but ${JSON.stringify(
          rootVertexId,
        )} was missing`,
      );
    } else {
      mustBeDefined(
        getEntityRevision(subgraph as Subgraph<false>, rootVertexId.baseId),
        `roots should have corresponding vertices but ${JSON.stringify(
          rootVertexId,
        )} was missing`,
      );
    }
  }

  return true;
};
