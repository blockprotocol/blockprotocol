#!/usr/bin/env bash

set -euxo pipefail

# Change to the root directory
pushd "$(dirname "$0")/../.."

# Install dependencies
curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh | bash -s -- --to /usr/local/bin
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain nightly-2022-10-28
source "$HOME/.cargo/env"
cargo install cargo-make

# Change back to the project directory
popd

# Run `yarn`
yarn install
