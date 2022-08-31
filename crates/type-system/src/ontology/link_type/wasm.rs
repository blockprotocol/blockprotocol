use wasm_bindgen::prelude::*;

use crate::{
    repr,
    utils::{set_panic_hook, Result},
    LinkType, ParseLinkTypeError,
};

fn convert_link_type(link_type_obj: &JsValue) -> std::result::Result<LinkType, ParseLinkTypeError> {
    let link_type_repr = link_type_obj
        .into_serde::<repr::LinkType>()
        .map_err(|err| ParseLinkTypeError::InvalidJson(err.to_string()))?;

    LinkType::try_from(link_type_repr)
}

#[wasm_bindgen(typescript_custom_section)]
const VALIDATE_LINK_TYPE_DEF: &'static str = r#"
/**
 * Checks if a given Link Type is correctly formed
 *
 * @param {LinkType} linkType - The Link Type object to validate.
 * @returns {(Result.Ok|Result.Err<ParseLinkTypeError>)} - an Ok with null inner if valid, or an Err with an inner ParseLinkTypeError  
 */
export function validateLinkType(linkType: LinkType): Result<undefined, ParseLinkTypeError>;
"#;
#[wasm_bindgen(skip_typescript, js_name = validateLinkType)]
pub fn validate_link_type(link_type_obj: &JsValue) -> JsValue {
    #[cfg(debug_assertions)]
    set_panic_hook();

    let validate_result: Result<(), _> = convert_link_type(link_type_obj).map(|_| ()).into();
    JsValue::from_serde(&validate_result).expect("failed to serialize result")
}
