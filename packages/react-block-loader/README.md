# React Block Loader

A component which loads a [Block Protocol](https://blockprotocol.org) block from a remote URL, and passes on the properties and functions you provide.

## Usage

`yarn install "react-block-loader"`

Pass BlockLoader (at a minimum) a source url (`sourceUrl`), the properties the block expects (`blockProperties`),
and functions for it to call (`blockProtocolFunctions`), as set out in [the specification](https://blockprotocol.org/spec).

```jsx
import { BlockLoader } from "react-block-loader";

const blockDependencies = {
  react: require("react"),
  "react-dom": require("react-dom"),
};

const BlockLoader = ({ blockSourceFolder: string }) => {
  const [blockMetadata, setBlockMetadata] = useState(null);

  useEffect(() => {
    fetch(`${blockSourceFolder}/block-metadata.json`)
      .then((resp) => resp.json())
      .then(setBlockMetadata);
  }, [componentId]);

  if (!blockMetadata) {
    return <div>Loading block metadata...</div>;
  }

  const blockProperties = {
    // block's own properties, entityId, linkedEntities, linkGroups, etc
  };

  const blockProtocolFunctions = {
    updateEntities: (actions) => {
      // persist block updates wherever you store them
    },
    // more Block Protocol Functions
  };

  return (
    <BlockLoader
      blockMetadata={blockMetadata}
      blockProperties={blockProperties}
      blockProtocolFunctions={blockProtocolFunctions}
      externalDependencies={blockDependencies}
      LoadingIndicator={<h1>Optional custom loading indicator</h1>}
      onBlockLoaded={() =>
        console.log(`Block with componentId ${componentId} loaded.`)
      }
      sourceUrl={`${blockSourceFolder}/${blockMetadata.source}`}
    />
  );
};
```

## Props

| name                     | type           | required | default                 | description                                                                                                                                  |
| ------------------------ | -------------- | -------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `blockMetadata`          | `object`       | no       |                         | the block's [block-metadata.json](https://blockprotocol.org/spec/block-types). Will be used to determine Web Component tag names (TBD soon). |
| `blockProperties`        | `object`       | yes      |                         | the block's own properties, and BP-specified properties (e.g. entityId, linkGroups)                                                          |
| `crossFrame`             | `boolean`      | no       | `false`                 | whether this block should make requests to [the parent window](#inside-iframes) for block source                                             |
| `blockProtocolFunctions` | `object`       | yes      |                         | the [functions provided to blocks](https://blockprotocol.org/spec/block-types#entity-functions) for reading and editing entity and link data |
| `externalDependencies`   | `object`       | no       |                         | [libraries](#external-dependencies) which the block depends on but does not include in its package                                           |
| `LoadingIndicator`       | `ReactElement` | no       | `<div>Loading...</div>` | an element to display while the block is loading                                                                                             |
| `onBlockLoaded`          | `function`     | no       |                         | a callback, called when the block has been successfully parsed and loaded                                                                    |
| `sourceUrl`              | `string`       | yes      |                         | the URL to the entry source file for the block                                                                                               |

## External dependencies

A block may indicate `externals` in `block-metadata.json` ([docs](https://blockprotocol.org/spec/block-types)).

These are libraries the blocks expects the embedding application to supply it.
For example, a block may rely on React, but assume that the embedding application will provide it, to save loading it multiple times on a page.

In order to provide blocks with these dependencies, pass an object where the key is `<package-name>`,
and the value is `require(<package-name>)`, e.g.

```javascript
const blockDependencies = {
  react: require("react"),
  "react-dom": require("react-dom"),
};
```

## Security

This component automatically fetches, parses, and renders the component from the file at the provided `sourceUrl`.

You should either make sure you trust the source, or sandbox the component so that it does not matter if it is malicious.

## Source Fetching & Caching

Requests are cached by URL, so that each source URL only has to be fetched once, and parsed once (in the same window).

### Inside iFrames

Where each `RemoteBlock` instance is loaded in its own iFrame, you can optionally pass `crossFrame=true`,
and the block will send a message to the parent window requesting the text of the source file.
This allows the parent window to keep a cache of text per `sourceUrl`, which is useful if you have multiple
iFrames each loading the same remote block. Each iFrame will still have to parse the source.

See the following exports:

- `TextFromUrlRequestMessage` – a type for the message request shape
- `TextFromUrlResponseMessage` – a type for the response
- `isTextFromUrlRequestMessage` – a typeguard for checking the request is of the type of interest

```typescript
// in the parent window, listen for messages requesting text is fetched from a url
window.addEventListener("message", (requestMessage) => {
  if (isTextFromUrlRequestMessage(requestMessage)) {
    // Ideally you would have a Ref to the iFrame in which the component loads,
    // so that requests to fetch text from other iFrames are not processed.
    // this function otherwise will fetch any URL requested of it for any iFrame sending the correct message,
    // and will act with the origin of this window (potentially e.g. sending cookies when fetching the URL)
    if (source !== frameRef.current?.contentWindow) {
      return;
    }

    const { payload, requestId } = requestMessage.data;

    // implement memoizedFetch to cache the text by URL, to avoid fetching it for multiple blocks
    memoizedFetch(payload.url)
      .then((resp) => resp.text())
      .then((text) => {
        const responseMessage: TextFromUrlResponseMessage = {
          payload: { data: text },
          requestId,
        };
        requestMessage.source.postMessage(responseMessage, origin);
      });
  }
});
```

## Blocks supported

The component will parse and render blocks which are defined as:

- React components (i.e. a JavaScript file which exports a React component)
- Web Components (i.e. a JavaScript file which exports a custom element class)
- HTML (i.e. an HTML file, which may in turn load other assets)

For JavaScript files, the exported component must be one of:

1.  the default export from the file
1.  the only named export in the file
1.  an export named `App`

## Acknowledgements

The `useRemoteBlock` hook was adapted from [Paciolan/remote-component](https://github.com/Paciolan/remote-component)
