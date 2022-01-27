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

`MockBlockDock is` automatically included in [block-template](https://www.npmjs.com/package/block-template), which you can copy via [create-block-app](https://www.npmjs.com/package/create-block-app)

## Note

Only a subset of functionality listed in the [Block Protocol spec](https://blockprotocol.org/spec) is currently supported.

We will be adding more in the coming weeks.
