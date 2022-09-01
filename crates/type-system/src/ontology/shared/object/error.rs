use serde::{Deserialize, Serialize};
use thiserror::Error;
#[cfg(target_arch = "wasm32")]
use tsify::Tsify;

use crate::{
    uri::{ParseBaseUriError, ParseVersionedUriError},
    ParsePropertyTypeReferenceArrayError, ValidationError,
};

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Deserialize, Serialize, PartialEq, Eq, Error)]
#[serde(tag = "reason", content = "inner")]
pub enum ParsePropertyTypeObjectError {
    #[error("invalid property type reference: `{0}`")]
    InvalidPropertyTypeReference(ParseVersionedUriError),
    #[error("invalid array definition: `{0}`")]
    InvalidArray(ParsePropertyTypeReferenceArrayError),
    #[error("invalid property key: `{0}`")]
    InvalidPropertyKey(ParseBaseUriError),
    #[error("invalid key inside required: `{0}`")]
    InvalidRequiredKey(ParseBaseUriError),
    #[error("failed validation: `{0}`")]
    ValidationError(ValidationError),
    #[error("error in JSON: `{0}`")]
    InvalidJson(String),
}
