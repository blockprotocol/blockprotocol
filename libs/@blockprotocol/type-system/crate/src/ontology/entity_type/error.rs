use serde::{Deserialize, Serialize};
use thiserror::Error;
#[cfg(target_arch = "wasm32")]
use tsify::Tsify;

use crate::{
    uri::{ParseBaseUriError, ParseVersionedUriError},
    ParseAllOfError, ParseLinksError, ParsePropertyTypeObjectError,
};

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Deserialize, Serialize, PartialEq, Eq, Error)]
#[serde(tag = "reason", content = "inner")]
pub enum ParseEntityTypeError {
    #[error("invalid property type object: `{0}`")]
    InvalidPropertyTypeObject(ParsePropertyTypeObjectError),
    #[error("invalid all of field: `{0}`")]
    InvalidAllOf(ParseAllOfError),
    #[error("invalid links: `{0}`")]
    InvalidLinks(ParseLinksError),
    #[error("invalid key in default: `{0}`")]
    InvalidDefaultKey(ParseBaseUriError),
    #[error("invalid key in examples list: `{0}`")]
    InvalidExamplesKey(ParseBaseUriError),
    #[error("invalid versioned URI: `{0}`")]
    InvalidVersionedUri(ParseVersionedUriError),
    #[error("error in JSON: `{0}`")]
    InvalidJson(String),
    #[error("additional properties was set to `true` but must be `false`")]
    InvalidAdditionalPropertiesValue,
}
