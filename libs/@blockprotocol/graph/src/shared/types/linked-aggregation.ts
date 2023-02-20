import { AggregateEntitiesResult, AggregateOperationInput } from "./entity";
import { EntityRootType, Subgraph } from "./subgraph";

export type LinkedAggregationDefinition = {
  aggregationId: string;
  sourceEntityId: string;
  path: string;
  operation: AggregateOperationInput;
};

export type LinkedAggregation<Temporal extends boolean> = Omit<
  LinkedAggregationDefinition,
  "operation"
> &
  AggregateEntitiesResult<
    Temporal,
    Subgraph<Temporal, EntityRootType<Temporal>>
  >;

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
