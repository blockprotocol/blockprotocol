import {
  buildSubgraph as buildSubgraphGeneral,
  getDataTypeById as getDataTypeByIdGeneral,
  getDataTypeByVertexId as getDataTypeByVertexIdGeneral,
  getDataTypes as getDataTypesGeneral,
  getDataTypesByBaseUri as getDataTypesByBaseUriGeneral,
  getEntities as getEntitiesGeneral,
  getEntityRevision as getEntityRevisionGeneral,
  getEntityRevisionsByEntityId as getEntityRevisionsByEntityIdGeneral,
  getEntityTypeById as getEntityTypeByIdGeneral,
  getEntityTypeByVertexId as getEntityTypeByVertexIdGeneral,
  getEntityTypes as getEntityTypesGeneral,
  getEntityTypesByBaseUri as getEntityTypesByBaseUriGeneral,
  getIncomingLinksForEntity as getIncomingLinksForEntityGeneral,
  getLeftEntityForLinkEntity as getLeftEntityForLinkEntityGeneral,
  getOutgoingLinkAndTargetEntities as getOutgoingLinkAndTargetEntitiesGeneral,
  getOutgoingLinksForEntity as getOutgoingLinksForEntityGeneral,
  getPropertyTypeById as getPropertyTypeByIdGeneral,
  getPropertyTypeByVertexId as getPropertyTypeByVertexIdGeneral,
  getPropertyTypes as getPropertyTypesGeneral,
  getPropertyTypesByBaseUri as getPropertyTypesByBaseUriGeneral,
  getPropertyTypesReferencedByEntityType as getPropertyTypesReferencedByEntityTypeGeneral,
  getRightEntityForLinkEntity as getRightEntityForLinkEntityGeneral,
  getRoots as getRootsGeneral,
  isDataTypeRootedSubgraph as isDataTypeRootedSubgraphGeneral,
  isEntityRootedSubgraph as isEntityRootedSubgraphGeneral,
  isEntityTypeRootedSubgraph as isEntityTypeRootedSubgraphGeneral,
  isPropertyTypeRootedSubgraph as isPropertyTypeRootedSubgraphGeneral,
} from "../shared/stdlib";
import {
  DataTypeWithMetadata,
  Entity,
  EntityId,
  EntityRecordId,
  EntityTypeWithMetadata,
  GraphResolveDepths,
  LinkEntityAndRightEntity,
  PropertyTypeWithMetadata,
  Subgraph,
  SubgraphRootType,
} from "./main";

// import {
//   EntityRevisionId,
//   TimeInterval,
//   Timestamp,
// } from "./main";
// import {
//   intervalCompareWithInterval as intervalCompareWithIntervalGeneral,
//   intervalContainsInterval as intervalContainsIntervalGeneral,
//   intervalContainsTimestamp as intervalContainsTimestampGeneral,
//   intervalForTimestamp as intervalForTimestampGeneral,
//   intervalIntersectionWithInterval as intervalIntersectionWithIntervalGeneral,
//   intervalIsAdjacentToInterval as intervalIsAdjacentToIntervalGeneral,
//   intervalIsStrictlyAfterInterval as intervalIsStrictlyAfterIntervalGeneral,
//   intervalIsStrictlyBeforeInterval as intervalIsStrictlyBeforeIntervalGeneral,
//   intervalMergeWithInterval as intervalMergeWithIntervalGeneral,
//   intervalOverlapsInterval as intervalOverlapsIntervalGeneral,
//   intervalUnionWithInterval as intervalUnionWithIntervalGeneral,
//   sortIntervals as sortIntervalsGeneral,
//   unionOfIntervals as unionOfIntervalsGeneral,
// } from "../shared/stdlib";

// export const compareBounds = compareBoundsGeneral;
// export const intervalCompareWithInterval = intervalCompareWithIntervalGeneral;
// export const intervalContainsInterval = intervalContainsIntervalGeneral;
// export const intervalContainsTimestamp = intervalContainsTimestampGeneral;
// export const intervalForTimestamp = intervalForTimestampGeneral;
// export const intervalIntersectionWithInterval =
//   intervalIntersectionWithIntervalGeneral;
// export const intervalIsAdjacentToInterval = intervalIsAdjacentToIntervalGeneral;
// export const intervalIsStrictlyAfterInterval =
//   intervalIsStrictlyAfterIntervalGeneral;
// export const intervalIsStrictlyBeforeInterval =
//   intervalIsStrictlyBeforeIntervalGeneral;
// export const intervalMergeWithInterval = intervalMergeWithIntervalGeneral;
// export const intervalOverlapsInterval = intervalOverlapsIntervalGeneral;
// export const intervalUnionWithInterval = intervalUnionWithIntervalGeneral;
// export const sortIntervals = sortIntervalsGeneral;
// export const unionOfIntervals = unionOfIntervalsGeneral;
export const buildSubgraph = (
  data: {
    entities: Entity[];
    entityTypes: EntityTypeWithMetadata[];
    propertyTypes: PropertyTypeWithMetadata[];
    dataTypes: DataTypeWithMetadata[];
  },
  rootRecordIds: EntityRecordId[],
  depths: GraphResolveDepths,
) => buildSubgraphGeneral<false>(data, rootRecordIds, depths, undefined);

export const getPropertyTypesReferencedByEntityType =
  getPropertyTypesReferencedByEntityTypeGeneral;
export const getIncomingLinksForEntity = (
  subgraph: Subgraph,
  entityId: EntityId,
) => getIncomingLinksForEntityGeneral<false>(subgraph, entityId);
export const getLeftEntityForLinkEntity = (
  subgraph: Subgraph,
  entityId: EntityId,
) => getLeftEntityForLinkEntityGeneral<false>(subgraph, entityId)?.pop();
export const getOutgoingLinkAndTargetEntities = <
  LinkAndRightEntities extends LinkEntityAndRightEntity[] = LinkEntityAndRightEntity[],
>(
  subgraph: Subgraph,
  entityId: EntityId,
) =>
  getOutgoingLinkAndTargetEntitiesGeneral<false, LinkAndRightEntities>(
    subgraph,
    entityId,
  );
export const getOutgoingLinksForEntity = (
  subgraph: Subgraph,
  entityId: EntityId,
) => getOutgoingLinksForEntityGeneral<false>(subgraph, entityId);
export const getRightEntityForLinkEntity = (
  subgraph: Subgraph,
  entityId: EntityId,
) => getRightEntityForLinkEntityGeneral<false>(subgraph, entityId)?.pop();
export const getDataTypeById = getDataTypeByIdGeneral;
export const getDataTypeByVertexId = getDataTypeByVertexIdGeneral;
export const getDataTypes = getDataTypesGeneral;
export const getDataTypesByBaseUri = getDataTypesByBaseUriGeneral;
export const getEntities = (subgraph: Subgraph) =>
  getEntitiesGeneral<false>(subgraph, true);
export const getEntityRevision = (subgraph: Subgraph, entityId: EntityId) =>
  getEntityRevisionGeneral<false>(subgraph, entityId);
// export const getEntityRevisionsByEntityId = (
//   subgraph: Subgraph,
//   entityId: EntityId,
// ) => getEntityRevisionsByEntityIdGeneral<false>(subgraph, entityId);
export const getEntityTypeById = getEntityTypeByIdGeneral;
export const getEntityTypeByVertexId = getEntityTypeByVertexIdGeneral;
export const getEntityTypes = getEntityTypesGeneral;
export const getEntityTypesByBaseUri = getEntityTypesByBaseUriGeneral;
// export const mapElementsIntoRevisions = <
//   GraphElementType extends Vertex["inner"],
// >(
//   elements: GraphElementType[],
// ) => mapElementsIntoRevisionsGeneral<false, GraphElementType>(elements);
export const getPropertyTypeById = getPropertyTypeByIdGeneral;
export const getPropertyTypeByVertexId = getPropertyTypeByVertexIdGeneral;
export const getPropertyTypes = getPropertyTypesGeneral;
export const getPropertyTypesByBaseUri = getPropertyTypesByBaseUriGeneral;
export const getRoots = <RootType extends SubgraphRootType>(
  subgraph: Subgraph<RootType>,
) => getRootsGeneral(subgraph);
export const isDataTypeRootedSubgraph = isDataTypeRootedSubgraphGeneral<false>;
export const isEntityRootedSubgraph = isEntityRootedSubgraphGeneral<false>;
export const isEntityTypeRootedSubgraph =
  isEntityTypeRootedSubgraphGeneral<false>;
export const isPropertyTypeRootedSubgraph =
  isPropertyTypeRootedSubgraphGeneral<false>;
// export const getLatestInstantIntervalForSubgraph =
//   getLatestInstantIntervalForSubgraphGeneral<false>;
