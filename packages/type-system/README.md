# WIP

Generally it’s
* `cargo make build` in `packages/type-system/rust`
* `yarn install` in the root of the repo
* `yarn test` inside packages/type-system/ts/type-system-integration

* Also current experiment: `node --loader ts-node/esm  --experimental-wasm-modules src/test.mts` does just work
* And there's a `test-block` where I'm trying to load the bundler version but we probably need to modify the webpack setup