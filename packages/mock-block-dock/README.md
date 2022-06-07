# Mock Block Dock

Mock datastore and functions for testing [Block Protocol](https://blockprotocol.org) blocks.

Use as a component to wrap your block, or as a hook.

`yarn add mock-block-dock`

## Usage

### Wrapper component

When developing a block, wrap it in `MockBlockDock` and pass your block its initial props:

```jsx
import { MockBlockDock } from "mock-block-dock";

<MockBlockDock>
  <TestBlock
    entityId="optional-custom-entity-id"
    {...blocksStartingProperties}
  />
</MockBlockDock>;
```

`MockBlockDock` will automatically pass the following Block Protocol functions to your block:

- `aggregateEntities`
- `aggregateEntityTypes`
- `getEntities`
- `createEntities`
- `deleteEntities`
- `updateEntities`
- `getLinks`
- `createLinks`
- `deleteLinks`
- `updateLinks`
- `getLinkedAggregations`
- `createLinkedAggregations`
- `deleteLinkedAggregations`
- `updateLinkedAggregations`
- `uploadFile`

...as well as the starting properties you pass to your block (if any),
and a fallback `entityId` if you do not provide one as part of the block's starting properties.

For example, to update your block's props, get `entityId` and `updateEntities` from props and call:

```typescript
updateEntities?.([{ entityId, data: { ...newProps } }]);
```

Your block will be re-rendered with its new properties.

`MockBlockDock` will also pass:

- `linkGroups` and `linkedEntities`, which will be populated once you create a `Link` between entities using `createLinks` (see [linking entities](https://blockprotocol.org/spec/block-types#linking-entities) for more).
- `linkedAggregations`, which will be populated if you create a `LinkedAggregation` from an entity to an aggregation of entities, using `createLinkedAggregations` – this includes both the definition of the aggregation operation, and the results of the operation.

The block will also be re-rendered with new properties if you update them on the child directly (e.g. if you are supplying the block component wrapped by `MockBlockDock` with props from some outside state).

`MockBlockDock` is automatically included in [block-template](https://www.npmjs.com/package/block-template), which you can copy via [create-block-app](https://www.npmjs.com/package/create-block-app)

### Hook

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

As with the component, you can also pass the following optional arguments to customise the datastore:

- `initialEntities`
- `initialEntityTypes`
- `initialLinks`
- `initialLinkedAggregations`

## Mock entities

`MockBlockDock` automatically supplies additional dummy entities and entity types in `src/data/entities.ts` and `src/data/entityTypes.ts`, and links between entities in `src/data/links.ts`.

These dummy entities/links will be in the data store, and your block can discover them by calling `aggregateEntityTypes` or `aggregateEntities`.

If you prefer, you can provide your own `initialEntities` and/or `initialEntityTypes` and/or `initialLinks` and/or `initialLinkedAggregations` as props.

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
