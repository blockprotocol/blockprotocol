import { BaseUri } from "@blockprotocol/type-system/slim";

import { EntityId } from "../entity";
import { OntologyTypeRevisionId } from "../ontology";
import { Timestamp } from "../temporal-versioning";
import { KnowledgeGraphOutwardEdge } from "./edges/variants/knowledge";
import { OntologyOutwardEdge } from "./edges/variants/ontology";

export * from "./edges/kind";
export * from "./edges/outward-edge";
export * from "./edges/variants";

export type OntologyRootedEdges<Temporal extends boolean> = Record<
  BaseUri,
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
