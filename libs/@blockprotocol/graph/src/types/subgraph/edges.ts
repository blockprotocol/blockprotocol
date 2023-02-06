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

// We technically want to intersect (`&`) the types here, but as their property keys overlap it confuses things and we
// end up with unsatisfiable values like `EntityVertex & DataTypeVertex`. While the union (`|`) is semantically
// incorrect, it structurally matches the types we want.
export type Edges = OntologyRootedEdges | KnowledgeGraphRootedEdges;
