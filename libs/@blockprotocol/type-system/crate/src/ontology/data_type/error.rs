use serde::{Deserialize, Serialize};
use thiserror::Error;
#[cfg(target_arch = "wasm32")]
use tsify::Tsify;

use crate::uri::ParseVersionedUriError;

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Deserialize, Serialize, PartialEq, Eq, Error)]
#[serde(tag = "reason", content = "inner")]
pub enum ParseDataTypeError {
    #[error("invalid versioned URI: `{0}`")]
    InvalidVersionedUri(ParseVersionedUriError),
    #[error("error in JSON: `{0}`")]
    InvalidJson(String),
}
