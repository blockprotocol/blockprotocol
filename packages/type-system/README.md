# WIP

Generally it’s
* `yarn install` in the root of the repo
* `cargo make build` in `packages/type-system/rust`
* `yarn test` inside packages/type-system/ts/type-system-integration

* Also current experiment: `node --loader ts-node/esm  --experimental-wasm-modules src/test.mts` does just work