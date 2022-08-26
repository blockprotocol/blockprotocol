#![allow(
    non_snake_case,
    reason = "We want camelCase names (variables, functions, args) in TS, and this module is WASM \
              only"
)]
use wasm_bindgen::prelude::*;

use crate::{ontology::data_type::error::MalformedDataTypeError, DataType};

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "DataType")]
    pub type IDataType;
}

/// Checks if a given {DataType} is valid
///
/// @throws {MalformedDataTypeError} if the data type is malformed
#[wasm_bindgen]
pub fn isValidDataType(dataTypeObj: &IDataType) -> Result<(), MalformedDataTypeError> {
    dataTypeObj
        .into_serde::<DataType>()
        .map_err(|_| MalformedDataTypeError {})?;
    Ok(())
}
