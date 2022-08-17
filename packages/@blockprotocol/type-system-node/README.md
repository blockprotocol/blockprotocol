# The Block Protocol Type-System

[//]: # (TODO: Introduction)

## Requirements
- [Rust](https://www.rust-lang.org/tools/install)
- [cargo-make](https://github.com/sagiegurari/cargo-make#installation)

## Building the Packages

- `cargo make build` - Compiles the Rust crate, and generates the WASM packages inside the [`../ts`](../ts) folder.

For more granular task control look at `cargo make --list-all-steps`

## Running tests

- `cargo make test` - Runs the unit tests and headless WASM integration tests found in the [./src/test](./src/test) directory. (Different to the ones found in [../ts/integration](../ts/integration))  