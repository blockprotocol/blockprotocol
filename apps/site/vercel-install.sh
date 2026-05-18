#!/usr/bin/env bash

set -euxo pipefail

# Change to the root directory
pushd "$(git rev-parse --show-toplevel)"

# Install just
curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh | sh -s -- --to /usr/local/bin

# Install an isolated Rust toolchain so it doesn't clash with Vercel's /rust install
export RUSTUP_HOME="$PWD/.vercel-rustup"
export CARGO_HOME="$PWD/.vercel-cargo"
export PATH="$CARGO_HOME/bin:$PATH"
export RUSTUP_INIT_SKIP_PATH_CHECK=yes

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain nightly-2025-10-08
source "$CARGO_HOME/env"

# Run `yarn`
yarn install

# Change back to the app directory
popd
