import { AggregateEntitiesResult, AggregateOperationInput } from "./entity.js";
import { EntityRootType, Subgraph } from "./subgraph.js";

export type LinkedAggregationDefinition = {
  aggregationId: string;
  sourceEntityId: string;
  path: string;
  operation: AggregateOperationInput;
};

export type LinkedAggregation = Omit<LinkedAggregationDefinition, "operation"> &
  AggregateEntitiesResult<Subgraph<EntityRootType>>;

export type GetLinkedAggregationData = {
  aggregationId: string;
};

export type CreateLinkedAggregationData = Omit<
  LinkedAggregationDefinition,
  "aggregationId"
>;

export type UpdateLinkedAggregationData = {
  aggregationId: string;
  operation: LinkedAggregationDefinition["operation"];
};

export type DeleteLinkedAggregationData = {
  aggregationId: string;
};
