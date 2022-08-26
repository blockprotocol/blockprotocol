#![cfg_attr(
    target_arch = "wasm32",
    expect(
        clippy::drop_non_drop,
        reason = "This seems to be a bug with wasm_bindgen"
    )
)]

use std::fmt;

use serde::{Deserialize, Serialize};
#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ParseBaseUriError;

impl fmt::Display for ParseBaseUriError {
    fn fmt(&self, fmt: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt.write_str("provided string is not a valid URI")
    }
}

#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "type", content = "inner")]
pub enum ParseVersionedUriError {
    IncorrectFormatting,
    MissingBaseUri,
    MissingVersion,
    InvalidVersion,
    AdditionalEndContent,
    InvalidBaseUri(ParseBaseUriError),
}

impl fmt::Display for ParseVersionedUriError {
    fn fmt(&self, fmt: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt.write_str("provided string is not a valid versioned URI")
    }
}
