#![allow(
    non_snake_case,
    reason = "We want camelCase names (variables, functions, args) in TS, and this module is WASM
               only"
)]

use wasm_bindgen::prelude::*;

use crate::{
    ontology::{
        data_type::{DataType, ParseDataTypeError},
        repr,
    },
    utils::{set_panic_hook, Result},
};

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "DataType")]
    pub type IDataType;
}

fn convert_data_type(data_type_obj: &JsValue) -> std::result::Result<DataType, ParseDataTypeError> {
    let data_type_repr = data_type_obj
        .into_serde::<repr::DataType>()
        .map_err(|err| ParseDataTypeError::InvalidJson(err.to_string()))?;

    Ok(DataType::try_from(data_type_repr)?)
}

#[wasm_bindgen(typescript_custom_section)]
const VALIDATE_DATA_TYPE_DEF: &'static str = r#"
/**
 * Checks if a given Data Type is correctly formed
 *
 * @param {DataType} dataType - The Data Type object to validate.
 * @returns {Result} - @todo
 */
export function validateDataType(dataType: DataType): Result<undefined, ParseDataTypeError>;
"#;
#[wasm_bindgen(skip_typescript, js_name = validateDataType)]
pub fn validate_data_type(data_type_obj: &JsValue) -> JsValue {
    set_panic_hook();
    let validate_result: Result<(), _> = convert_data_type(data_type_obj).map(|_| ()).into();
    JsValue::from_serde(&validate_result).expect("failed to serialize result")
}

#[cfg(test)]
mod tests {
    use wasm_bindgen::JsValue;

    use super::*;

    #[test]
    fn my_test() {
        let js = JsValue::from(
            r#"{
                "kind": "dataType",
                "$id": "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/2.3", // incorrectly versioned URI
                "title": "Text",
                "description": "An ordered sequence of characters",
                "type": "string",
              },
              "#,
        );

        dbg!(validate_data_type(&js));
    }
}
