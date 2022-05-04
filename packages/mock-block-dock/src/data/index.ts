import { entities } from "./entities";
import { entityTypes } from "./entityTypes";
import { links } from "./links";
import { MockData } from "../useMockDatastore";
import { linkedAggregationDefinitions } from "./linkedAggregationDefinitions";

export const mockData: MockData = {
  entities,
  entityTypes,
  links,
  linkedAggregationDefinitions,
};
