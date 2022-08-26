#![cfg_attr(
    target_arch = "wasm32",
    expect(
        clippy::drop_non_drop,
        reason = "This seems to be a bug with wasm_bindgen"
    )
)]
use std::fmt;

use serde::{Deserialize, Serialize};

use crate::{ontology::repr_shared::HasSerdeJsonError, uri::ParseVersionedUriError};

// TODO: can we use tsify's into_wasm_abi or whatever it was
#[derive(Debug, Deserialize, Serialize)]
#[serde(untagged)]
pub enum ParseDataTypeError {
    VersionedUri(ParseVersionedUriError),
    InvalidJson(String),
}

impl HasSerdeJsonError for ParseDataTypeError {
    fn new_serde_json_error(contents: String) -> Self {
        Self::InvalidJson(contents)
    }
}

impl fmt::Display for ParseDataTypeError {
    fn fmt(&self, fmt: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt.write_str(&serde_json::to_string(self).expect("failed to deserialize Data Type"))
    }
}
