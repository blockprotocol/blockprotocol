import {
  Entity,
  EntityType,
  Link,
  LinkedAggregation,
} from "@blockprotocol/graph";

/** @todo type as JSON Schema. */
export type BlockSchema = Record<string, any>;

/** @todo possibly extend this type */
export type BlockExampleGraph = {
  entities?: Entity[];
  entityTypes?: EntityType[];
  links?: Link[];
  linkedAggregations?: LinkedAggregation[];
};
