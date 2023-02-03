import { BaseUri } from "@blockprotocol/type-system/slim";

import { EntityId } from "../entity.js";
import { OntologyTypeRevisionId } from "../ontology";
import { Timestamp } from "../temporal-versioning.js";
import { KnowledgeGraphOutwardEdge } from "./edges/variants/knowledge.js";
import { OntologyOutwardEdge } from "./edges/variants/ontology.js";

export * from "./edges/kind.js";
export * from "./edges/outward-edge.js";
export * from "./edges/variants.js";

export type OntologyRootedEdges = Record<
  BaseUri,
  Record<OntologyTypeRevisionId, OntologyOutwardEdge[]>
>;

export type KnowledgeGraphRootedEdges = Record<
  EntityId,
  Record<Timestamp, KnowledgeGraphOutwardEdge[]>
>;

export type Edges = OntologyRootedEdges & KnowledgeGraphRootedEdges;
