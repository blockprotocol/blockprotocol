use serde::{Deserialize, Serialize};
use thiserror::Error;
#[cfg(target_arch = "wasm32")]
use tsify::Tsify;

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, Error)]
#[serde(tag = "reason", content = "inner")]
pub enum ParseBaseUriError {
    #[error("URI is missing a trailing slash")]
    MissingTrailingSlash,
    #[error("{0}")]
    UrlParseError(String), // TODO: can we do better than a string here
    #[error("URI cannot cannot be a base")]
    CannotBeABase,
}

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, Error)]
#[serde(tag = "reason", content = "inner")]
pub enum ParseVersionedUriError {
    #[error("incorrect formatting")]
    IncorrectFormatting,
    #[error("missing base uri")]
    MissingBaseUri,
    #[error("missing version")]
    MissingVersion,
    #[error("invalid version: {0}")]
    InvalidVersion(String),
    #[error("additional end content")]
    AdditionalEndContent,
    #[error("invalid base uri: {0}")]
    InvalidBaseUri(ParseBaseUriError),
    #[error("invalid json: {0}")]
    InvalidJson(String),
}
