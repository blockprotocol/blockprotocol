use serde::{Deserialize, Serialize};
use thiserror::Error;
#[cfg(target_arch = "wasm32")]
use tsify::Tsify;

use crate::{uri::ParseVersionedUriError, ParseEntityTypeReferenceArrayError, ValidationError};

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Deserialize, Serialize, PartialEq, Eq, Error)]
#[serde(tag = "reason", content = "inner")]
pub enum ParseLinksError {
    #[error("invalid link key: `{0}`")]
    InvalidLinkKey(ParseVersionedUriError),
    #[error("invalid array definition: `{0}`")]
    InvalidArray(ParseEntityTypeReferenceArrayError),
    #[error("invalid key inside required: `{0}`")]
    InvalidRequiredKey(ParseVersionedUriError),
    #[error("failed validation: `{0}`")]
    ValidationError(ValidationError),
    #[error("error in JSON: `{0}`")]
    InvalidJson(String),
}
