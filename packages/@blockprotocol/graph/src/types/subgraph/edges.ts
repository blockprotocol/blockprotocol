import { BaseUri } from "@blockprotocol/type-system/slim";

import { EntityId } from "../entity";
import {
  KnowledgeGraphOutwardEdge,
  OntologyOutwardEdge,
} from "./edges/outward-edge";
import { Timestamp } from "./time";

export type Edges = {
  [_: BaseUri]: {
    [_: number]: OntologyOutwardEdge[];
  };
} & {
  [_: EntityId]: {
    [_: Timestamp]: KnowledgeGraphOutwardEdge[];
  };
};
