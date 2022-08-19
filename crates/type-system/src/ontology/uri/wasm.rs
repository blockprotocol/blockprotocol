use std::str::FromStr;

use wasm_bindgen::prelude::*;

use crate::{
    ontology::uri::{error::ParseBaseUriError, BaseUri, VersionedUri},
    uri::error::ParseVersionedUriError,
};

/// Takes a URL string and attempts to parse it into a valid URL, returning it in standardized form
#[wasm_bindgen(js_name = parseBaseUri)]
pub fn parse_base_uri(uri: &str) -> Result<String, ParseBaseUriError> {
    let url = BaseUri::new(uri)?;
    if url.0.cannot_be_a_base() {
        return Err(ParseBaseUriError {});
    }
    Ok(url.to_string())
}

/// Checks if a given URL string is a Block Protocol compliant Versioned URI.
///
/// If the URL is valid this function returns nothing, otherwise it throws a
/// `ParseVersionedUriError`
#[wasm_bindgen(js_name = isValidVersionedUri)]
pub fn is_valid_versioned_uri(uri: &str) -> Result<(), ParseVersionedUriError> {
    let _ = VersionedUri::from_str(uri)?;
    Ok(())
}
