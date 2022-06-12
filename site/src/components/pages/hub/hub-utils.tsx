import {
  BlockProtocolEntity,
  BlockProtocolEntityType,
  BlockProtocolLink,
  BlockProtocolLinkedAggregation,
} from "blockprotocol";

/** @todo type as JSON Schema. */
export type BlockSchema = Record<string, any>;

/** @todo possibly extend this type */
export type BlockExampleGraph = {
  entities?: BlockProtocolEntity[];
  entityTypes?: BlockProtocolEntityType[];
  links?: BlockProtocolLink[];
  linkedAggregations?: BlockProtocolLinkedAggregation[];
};
