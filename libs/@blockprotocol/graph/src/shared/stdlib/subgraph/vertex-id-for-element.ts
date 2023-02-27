import {
  EntityRecordId,
  GraphElementVertexId,
  OntologyTypeRecordId,
  Subgraph,
} from "../../types.js";
import { typedEntries } from "../../util.js";

/**
 * Searches the vertices of the subgraph for an element that matches a given {@link EntityRecordId} or
 * {@link OntologyTypeRecordId}, and returns the associated {@link GraphElementVertexId}.
 *
 * @param subgraph
 * @param recordId
 * @throws if no {@link Vertex} is found that contains the provided RecordId within its metadata
 */
export const getVertexIdForRecordId = (
  subgraph: Subgraph<boolean>,
  recordId: EntityRecordId | OntologyTypeRecordId,
): GraphElementVertexId => {
  for (const [baseId, revisionObject] of typedEntries(subgraph.vertices)) {
    for (const [revisionId, vertex] of typedEntries(revisionObject)) {
      if (vertex.inner.metadata.recordId === recordId) {
        return {
          baseId,
          revisionId,
        };
      }
    }
  }

  throw new Error(
    `Could not find vertex associated with recordId: ${JSON.stringify(
      recordId,
    )}`,
  );
};
