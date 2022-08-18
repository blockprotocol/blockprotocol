use std::str::FromStr;
use wasm_bindgen::prelude::*;

use crate::ontology::uri::{error::ParseBaseUriError, BaseUri, VersionedUri};
use crate::uri::error::ParseVersionedUriError;

#[wasm_bindgen(js_name = parseBaseUri)]
pub fn parse_base_uri(uri: &str) -> Result<String, ParseBaseUriError> {
    let url = BaseUri::new(uri)?;
    Ok(url.to_string())
}

#[wasm_bindgen(js_name = isValidVersionedUri)]
pub fn is_valid_versioned_uri(uri: &str) -> Result<(), ParseVersionedUriError> {
    let _ = VersionedUri::from_str(uri)?;
    Ok(())
}

