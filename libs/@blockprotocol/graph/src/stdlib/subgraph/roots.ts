import { isEntityRecordId } from "../../types/entity.js";
import { isOntologyTypeRecordId } from "../../types/ontology.js";
import {
  Subgraph,
  SubgraphRootType,
  SubgraphRootTypes,
} from "../../types/subgraph.js";
import { Vertex } from "../../types/subgraph/vertices.js";
import { mustBeDefined } from "../must-be-defined.js";
import { getDataTypeByRecordId } from "./element/data-type.js";
import { getEntity } from "./element/entity.js";
import { getEntityTypeByRecordId } from "./element/entity-type.js";
import { getPropertyTypeByRecordId } from "./element/property-type.js";

/**
 * Returns all root elements.
 *
 * For a narrower return type, first narrow the type of `subgraph` by using one of the helper type-guards:
 * - isDataTypeRootedSubgraph
 * - isPropertyTypeRootedSubgraph
 * - isEntityTypeRootedSubgraph
 * - isEntityRootedSubgraph
 *
 * @param subgraph
 */
export const getRoots = <RootType extends SubgraphRootType>(
  subgraph: Subgraph<RootType>,
): RootType["element"][] =>
  subgraph.roots.map((rootRecordId) => {
    const root = mustBeDefined(
      subgraph.vertices[rootRecordId.baseId]?.[
        // We could use type-guards here to convince TS that it's safe, but that would be slower, it's currently not
        // smart enough to realise this can produce a value of type `Vertex` as it struggles with discriminating
        // `EntityId` and `BaseUri`
        rootRecordId.versionId
      ] as Vertex,
      `roots should have corresponding vertices but ${JSON.stringify(
        rootRecordId,
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
export const isDataTypeRootedSubgraph = (
  subgraph: Subgraph,
): subgraph is Subgraph<SubgraphRootTypes["dataType"]> => {
  for (const rootRecordId of subgraph.roots) {
    if (!isOntologyTypeRecordId(rootRecordId)) {
      return false;
    }

    mustBeDefined(
      getDataTypeByRecordId(subgraph, rootRecordId),
      `roots should have corresponding vertices but ${JSON.stringify(
        rootRecordId,
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
export const isPropertyTypeRootedSubgraph = (
  subgraph: Subgraph,
): subgraph is Subgraph<SubgraphRootTypes["propertyType"]> => {
  for (const rootRecordId of subgraph.roots) {
    if (!isOntologyTypeRecordId(rootRecordId)) {
      return false;
    }

    mustBeDefined(
      getPropertyTypeByRecordId(subgraph, rootRecordId),
      `roots should have corresponding vertices but ${JSON.stringify(
        rootRecordId,
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
export const isEntityTypeRootedSubgraph = (
  subgraph: Subgraph,
): subgraph is Subgraph<SubgraphRootTypes["entityType"]> => {
  for (const rootRecordId of subgraph.roots) {
    if (!isOntologyTypeRecordId(rootRecordId)) {
      return false;
    }

    mustBeDefined(
      getEntityTypeByRecordId(subgraph, rootRecordId),
      `roots should have corresponding vertices but ${JSON.stringify(
        rootRecordId,
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
export const isEntityRootedSubgraph = (
  subgraph: Subgraph,
): subgraph is Subgraph<SubgraphRootTypes["entity"]> => {
  for (const rootRecordId of subgraph.roots) {
    if (!isEntityRecordId(rootRecordId)) {
      return false;
    }

    mustBeDefined(
      getEntity(subgraph, rootRecordId.baseId, rootRecordId.versionId),
      `roots should have corresponding vertices but ${JSON.stringify(
        rootRecordId,
      )} was missing`,
    );
  }

  return true;
};
