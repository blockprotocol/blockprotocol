use std::str::FromStr;

use tsify::Tsify;
use wasm_bindgen::prelude::*;

use crate::{
    ontology::uri::{error::ParseBaseUriError, BaseUri},
    uri::error::ParseVersionedUriError,
};

// Generates the TypeScript alias: type VersionedUri = `${string}/v/${number}`
#[derive(Tsify)]
#[serde(rename = "VersionedUri")]
pub struct VersionedUriPatch(#[tsify(type = "`${string}/v/${number}`")] String);

#[wasm_bindgen(typescript_custom_section)]
const PARSE_BASE_URI_DEF: &'static str = r#"
/**
 * Takes a URL string and attempts to parse it into a valid URL, returning it in standardized form.
 * 
 * @param {BaseUri} uri - The URL string.
 * @throws {ParseBaseUriError} if the given string is not a valid base URI
 */
export function parseBaseUri(uri: BaseUri): BaseUri;
"#;
#[wasm_bindgen(skip_typescript, js_name = parseBaseUri)]
pub fn parse_base_uri(uri: &str) -> Result<String, ParseBaseUriError> {
    let base_uri = BaseUri::new(uri)?;
    if base_uri.0.cannot_be_a_base() {
        return Err(ParseBaseUriError {});
    }
    Ok(base_uri.to_string())
}

#[wasm_bindgen(typescript_custom_section)]
const IS_VALID_VERSIONED_URI_DEF: &'static str = r#"
/**
 * Checks if a given URL string is a Block Protocol compliant Versioned URI.
 * 
 * @param {VersionedUri} uri - The URL string.
 * @throws {ParseVersionedUriError} if the versioned URI is invalid
 */
export function isValidVersionedUri(uri: VersionedUri): void;
"#;
#[wasm_bindgen(skip_typescript, js_name = isValidVersionedUri)]
pub fn is_valid_versioned_uri(uri: &str) -> Result<(), ParseVersionedUriError> {
    crate::ontology::uri::VersionedUri::from_str(uri)?;
    Ok(())
}
