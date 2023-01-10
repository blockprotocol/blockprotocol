use serde::{Deserialize, Serialize};
use thiserror::Error;
#[cfg(target_arch = "wasm32")]
use tsify::Tsify;

use crate::{
    uri::ParseVersionedUriError, ParseOneOfArrayError, ParseOneOfError,
    ParsePropertyTypeObjectError,
};

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Deserialize, Serialize, PartialEq, Eq, Error)]
#[serde(tag = "reason", content = "inner")]
pub enum ParsePropertyTypeError {
    #[error("invalid versioned URI: `{0}`")]
    InvalidVersionedUri(ParseVersionedUriError),
    #[error("invalid data type reference: `{0}`")]
    InvalidDataTypeReference(ParseVersionedUriError),
    #[error("invalid property type object: `{0}`")]
    InvalidPropertyTypeObject(ParsePropertyTypeObjectError),
    // Boxes to avoid infinitely sized enum due to recursion
    #[error("invalid OneOf definition: `{0}`")]
    InvalidOneOf(Box<ParseOneOfError>), // TODO - better name for variant
    #[error("invalid items definition inside array: `{0}`")]
    InvalidArrayItems(Box<ParseOneOfArrayError>), // TODO - better name for variant
    #[error("error in JSON: `{0}`")]
    InvalidJson(String),
}
