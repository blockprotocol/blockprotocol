# React Remote Block

A component which will load a [Block Protocol](https://blockprotocol.org) blocks.

## Usage

When developing a block, wrap it in the embedder and pass your block its initial props:

```jsx
<RemoteBlock
    blockMetadata={}
    sourceUrl={"https://blockprotocol.org/blocks/@hash/code"}
/>
```

## Props

| name              | type      | required | default | description                                                                         |
| ----------------- | --------- | -------- | ------- | ----------------------------------------------------------------------------------- |
| `blockMetadata`   | `object`  | no       |         | the block's block-metadata.json. Used to determine Web Component tag names.         |
| `blockProperties` | `object`  | yes      |         | the block's own properties, and BP-specified properties (e.g. entityId, linkGroups) |
| `crossFrame`      | `boolean` | no       | `false` | whether this block should make requests to the parent window for block source       |

## External dependencies

A block may indicate `externals` in `block-metadata.json` ([docs](https://blockprotocol.org/spec/block-types)).

These are libraries the blocks expects the embedding application to supply it with under externals,
to save every block bundling its own copy.

```typescript
const blockDependencies: Record<string, any> = {
  react: require("react"),
  "react-dom": require("react-dom"),
};
```

## Source Caching

## Inside iFrames

## Blocks supported

The component will parse and render blocks which are defined as:

- React components (i.e. a JavaScript file which exports a React component)
- Web Components (i.e. a JavaScript file which exports a custom element class)
- HTML (i.e. an HTML file, which may in turn load other assets)

For JavaScript files, the exported component must be one of:

1.  the default export from the file
2.  the only named export in the file
3.  an export named `App`

## Acknowledgements

The `useRemoteBlock` hook was adapted from [Paciolan/remote-component](https://github.com/Paciolan/remote-component)
