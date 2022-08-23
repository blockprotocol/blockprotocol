#![cfg_attr(
    target_arch = "wasm32",
    expect(
        clippy::drop_non_drop,
        reason = "This seems to be a bug with wasm_bindgen"
    )
)]
use std::fmt;

use thiserror::Error;
#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

// TODO: can we use tsify's into_wasm_abi or whatever it was
#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
#[derive(Debug, Clone, PartialEq, Eq, Error)]
pub struct MalformedDataTypeError;

impl fmt::Display for MalformedDataTypeError {
    fn fmt(&self, fmt: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt.write_str("failed to deserialize Data Type")
    }
}
