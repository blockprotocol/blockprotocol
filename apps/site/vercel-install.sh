#!/usr/bin/env bash

set -euxo pipefail

# Change to the root directory
pushd "$(git rev-parse --show-toplevel)"

# Install dependencies
curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh | sh -s -- --to /usr/local/bin
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain nightly-2025-10-08
source "$HOME/.cargo/env"

# Run `yarn`
yarn install

# Change back to the app directory
popd
