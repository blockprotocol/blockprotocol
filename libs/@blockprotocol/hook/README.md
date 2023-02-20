## Block Protocol – Hook Module

This package implements the Block Protocol Hook module for blocks and embedding applications.

To get started:

1.  `yarn add @blockprotocol/hook` or `npm install @blockprotocol/hook`
1.  Follow the instructions to use the hook module as a [block](#blocks) or an [embedding application](#embedding-applications)

## Blocks

To create a `HookBlockHandler`, pass the constructor an element in your block, along with any callbacks you wish to register to handle incoming messages.

To send a hook message, you call the `hook` function.

```typescript
import { HookBlockHandler } from "@blockprotocol/hook";

const handler = new HookBlockHandler({ element });

handler.hook({
  data: {
    hookId: null, // the embedding application will provide a hookId in response to use in future messages
    node, // a reference to the DOM node to render into
    type: "text", // the type of hook
    entityId: "entity1", // the id of the entity this hook will show/edit data for
    path: ["http://example.com/property-type/text/"], // the path in the entity's properties data will be taken from/saved to
  },
});
```

### React example

For React, we provide a `useHookBlockModule` hook, which accepts a `ref` to an element. This will return an object with the shape of `{ hookModule: HookBlockHandler | null }` which you can use to send hook messages.

We also provide a `useHook` hook to make sending hook messages easier.

```typescript
import { useHook } from "@blockprotocol/hook/react";

useHook(
  hookModule,
  nodeRef,
  "text",
  ["http://example.com/property-type/text/"],
  (node) => {
    node.innerText = "hook fallback";

    return () => {
      node.innerText = "";
    };
  },
);
```

Where `nodeRef` is a `RefObject` containing the DOM node you'd like to pass to the embedding application.

### Custom elements

There are no helpers for custom elements yet.

## Embedding applications

To create a `HookEmbedderHandler`, pass the constructor:

1.  An `element` wrapping your block
1.  `callbacks` to respond to messages from the block
1.  The starting values for any of the following messages you implement:

- `hook`

```typescript
import { HookEmbedderHandler } from "@blockprotocol/hook";

const hookIds = new WeakMap<HTMLElement, string>();
const nodes = new Map<string, HTMLElement>();

const generateId = () => (Math.random() + 1).toString(36).substring(7);

const hookModule = new HookEmbedderHandler({
  callbacks: {
    hook({ data }) {
      if (data.hookId) {
        const node = nodes.get(data.hookId);

        if (node) node.innerText = "";
        nodes.delete(data.hookId);
      }

      const hookId = data.hookId ?? generateId();

      if (data.node) {
        nodes.set(hookId, data.node);
        data.node.innerText = `Hook of type ${data.type} for path ${data.path}`;
      }

      return { hookId };
    },
  },
  element: elementWrappingTheBlock,
});
```

### React

For React embedding applications, we provide a `useHookEmbedderModule` hook, which accepts a `ref` to an element, and optionally any additional constructor arguments you wish to pass.

```tsx
import { useHookEmbedderModule } from "@blockprotocol/hook/react";
import { useRef } from "react";

export const App = () => {
  const wrappingRef = useRef<HTMLDivElement>(null);

  useHookEmbedderModule(blockRef, {
    hook({ data }) {
      // As above
    },
  });

  return (
    <div ref={wrappingRef}>
      <Block />
    </div>
  );
};
```
