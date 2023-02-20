/**
 * The extended standard library of functions for interacting with a {@link Subgraph}.
 */
export { compareBounds } from "./stdlib/bound";
export {
  intervalCompareWithInterval,
  intervalContainsInterval,
  intervalContainsTimestamp,
  intervalForTimestamp,
  intervalIntersectionWithInterval,
  intervalIsAdjacentToInterval,
  intervalIsStrictlyAfterInterval,
  intervalIsStrictlyBeforeInterval,
  intervalMergeWithInterval,
  intervalOverlapsInterval,
  intervalUnionWithInterval,
  sortIntervals,
  unionOfIntervals,
} from "./stdlib/interval";
export { buildSubgraph } from "./stdlib/subgraph/builder";
export { getPropertyTypesReferencedByEntityType } from "./stdlib/subgraph/edge/entity-type";
export {
  getIncomingLinksForEntity,
  getLeftEntityForLinkEntity,
  getOutgoingLinkAndTargetEntities,
  getOutgoingLinksForEntity,
  getRightEntityForLinkEntity,
} from "./stdlib/subgraph/edge/link-entity";
export {
  getDataTypeById,
  getDataTypeByVertexId,
  getDataTypes,
  getDataTypesByBaseUri,
} from "./stdlib/subgraph/element/data-type";
export {
  getEntities,
  getEntityRevision,
  getEntityRevisionsByEntityId,
} from "./stdlib/subgraph/element/entity";
export {
  getEntityTypeById,
  getEntityTypeByVertexId,
  getEntityTypes,
  getEntityTypesByBaseUri,
} from "./stdlib/subgraph/element/entity-type";
export { mapElementsIntoRevisions } from "./stdlib/subgraph/element/map-revisions";
export {
  getPropertyTypeById,
  getPropertyTypeByVertexId,
  getPropertyTypes,
  getPropertyTypesByBaseUri,
} from "./stdlib/subgraph/element/property-type";
export {
  getRoots,
  isDataTypeRootedSubgraph,
  isEntityRootedSubgraph,
  isEntityTypeRootedSubgraph,
  isPropertyTypeRootedSubgraph,
} from "./stdlib/subgraph/roots";
export { getLatestInstantIntervalForSubgraph } from "./stdlib/subgraph/temporal-axes";
