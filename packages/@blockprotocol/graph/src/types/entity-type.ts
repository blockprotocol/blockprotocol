import { AggregateOperationInput } from "./entity";

export type EntityType = {
  entityTypeId: string; // @todo consider removing this and just using $id, the URI
  schema: {
    $id: string;
    $schema: string;
    title: string;
    type: string;
    labelProperty?: string;
    [key: string]: unknown;
  };
};

export type CreateEntityTypeData = {
  schema: EntityType["schema"];
};

export type AggregateEntityTypesData = {
  // @todo mention in spec or remove
  // include entities that are used by, but don't belong to, the specified account
  includeOtherTypesInUse?: boolean | null;
  operation?: Omit<AggregateOperationInput, "entityTypeId"> | null;
};

export type GetEntityTypeData = {
  entityTypeId: string;
};

export type UpdateEntityTypeData = {
  entityTypeId: string;
  schema: EntityType["schema"];
};

export type DeleteEntityTypeData = {
  entityTypeId: string;
};
