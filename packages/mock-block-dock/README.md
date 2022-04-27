# Mock Block Dock

A component which provides mocks for testing [Block Protocol](https://blockprotocol.org) blocks.

## Usage

When developing a block, wrap it in the embedder and pass your block its initial props:

```jsx
<MockBlockDock>
  <TestBlock {...props} />
</MockBlockDock>
```

The embedder will automatically pass the following Block Protocol functions to your block:

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
- `uploadFile`

For example, to update your block's props, get `entityId` and `updateEntities` from props and call:

```typescript
updateEntities?.([{ entityId, data: { ...newProps } }]);
```

Your block will be re-rendered with its new properties.

It will also pass `linkGroups` and `linkedEntities`, which will be populated once you create links between entities using `createLinks` (see [linking entities](https://blockprotocol.org/spec/block-types#linking-entities) for more).

The block will also be re-rendered with new properties if you update them on the child directly (e.g. if you are supplying the block component wrapped by `MockBlockDock` with props from some outside state).

`MockBlockDock` is automatically included in [block-template](https://www.npmjs.com/package/block-template), which you can copy via [create-block-app](https://www.npmjs.com/package/create-block-app)

## Mock entities

`MockBlockDock` automatically supplies additional dummy entities and entity types in `src/data/entities.ts` and `src/data/entityTypes.ts`, and links between entities in `src/data/links.ts`.

These dummy entities/links will be in the data store, and your block can discover them by calling `aggregateEntityTypes` or `aggregateEntities`.

If you prefer, you can provide your own `initialEntities` and/or `initialEntityTypes` and/or `initialLinks` as props.

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

## Note

Only a subset of functionality listed in the [Block Protocol spec](https://blockprotocol.org/spec) is currently supported.

We will be adding more in the coming weeks.
