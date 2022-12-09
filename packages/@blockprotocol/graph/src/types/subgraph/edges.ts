import { BaseUri } from "@blockprotocol/type-system/slim";

import { EntityId } from "../entity";
import {
  KnowledgeGraphOutwardEdge,
  OntologyOutwardEdge,
} from "./edges/outward-edge";
import { Timestamp } from "./time";

export * from "./edges/kind";
export * from "./edges/outward-edge";

export type OntologyRootedEdges = {
  [typeBaseUri: BaseUri]: {
    [typeVersion: number]: OntologyOutwardEdge[];
  };
};

export type KnowledgeGraphRootedEdges = {
  [entityId: EntityId]: {
    [edgeFirstCreatedAt: Timestamp]: KnowledgeGraphOutwardEdge[];
  };
};

export type Edges = OntologyRootedEdges & KnowledgeGraphRootedEdges;
