use serde::{Deserialize, Serialize};
#[cfg(target_arch = "wasm32")]
use tsify::Tsify;

use crate::ontology::{uri::ParseBaseUriError, ValidationError};

#[allow(
    clippy::enum_variant_names,
    reason = "The prefix is helpful for disambiguating, especially in Typescript"
)]
#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Deserialize, Serialize, PartialEq, Eq)]
#[serde(tag = "reason", content = "inner")]
pub enum ParsePropertyTypeObjectError {
    InvalidPropertyKey(ParseBaseUriError),
    InvalidRequiredKey(ParseBaseUriError),
    ValidationError(ValidationError),
    InvalidJson(String),
}

// TODO - Display impl
