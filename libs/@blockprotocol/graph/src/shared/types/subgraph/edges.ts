import { BaseUrl } from "@blockprotocol/type-system/slim";

import { EntityId } from "../entity.js";
import { OntologyTypeRevisionId } from "../ontology.js";
import { Timestamp } from "../temporal-versioning.js";
import { KnowledgeGraphOutwardEdge } from "./edges/variants/knowledge.js";
import { OntologyOutwardEdge } from "./edges/variants/ontology.js";

export * from "./edges/kind.js";
export * from "./edges/outward-edge.js";
export * from "./edges/variants.js";

export type OntologyRootedEdges<Temporal extends boolean> = Record<
  BaseUrl,
  Record<OntologyTypeRevisionId, OntologyOutwardEdge<Temporal>[]>
>;

export type KnowledgeGraphRootedEdges<Temporal extends boolean> = Record<
  EntityId,
  Record<Timestamp, KnowledgeGraphOutwardEdge<Temporal>[]>
>;

// We technically want to intersect (`&`) the types here, but as their property keys overlap it confuses things and we
// end up with unsatisfiable values like `EntityVertex & DataTypeVertex`. While the union (`|`) is semantically
// incorrect, it structurally matches the types we want.
export type Edges<Temporal extends boolean> =
  | OntologyRootedEdges<Temporal>
  | KnowledgeGraphRootedEdges<Temporal>;
