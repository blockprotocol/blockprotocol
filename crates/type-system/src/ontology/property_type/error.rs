use std::fmt;

use serde::{Deserialize, Serialize};
#[cfg(target_arch = "wasm32")]
use tsify::Tsify;

use crate::{
    uri::ParseVersionedUriError, ParseOneOfArrayError, ParseOneOfError,
    ParsePropertyTypeObjectError,
};

#[allow(
    clippy::enum_variant_names,
    reason = "The prefix is helpful for disambiguating, especially in Typescript"
)]
#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Deserialize, Serialize, PartialEq, Eq)]
#[serde(tag = "reason", content = "inner")]
pub enum ParsePropertyTypeError {
    InvalidVersionedUri(ParseVersionedUriError),
    InvalidDataTypeReference(ParseVersionedUriError),
    InvalidPropertyTypeObject(ParsePropertyTypeObjectError),
    // Boxes to avoid infinitely sized enum due to recursion
    InvalidOneOf(Box<ParseOneOfError>), // TODO - better name for variant
    InvalidArrayItems(Box<ParseOneOfArrayError>),
    InvalidJson(String),
}

impl fmt::Display for ParsePropertyTypeError {
    fn fmt(&self, fmt: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt.write_str(&serde_json::to_string(self).expect("failed to deserialize Data Type"))
    }
}
