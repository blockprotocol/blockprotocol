export interface OutgoingEdgeResolveDepth {
  outgoing: number;
}

export interface EdgeResolveDepths {
  incoming: number;
  outgoing: number;
}

/** @todo - Add documentation */
export type GraphResolveDepths = {
  hasLeftEntity: EdgeResolveDepths;
  hasRightEntity: EdgeResolveDepths;

  // @todo decide if these should be required
  constrainsLinkDestinationsOn?: OutgoingEdgeResolveDepth;
  constrainsLinksOn?: OutgoingEdgeResolveDepth;
  constrainsPropertiesOn?: OutgoingEdgeResolveDepth;
  constrainsValuesOn?: OutgoingEdgeResolveDepth;
  inheritsFrom?: OutgoingEdgeResolveDepth;
  isOfType?: OutgoingEdgeResolveDepth;
};
