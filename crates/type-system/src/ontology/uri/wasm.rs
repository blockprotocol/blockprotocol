use tsify::Tsify;

use crate::utils::{set_panic_hook, Result};

// Generates the TypeScript alias: type VersionedUri = `${string}/v/${number}`
#[derive(Tsify)]
#[serde(rename = "VersionedUri")]
pub struct VersionedUriPatch(#[tsify(type = "`${string}/v/${number}`")] String);

// #[wasm_bindgen(typescript_custom_section)]
// const VALIDATE_BASE_URI_DEF: &'static str = r#"
// /**
//  * Checks if a given URL string is a valid base URL.
//  *
//  * @param {BaseUri} uri - The URL string.
//  * @returns {(Result.Ok|Result.Err<ParseBaseUriError>)} - an Ok with an inner of the string as a
//  * BaseUri if valid, or an Err with an inner ParseBaseUriError
//  */
// export function validateBaseUri(uri: string): Result<BaseUri, ParseBaseUriError>;
// "#;
// #[wasm_bindgen(skip_typescript, js_name = validateBaseUri)]
// pub fn validate_base_uri(uri: &str) -> JsValue {
//     #[cfg(debug_assertions)]
//     set_panic_hook();
//
//     let validate_result: Result<_, _> = BaseUri::validate_str(uri).map(|_|
// uri.to_owned()).into();
//
//     JsValue::from_serde(&validate_result).expect("failed to serialize result")
// }
//
// #[wasm_bindgen(typescript_custom_section)]
// const VALIDATE_VERSIONED_URI_DEF: &'static str = r#"
// /**
//  * Checks if a given URL string is a Block Protocol compliant Versioned URI.
//  *
//  * @param {string} uri - The URL string.
//  * @returns {(Result.Ok|Result.Err<ParseVersionedUriError>)} - an Ok with an inner of the string
//    as
//  * a VersionedUri if valid, or an Err with an inner ParseVersionedUriError
//  */
// export function validateVersionedUri(uri: string): Result<VersionedUri, ParseVersionedUriError>;
// "#;
// #[wasm_bindgen(skip_typescript, js_name = validateVersionedUri)]
// pub fn validate_versioned_uri(uri: &str) -> JsValue {
//     #[cfg(debug_assertions)]
//     set_panic_hook();
//
//     let validate_result: Result<_, _> = VersionedUri::from_str(uri).into();
//
//     JsValue::from_serde(&validate_result).expect("failed to serialize result")
// }
//
// #[wasm_bindgen(typescript_custom_section)]
// const EXTRACT_BASE_URI_DEF: &'static str = r#"
// /**
//  * Extracts the base URI from a Versioned URI.
//  *
//  * @param {VersionedUri} uri - The versioned URI.
//  * @throws {ParseVersionedUriError} if the versioned URI is invalid.
//  */
// export function extractBaseUri(uri: VersionedUri): BaseUri;
// "#;
// #[wasm_bindgen(skip_typescript, js_name = extractBaseUri)]
// pub fn extract_base_uri(uri: &str) -> std::result::Result<String, JsValue> {
//     #[cfg(debug_assertions)]
//     set_panic_hook();
//
//     Ok(VersionedUri::from_str(uri)
//         .map_err(|err| JsValue::from_serde(&err).expect("failed to serialize error"))?
//         .base_uri
//         .to_string())
// }
//
// #[wasm_bindgen(typescript_custom_section)]
// const EXTRACT_VERSION_DEF: &'static str = r#"
// /**
//  * Extracts the version from a Versioned URI.
//  *
//  * @param {VersionedUri} uri - The versioned URI.
//  * @throws {ParseVersionedUriError} if the versioned URI is invalid.
//  */
// export function extractVersion(uri: VersionedUri): number;
// "#;
// #[wasm_bindgen(skip_typescript, js_name = extractVersion)]
// pub fn extract_version(uri: &str) -> std::result::Result<u32, JsValue> {
//     #[cfg(debug_assertions)]
//     set_panic_hook();
//
//     Ok(VersionedUri::from_str(uri)
//         .map_err(|err| JsValue::from_serde(&err).expect("failed to serialize error"))?
//         .version)
// }
