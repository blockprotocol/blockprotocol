import { BaseUri } from "@blockprotocol/type-system/slim";

import { EntityId } from "../entity.js";
import { Timestamp } from "../temporal-versioning.js";
import { KnowledgeGraphOutwardEdge } from "./edges/variants/knowledge.js";
import { OntologyOutwardEdge } from "./edges/variants/ontology.js";

export * from "./edges/kind.js";
export * from "./edges/outward-edge.js";
export * from "./edges/variants.js";

/** @todo - Re-express these and `Vertices` as `Record`s? */

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
