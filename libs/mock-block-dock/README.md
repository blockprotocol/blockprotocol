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
const { data, errors } = await graphModule.updateEntity({
  entityId,
  properties: newProps,
});
```

There are different ways of loading your block source depending on the entry point.

For each, you can set the block's starting entity by providing it among `initialData.initialEntities` and
identifying it via the `blockEntityRecordId` prop (see examples below))

```typescript
const blockEntity: Entity = {
  metadata: {
    recordId: {
      entityId: "entity-1", // the entity's unique, stable identifier
      editionId: new Date(0).toISOString(), // the specific edition/version identifier
    },
    entityTypeId: "https://example.com/my-types/entity-types/person/v/1",
  },
  properties: { "https://example.com/my-types/property-type/name/": "World" },
};
```

#### React

When developing a React block, pass your component

```jsx
import { MockBlockDock } from "mock-block-dock";

import MyBlock from "./my-block.tsx";

<MockBlockDock
  blockDefinition={{ ReactComponent: MyBlock }} // provide the block source code
  blockEntityRecordId={blockEntity.metadata.recordId} // identifies the block entity among the initial entities
  debug // show the debug UI on startup
  initialData={{
    initialEntities: [blockEntity], // initial entities to load into the mock datastore
  }}
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
  blockEntityRecordId={blockEntity.metadata.recordId} // identifies the block entity among the initial entities
  debug // show the debug UI on startup
  initialData={{
    initialEntities: [blockEntity], // initial entities to load into the mock datastore
  }}
/>;
```

#### Debug mode

When passed `debug=true`, `MockBlockDock` will also render a display of:

1.  the properties being passed to the blocks (for non-HTML blocks), which are derived from the mock datastore
1.  the raw contents of the mock datastore

### Hook: custom, manual control

If you want more control or visibility over the mock properties, you can retrieve them as a hook instead,
and pass them to your block yourself.

You should pass `initialData` and `blockEntityRecordId` to set the starting datastore and identify the block entity.

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
  blockEntityRecordId: blockEntity.metadata.recordId,
  initialData: { initialEntities: [blockEntity] },
});
```
