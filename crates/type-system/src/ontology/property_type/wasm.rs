#![allow(
    non_snake_case,
    reason = "We want camelCase types in TS, and this module is WASM only"
)]
use wasm_bindgen::prelude::*;

use crate::PropertyType;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "PropertyType")]
    pub type IPropertyType;
}

use tsify::Tsify;

// TODO: this is a temporary solution, we need to figure out error handling across the WASM boundary
#[derive(Tsify)]
#[wasm_bindgen]
pub struct TempError {}

/// Checks if a given {PropertyType} is valid
///
/// @throws {TempError} if the property type is malformed
#[wasm_bindgen]
pub fn isValidPropertyType(propertyTypeObj: &IPropertyType) -> Result<(), TempError> {
    propertyTypeObj
        .into_serde::<PropertyType>()
        .map_err(|_| TempError {})?;
    Ok(())
}
