import { BaseUri } from "@blockprotocol/type-system/slim";

import { EntityId } from "../entity.js";
import {
  KnowledgeGraphOutwardEdge,
  OntologyOutwardEdge,
} from "./edges/outward-edge.js";
import { Timestamp } from "./time.js";

export * from "./edges/kind.js";
export * from "./edges/outward-edge.js";

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
