import { EntityId } from "../entity";
import { KnowledgeGraphOutwardEdge } from "./edges/outward-edge";
import { Timestamp } from "./time";

/** @todo - Add ontology edges here */
export type Edges = {
  [_: EntityId]: {
    [_: Timestamp]: KnowledgeGraphOutwardEdge[];
  };
};
