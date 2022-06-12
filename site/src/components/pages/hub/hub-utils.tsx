import {
  BlockProtocolEntity,
  BlockProtocolEntityType,
  BlockProtocolLink,
  BlockProtocolLinkedAggregation,
} from "blockprotocol";

/** @todo type as JSON Schema. */
export type BlockSchema = Record<string, any>;

/** @todo revisit type this */
export type BlockExampleGraph = {
  entities?: BlockProtocolEntity[];
  entityTypes?: BlockProtocolEntityType[];
  links?: BlockProtocolLink[];
  linkedAggregations?: BlockProtocolLinkedAggregation[];
};
