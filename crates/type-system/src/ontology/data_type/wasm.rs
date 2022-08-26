// #![allow(
//     non_snake_case,
//     reason = "We want camelCase names (variables, functions, args) in TS, and this module is WASM
//                only"
// )]
//
// use std::fmt::Debug;
//
// use serde::{Deserialize, Serialize};
// use serde_json::error::Category;
// use tsify::Tsify;
// use wasm_bindgen::prelude::*;
//
// use crate::{DataType, ValidationError};
//
// #[wasm_bindgen]
// extern "C" {
//     #[wasm_bindgen(typescript_type = "DataType")]
//     pub type IDataType;
// }
//
// #[cfg_attr(target_arch = "wasm32", derive(Tsify))]
// #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
// #[serde(tag = "type", content = "inner")]
// pub enum MyResult<T, E> {
//     Ok(T),
//     Err(E),
// }
//
// /// Checks if a given {DataType} is valid
// ///
// /// @throws {MalformedDataTypeError} if the data type is malformed - TODO
// // #[wasm_bindgen]
// pub fn isValidDataType(dataTypeObj: &JsValue) -> JsValue {
//     JsValue::from_serde(&match dataTypeObj.into_serde::<DataType>() {
//
//         }
//     })
//     .expect("failed to serialize isValidDataType result")
// }
//
// #[cfg(test)]
// mod tests {
//     use wasm_bindgen::JsValue;
//
//     use super::*;
//
//     #[test]
//     fn my_test() {
//         let js = JsValue::from(
//             r#"{
//                 "kind": "dataType",
//                 "$id": "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/2.3", // incorrectly versioned URI
//                 "title": "Text",
//                 "description": "An ordered sequence of characters",
//                 "type": "string",
//               },
//               "#,
//         );
//
//         dbg!(isValidDataType(&js));
//     }
// }
