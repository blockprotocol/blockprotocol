/** @todo - Add the Ontology type edge kinds */

const KNOWLEDGE_GRAPH_EDGE_KIND = [
  "HAS_LEFT_ENTITY",
  "HAS_RIGHT_ENTITY",
] as const;

export type KnowledgeGraphEdgeKind = typeof KNOWLEDGE_GRAPH_EDGE_KIND[number];

export const isKnowledgeGraphEdgeKind = (
  kind: string,
): kind is KnowledgeGraphEdgeKind => {
  return (KNOWLEDGE_GRAPH_EDGE_KIND as ReadonlyArray<string>).includes(kind);
};
