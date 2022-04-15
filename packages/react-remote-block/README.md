# React Remote Block

A component which will load a [Block Protocol](https://blockprotocol.org) blocks.

## Usage

When developing a block, wrap it in the embedder and pass your block its initial props:

```jsx
<RemoteBlock sourceUrl={"https://"} />
```

## Props

| name | type | required | description |
| ---- | ---- | -------- | ----------- |

|
|

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

## Caching

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
