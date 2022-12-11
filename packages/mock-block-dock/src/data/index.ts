import { MockData } from "../datastore/use-mock-datastore";
import { entities } from "./entities";
import { entityTypes } from "./entity-types";
import { linkedAggregationDefinitions } from "./linked-aggregation-definitions";
import { links } from "./links";

export const mockData: MockData = {
  entities,
  entityTypes,
  links,
  linkedAggregationDefinitions,
};
