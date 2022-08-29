//! Definitions of the elements of the Type System.
//!
//! This module contains the definitions of [`DataType`]s, [`PropertyType`]s, [`EntityType`]s, and
//! [`LinkType`]s. The structs are Rust representations of their meta-schemas defined within the
//! Block Protocol specification, and are used to validate instances of types using [`serde`]. To
//! aid with the de/serialization, intermediary structs and helpers are defined across various
//! submodules.

pub mod data_type;
pub mod property_type;
// TODO: reconsider calling these URIs in the spec, it seems to be a redundant term nowadays and
//  we should probably just go with URL
pub mod uri;

pub mod shared;

#[cfg(test)]
mod tests {
    use serde::{Deserialize, Serialize};
    use tsify::Tsify;

    use crate::{
        ontology::{data_type::ParseDataTypeError, shared::parse_serde_json_error},
        DataType,
    };

    #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, Tsify)]
    #[serde(tag = "type", content = "inner")]
    pub enum MyResult<T, E> {
        Ok(T),
        Err(E),
    }

    pub fn isValidDataType(dataTypeObj: &'static str) -> MyResult<DataType, ParseDataTypeError> {
        match serde_json::from_str::<DataType>(dataTypeObj) {
            Ok(data_type) => MyResult::Ok(data_type),
            Err(err) => MyResult::Err(parse_serde_json_error(&err)),
        }
    }

    #[test]
    fn my_test() {
        let js = r#"{
                "kind": "dataType",
                "$id": "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/2", // incorrectly versioned URI
                "title": "Text",
                "description": "An ordered sequence of characters",
                "type": "string",08][pmpi
              },
              "#;

        let data_type = isValidDataType(&js);
        match data_type {
            MyResult::Ok(data_type) => dbg!(data_type),
            MyResult::Err(err) => panic!("{:?}", err),
        };
    }
}
