import { MockData } from "../useMockDatastore";
import { entities } from "./entities";
import { entityTypes } from "./entityTypes";
import { linkedAggregationDefinitions } from "./linkedAggregationDefinitions";
import { links } from "./links";

export const mockData: MockData = {
  entities,
  entityTypes,
  links,
  linkedAggregationDefinitions,
};
