export interface EdgeResolveDepths {
  incoming: number;
  outgoing: number;
}

/** @todo - Add documentation */
/** @todo - expand this with ontology - related edges */
export type GraphResolveDepths = {
  hasLeftEntity: EdgeResolveDepths;
  hasRightEntity: EdgeResolveDepths;
};
