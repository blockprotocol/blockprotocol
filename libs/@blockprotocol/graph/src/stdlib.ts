/**
 * The extended standard library of functions for interacting with a {@link Subgraph}.
 */
export { compareBounds } from "./shared/stdlib/bound.js";
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
} from "./shared/stdlib/interval.js";
export { buildSubgraph } from "./shared/stdlib/subgraph/builder.js";
export { getPropertyTypesReferencedByEntityType } from "./shared/stdlib/subgraph/edge/entity-type.js";
export {
  getIncomingLinksForEntity,
  getLeftEntityForLinkEntity,
  getOutgoingLinkAndTargetEntities,
  getOutgoingLinksForEntity,
  getRightEntityForLinkEntity,
} from "./shared/stdlib/subgraph/edge/link-entity.js";
export {
  getDataTypeById,
  getDataTypeByVertexId,
  getDataTypes,
  getDataTypesByBaseUri,
} from "./shared/stdlib/subgraph/element/data-type.js";
export {
  getEntities,
  getEntityRevision,
  getEntityRevisionsByEntityId,
} from "./shared/stdlib/subgraph/element/entity.js";
export {
  getEntityTypeById,
  getEntityTypeByVertexId,
  getEntityTypes,
  getEntityTypesByBaseUri,
} from "./shared/stdlib/subgraph/element/entity-type.js";
export { mapElementsIntoRevisions } from "./shared/stdlib/subgraph/element/map-revisions.js";
export {
  getPropertyTypeById,
  getPropertyTypeByVertexId,
  getPropertyTypes,
  getPropertyTypesByBaseUri,
} from "./shared/stdlib/subgraph/element/property-type.js";
export {
  getRoots,
  isDataTypeRootedSubgraph,
  isEntityRootedSubgraph,
  isEntityTypeRootedSubgraph,
  isPropertyTypeRootedSubgraph,
} from "./shared/stdlib/subgraph/roots.js";
export { getLatestInstantIntervalForSubgraph } from "./shared/stdlib/subgraph/temporal-axes.js";
