## Block Protocol – Service Module

This package implements the Block Protocol Service module for blocks and embedding applications.

To get started:

1.  `yarn add @blockprotocol/service` or `npm install @blockprotocol/service`
1.  Follow the instructions to use the service module as a [block](#blocks) or an [embedding application](#embedding-applications)

## Blocks

To create a `ServiceBlockHandler`, pass the constructor an element in your block, along with any callbacks you wish to register to handle incoming messages.

### React example

For React, we provide a `useServiceBlockModule` hook, which accepts a `ref` to an element, and optionally any `callbacks` you wish to provide on initialization.

### Custom elements

<!-- TODO - https://app.asana.com/0/0/1204003986334469/f -->

## Embedding applications

You should construct one `ServiceEmbedderHandler` per block.

It is not currently possible to wrap multiple blocks with a single handler.

To create a `ServiceEmbedderHandler`, pass the constructor:

1.  An `element` wrapping your block
1.  `callbacks` to respond to messages from the block

```typescript
import { ServiceEmbedderHandler } from "@blockprotocol/service";

const serviceModule = new ServiceEmbedderHandler({
  callbacks: { ... },
  element: elementWrappingTheBlock,
});
```

### React

For React embedding applications, we provide a `useServiceEmbedderModule` hook, which accepts a `ref` to an element, and optionally any additional constructor arguments you wish to pass.

```tsx
import { useServiceEmbedderModule } from "@blockprotocol/service";
import { useRef } from "react";

export const App = () => {
  const wrappingRef = useRef<HTMLDivElement>(null);

  const { serviceModule } = useGraphEmbedderService(blockRef);

  return (
    <div ref={wrappingRef}>
      <Block />
    </div>
  );
};
```
