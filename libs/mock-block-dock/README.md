# Mock Block Dock

Mock datastore and embedding application for testing [Block Protocol](https://blockprotocol.org) blocks.

`yarn add mock-block-dock`

`MockBlockDock` is automatically included the template generated using [create-block-app](https://www.npmjs.com/package/create-block-app)

See the docs for help with the fundamental Block Protocol concepts [Block Protocol](https://blockprotocol.org/docs)

## Usage

There are two options for usage:

1.  Use the component `MockBlockDock`, and pass it your block source, to have it automatically:

- render your block
- pass it its starting properties
- listen for messages from the block, updates the datastore and respond appropriately

1.  Use the hook `useMockBlockProps`, which returns the mock data, properties and message callbacks for your custom use.

### Component: mock embedding application

```js
import { MockBlockDock } from "mock-block-dock";
```

The component will automatically load your block, pass it properties (where it accepts properties),
and listen for messages from the block, responding accordingly.

The properties passed are described in the full [Block Protocol documentation]((https://blockprotocol.org/docs).

For example, if you call `updateEntity`, MockBlockDock will update the specified entity and return it.
If the entity is part of the properties sent to your block, they will be updated and the block re-rendered.

```typescript
const { data, errors } = await graphService.updateEntity({
  entityId,
  properties: newProps,
});
```

There are different ways of loading your block source depending on the entry point.

For each, you can set the block's starting entity via the `blockEntity` prop:

```typescript
const blockEntity: Entity = {
  entityId: "test-id-1",
  properties: {
    name: "World",
  },
};
```

#### React

When developing a React block, pass your component

```jsx
import { MockBlockDock } from "mock-block-dock";

import MyBlock from "./my-block.tsx";

<MockBlockDock
  blockDefinition={{ ReactComponent: MyBlock }}
  blockEntity={blockEntity}
/>;
```

#### Custom element / Web Component

When developing a custom element block, pass `MockBlockDock` the class and the desired tag name.

```jsx
import { MockBlockDock } from "mock-block-dock";

import MyCustomElement from "./my-custom-element.ts";

<MockBlockDock
  blockDefinition={{
    customElement: { elementClass: MyCustomClass, tagName: "my-block" },
  }}
  properties={blockEntity}
/>;
```

#### Debug mode

When passed `debug=true`, `MockBlockDock` will also render a display of:

1.  the properties being passed to the blocks (for non-HTML blocks), which are derived from the mock datastore
1.  the raw contents of the mock datastore

### Hook: custom, manual control

If you want more control or visibility over the mock properties, you can retrieve them as a hook instead,
and pass them to your block yourself.

You should pass `blockProperties` to set your block's starting properties.

```jsx
import { useMockBlockProps } from "mock-block-dock";

const {
  blockProperties,
  blockProtocolFunctions,
  entityTypes,
  linkedAggregations,
  linkedEntities,
  linkGroups,
} = useMockBlockProps({
  blockProperties,
  blockSchema,
});
```

## Customising the mock data

With either the hook or component you can also pass the following optional arguments to customise the datastore:

- `initialEntities`
- `initialEntityTypes`
- `initialLinks`
- `initialLinkedAggregations`

For any omissions, the default mock data in `src/data/*` will be used.

These dummy records will be in the data store, and your block can discover them by calling `aggregateEntityTypes` or `aggregateEntities`.

```jsx
<MockBlockDock
  initialEntities={[
    // other entities for your block to use can be loaded into the datastore here
    {
      entityId: "my-dummy-entity",
      entityTypeId: "dummy",
      myOtherEntitysProperty: "foo",
    },
  ]}
>
  <TestBlock myBlockProperty="bar" /> // starting properties for your block
  should still be set here
</MockBlockDock>
```
