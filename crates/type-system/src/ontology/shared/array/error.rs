use serde::{Deserialize, Serialize};
use thiserror::Error;
#[cfg(target_arch = "wasm32")]
use tsify::Tsify;

use crate::{uri::ParseVersionedUriError, ParseOneOfError};

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Deserialize, Serialize, PartialEq, Eq, Error)]
#[serde(tag = "reason", content = "inner")]
pub enum ParseOneOfArrayError {
    #[error("invalid items definition inside array: `{0}`")]
    InvalidItems(ParseOneOfError),
    #[error("error in JSON: `{0}`")]
    InvalidJson(String),
}

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Deserialize, Serialize, PartialEq, Eq, Error)]
#[serde(tag = "reason", content = "inner")]
pub enum ParsePropertyTypeReferenceArrayError {
    #[error("invalid property type reference inside items: `{0}`")]
    InvalidReference(ParseVersionedUriError),
    #[error("error in JSON: `{0}`")]
    InvalidJson(String),
}
