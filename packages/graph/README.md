# WORK IN PROGRESS

This package supports the forthcoming Block Protocol v0.2, and is not currently intended for public use.

Check back soon for full instructions.

# Block Protocol – Graph service

This package implements the Block Protocol Graph service for blocks and embedding applications.

To get started:

1.  `yarn add @blockprotocol/graph` or `npm install @blockprotocol/graph`
2.  Follow the instructions to use the graph service as a [block](#blocks) or an [embedding application](#embedding-applications)

## Blocks

To create a GraphBlockHandler, pass the constructor an element in your block, along with any callbacks you wish to register to handle incoming messages.

**React example**

```javascript
import React from "react";
import { GraphBlockHandler } from "@blockprotocol/graph";

export const App = () => {
  const blockRef = React.useRef<HTMLDivElement>(null);

  const [graphService, setGraphService] = React.useState<BlockGraphHandler>();
  useEffect(() => {
    if (blockRef.current) {
      setGraphService(new BlockGraphHandler({ element: blockRef.current }));
    }
  }, []);

  return (
      <div ref={blockRef} />
  )
}
```

**Custom element example**

```javascript
import { GraphBlockHandler } from "@blockprotocol/graph";

class MyBlock extends HTMLButtonElement {
  constructor() {
    super();
    this.graphService = new GraphBlockHandler({ element: this });
  }
}
```

https://blockprotocol.org/docs will include further usage instructions when 0.2 is released.

## Embedding applications

To create a GraphEmbedderHandler, pass the constructor:

1.  An `element` wrapping your block
1.  `callbacks` to respond to messages from the block
1.  The starting values for any of the following messages you implement:

- `blockEntity`
- `blockGraph`
- `linkedAggregations`

**Example**

```typescript
import { GraphBlockHandler } from "@blockprotocol/graph";

const graphService = new EmbedderGraphHandler({
  blockEntity: { entityId: "123", properties: { name: "Bob" } },
  callbacks: {
    updateEntity: ({ data }) => updateEntityInYourDatastore(data),
  },
  element: elementWrappingTheBlock,
});
```
