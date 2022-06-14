# WORK IN PROGRESS

This package supports the forthcoming Block Protocol v0.2, and is not currently intended for public use.

Check back soon for full instructions.

## Block Protocol – Graph service

This package implements the Block Protocol Graph service for blocks and embedding applications.

To get started:

1.  `yarn add @blockprotocol/graph` or `npm install @blockprotocol/graph`
1.  Follow the instructions to use the graph service as a [block](#blocks) or an [embedding application](#embedding-applications)

## Blocks

To create a GraphBlockHandler, pass the constructor an element in your block, along with any callbacks you wish to register to handle incoming messages.

### React example

For React, we provide a `useGraphBlockService` hook, which accepts a `ref` to an element, and optionally any `callbacks` you wish to provide on initialization.

```javascript
import React from "react";

import { useGraphBlockService } from "@blockprotocol/graph";

export const App = () => {
  const blockRef = React.useRef < HTMLDivElement > null;

  const { graphService } = useGraphBlockService(blockRef);

  return <div ref={blockRef} />;
};
```

### Custom element example

```javascript
import { BlockElementBase } from "@blockprotocol/graph";

export class MyBlock extends BlockElementBase {}
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

These starting values should also be passed in a `graph` property object, if the block can be passed or assigned properties.

```typescript
import { GraphEmbedderHandler } from "@blockprotocol/graph";

const graphService = new GraphEmbedderHandler({
  blockEntity: { entityId: "123", properties: { name: "Bob" } },
  callbacks: {
    updateEntity: ({ data }) => updateEntityInYourDatastore(data),
  },
  element: elementWrappingTheBlock,
});
```

### React example

For React, we provide a `useGraphEmbedderService` hook, which accepts a `ref` to an element, and optionally any
additional constructor arguments you wish to pass.

```javascript
import React from "react";

import { useGraphEmbedderService } from "@blockprotocol/graph";

export const App = () => {
  const wrappingRef = React.useRef < HTMLDivElement > null;

  const blockEntity = { entityId: "123", properties: { name: "Bob" } };

  const { graphService } = useGraphEmbedderService(blockRef, {
    blockEntity,
  });

  return (
    <div ref={wrappingRef}>
      <Block graph={{ blockEntity }} />
    </div>
  );
};
```
