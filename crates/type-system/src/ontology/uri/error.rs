use std::fmt;

use serde::{Deserialize, Serialize};
#[cfg(target_arch = "wasm32")]
use tsify::Tsify;

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "reason", content = "inner")]
pub enum ParseBaseUriError {
    MissingTrailingSlash,
    UrlParseError(String), // TODO: can we do better than a string here
    CannotBeABase,
}

impl fmt::Display for ParseBaseUriError {
    fn fmt(&self, fmt: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt.write_str("provided string is not a valid URI")
    }
}

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "reason", content = "inner")]
pub enum ParseVersionedUriError {
    IncorrectFormatting,
    MissingBaseUri,
    MissingVersion,
    InvalidVersion,
    AdditionalEndContent,
    InvalidBaseUri(ParseBaseUriError),
    InvalidJson(String),
}

impl fmt::Display for ParseVersionedUriError {
    fn fmt(&self, fmt: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt.write_str("provided string is not a valid versioned URI")
    }
}
