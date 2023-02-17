## Block Protocol – Graph module

This package implements the Block Protocol Graph module for blocks and embedding applications.

If you are a block author, we have several templates available to get you started:

`npx create-block-app@latest --help`

If you want to roll your own, to get started:

1.  `yarn add @blockprotocol/graph` or `npm install @blockprotocol/graph`
1.  Follow the instructions to use the graph module as a [block](#blocks) or an [embedding application](#embedding-applications)

## Blocks

To create a `GraphBlockHandler`, pass the constructor an element in your block, along with any callbacks you wish to register to handle incoming messages.

### React example

For React, we provide a `useGraphBlockModule` hook, which accepts a `ref` to an element, and optionally any `callbacks` you wish to provide on initialization.

See `npx create-block-app@latest my-block --template react` for an example.

### Custom elements

For custom elements, this package exports a `BlockElementBase` class
which uses the [Lit](https://lit.dev/) framework, and sets `graphModule` on the instance.

See `npx create-block-app@latest my-block --template custom-element` for an example.

## Embedding applications

You should construct one `GraphEmbedderHandler` per block.

It is not currently possible to wrap multiple blocks with a single handler.

To create a `GraphEmbedderHandler`, pass the constructor:

1.  An `element` wrapping your block
1.  `callbacks` to respond to messages from the block
1.  The starting values for any of the following messages you implement:

- `blockEntity`
- `blockGraph`
- `linkedAggregations`

These starting values should also be passed in a `graph` property object, if the block can be passed or assigned properties.

```typescript
import { GraphEmbedderHandler } from "@blockprotocol/graph";

const graphModule = new GraphEmbedderHandler({
  blockEntity: { entityId: "123", properties: { name: "Bob" } },
  callbacks: {
    updateEntity: ({ data }) => updateEntityInYourDatastore(data),
  },
  element: elementWrappingTheBlock,
});
```

### React

For React embedding applications, we provide a `useGraphEmbedderModule` hook, which accepts a `ref` to an element, and optionally any additional constructor arguments you wish to pass.

```tsx
import { useGraphEmbedderModule } from "@blockprotocol/graph";
import { useRef } from "react";

export const App = () => {
  const wrappingRef = useRef<HTMLDivElement>(null);

  const blockEntity = { entityId: "123", properties: { name: "Bob" } };

  const { graphModule } = useGraphEmbedderModule(blockRef, {
    blockEntity,
  });

  return (
    <div ref={wrappingRef}>
      <Block graph={{ blockEntity }} />
    </div>
  );
};
```
