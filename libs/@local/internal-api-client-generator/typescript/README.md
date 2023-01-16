## internal-api-client@0.0.0-private

This generator creates TypeScript/JavaScript client for the internal API that utilizes [axios](https://github.com/axios/axios).

### Building

To build and compile the typescript sources to javascript from the root of the repository, use:

```sh
yarn install
yarn workspace @local/internal-api-client build
```

### Consuming

To consume the client in another yarn workspace, use:

```sh
yarn workspace workspace-name add @local/internal-api-client@0.0.0-private
```
