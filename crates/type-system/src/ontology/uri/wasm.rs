#![allow(
    non_snake_case,
    reason = "We want camelCase types in TS, and this module is WASM only"
)]
use std::str::FromStr;

use wasm_bindgen::prelude::*;

use crate::{
    ontology::uri::{error::ParseBaseUriError, BaseUri, VersionedUri},
    uri::error::ParseVersionedUriError,
};

/// Takes a URL string and attempts to parse it into a valid URL, returning it in standardized form
///
/// @throws {ParseBaseUriError} if the given string is not a valid base URI
#[wasm_bindgen]
pub fn parseBaseUri(uri: &str) -> Result<String, ParseBaseUriError> {
    let base_uri = BaseUri::new(uri)?;
    if base_uri.0.cannot_be_a_base() {
        return Err(ParseBaseUriError {});
    }
    Ok(base_uri.to_string())
}

/// Checks if a given URL string is a Block Protocol compliant Versioned URI.
///
/// @throws {ParseVersionedUriError} if the versioned URI is invalid
#[wasm_bindgen]
pub fn isValidVersionedUri(uri: &str) -> Result<(), ParseVersionedUriError> {
    VersionedUri::from_str(uri)?;
    Ok(())
}
