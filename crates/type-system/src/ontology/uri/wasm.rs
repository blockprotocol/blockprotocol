use std::str::FromStr;

use tsify::Tsify;
use wasm_bindgen::prelude::*;

use crate::{
    ontology::uri::{error::ParseBaseUriError, BaseUri},
    uri::{error::ParseVersionedUriError, VersionedUri},
};

// Generates the TypeScript alias: type VersionedUri = `${string}/v/${number}`
#[derive(Tsify)]
#[serde(rename = "VersionedUri")]
pub struct VersionedUriPatch(#[tsify(type = "`${string}/v/${number}`")] String);

#[wasm_bindgen(typescript_custom_section)]
const PARSE_BASE_URI_DEF: &'static str = r#"
/**
 * Checks if a given URL string is a valid base URL.
 * 
 * @param {BaseUri} uri - The URL string.
 * @throws {ParseBaseUriError} if the given string is not a valid base URI
 */
export function isValidBaseUri(uri: string): void;
"#;
#[wasm_bindgen(skip_typescript, js_name = isValidBaseUri)]
pub fn is_valid_base_uri(uri: &str) -> Result<(), ParseBaseUriError> {
    BaseUri::validate_str(uri)?;
    Ok(())
}

#[wasm_bindgen(typescript_custom_section)]
const IS_VALID_VERSIONED_URI_DEF: &'static str = r#"
/**
 * Checks if a given URL string is a Block Protocol compliant Versioned URI.
 *
 * @param {string} uri - The URL string.
 * @throws {ParseVersionedUriError} if the versioned URI is invalid.
 */
export function isVersionedUri(uri: string): uri is VersionedUri;
"#;
#[wasm_bindgen(skip_typescript, js_name = isVersionedUri)]
pub fn is_versioned_uri(uri: &str) -> Result<bool, ParseVersionedUriError> {
    VersionedUri::from_str(uri)?;
    Ok(true)
}
