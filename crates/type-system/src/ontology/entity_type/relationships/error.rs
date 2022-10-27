use serde::{Deserialize, Serialize};
use thiserror::Error;
#[cfg(target_arch = "wasm32")]
use tsify::Tsify;

use crate::{uri::ParseVersionedUriError, ParseOneOfError, ValidationError};

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Deserialize, Serialize, PartialEq, Eq, Error)]
#[serde(tag = "reason", content = "inner")]
pub enum ParseRelationshipsError {
    #[error("invalid link key: `{0}`")]
    InvalidRelationshipKey(ParseVersionedUriError),
    #[error("invalid OneOf entity type reference: `{0}`")]
    InvalidEntityTypeReference(ParseOneOfError),
    #[error("invalid array definition: `{0}`")]
    InvalidArray(ParseEntityTypeReferenceArrayError),
    #[error("invalid key inside required: `{0}`")]
    InvalidRequiredKey(ParseVersionedUriError),
    #[error("failed validation: `{0}`")]
    ValidationError(ValidationError),
    #[error("error in JSON: `{0}`")]
    InvalidJson(String),
}

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Deserialize, Serialize, PartialEq, Eq, Error)]
#[serde(tag = "reason", content = "inner")]
pub enum ParseEntityTypeReferenceArrayError {
    #[error("invalid OneOf entity type reference inside items: `{0}`")]
    InvalidReference(ParseOneOfError),
    #[error("error in JSON: `{0}`")]
    InvalidJson(String),
}
