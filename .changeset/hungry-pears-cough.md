---
"@blockprotocol/graph": minor
---

Ensure non-temporal BP methods have a non-temporal return, even when passed a temporal subgraph. Add `rewriteTypeId` parameter to the codegen script. Gracefully handle non-intersecting edges in `getIncomingLinksForEntity` and `getOutgoingLinksForEntity`.
