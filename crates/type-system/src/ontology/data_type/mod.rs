mod error;
#[cfg(target_arch = "wasm32")]
mod wasm;

use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use serde_json;
#[cfg(target_arch = "wasm32")]
use tsify::Tsify;

use crate::{
    uri::{BaseUri, VersionedUri},
    ValidateUri, ValidationError,
};

/// Will serialize as a constant value `"dataType"`
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
enum DataTypeTag {
    DataType,
}

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DataType {
    #[cfg_attr(target_arch = "wasm32", tsify(type = "'dataType'"))]
    kind: DataTypeTag,
    #[cfg_attr(target_arch = "wasm32", tsify(type = "`${string}/v/${number}`"))]
    #[serde(rename = "$id")]
    id: VersionedUri,
    title: String,
    #[cfg_attr(target_arch = "wasm32", tsify(optional))]
    #[serde(skip_serializing_if = "Option::is_none")]
    description: Option<String>,
    #[serde(rename = "type")]
    json_type: String,
    /// Properties, which are not strongly typed.
    ///
    /// The data type meta-schema currently allows arbitrary, untyped properties. This is a
    /// catch-all field to store all non-typed data.
    #[cfg_attr(target_arch = "wasm32", tsify(type = "Record<string, any>"))]
    #[serde(flatten)]
    additional_properties: HashMap<String, serde_json::Value>,
}

impl DataType {
    #[must_use]
    pub const fn new(
        id: VersionedUri,
        title: String,
        description: Option<String>,
        json_type: String,
        additional_properties: HashMap<String, serde_json::Value>,
    ) -> Self {
        Self {
            kind: DataTypeTag::DataType,
            id,
            title,
            description,
            json_type,
            additional_properties,
        }
    }

    #[must_use]
    pub const fn id(&self) -> &VersionedUri {
        &self.id
    }

    #[must_use]
    pub fn title(&self) -> &str {
        &self.title
    }

    #[must_use]
    pub fn description(&self) -> Option<&str> {
        self.description.as_deref()
    }

    #[must_use]
    pub fn json_type(&self) -> &str {
        &self.json_type
    }

    #[must_use]
    pub const fn additional_properties(&self) -> &HashMap<String, serde_json::Value> {
        &self.additional_properties
    }

    #[must_use]
    pub fn additional_properties_mut(&mut self) -> &mut HashMap<String, serde_json::Value> {
        &mut self.additional_properties
    }
}

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct DataTypeReference {
    #[cfg_attr(target_arch = "wasm32", tsify(type = "`${string}/v/${number}`"))]
    #[serde(rename = "$ref")]
    uri: VersionedUri,
}

impl DataTypeReference {
    /// Creates a new `DataTypeReference` from the given [`VersionedUri`].
    #[must_use]
    pub const fn new(uri: VersionedUri) -> Self {
        Self { uri }
    }

    #[must_use]
    pub const fn uri(&self) -> &VersionedUri {
        &self.uri
    }
}

impl ValidateUri for DataTypeReference {
    fn validate_uri(&self, base_uri: &BaseUri) -> Result<(), ValidationError> {
        if base_uri == self.uri().base_uri() {
            Ok(())
        } else {
            Err(ValidationError::BaseUriMismatch {
                base_uri: base_uri.clone(),
                versioned_uri: self.uri().clone(),
            })
        }
    }
}

#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use serde_json::json;

    use super::*;
    use crate::{test_data, utils::tests::check_serialization};

    #[test]
    fn data_type_reference() {
        let uri = VersionedUri::from_str(
            "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
        )
        .expect("Invalid Versioned URI");
        let data_type = check_serialization::<DataTypeReference>(
            json!(
            {
              "$ref": uri.to_string()
            }),
            Some(DataTypeReference::new(uri)),
        );

        data_type
            .validate_uri(
                &BaseUri::new("https://blockprotocol.org/@blockprotocol/types/data-type/text/")
                    .expect("Invalid Base URL"),
            )
            .expect("Data type reference didn't validate against base URI");
    }

    #[test]
    fn text() {
        check_serialization::<DataType>(
            serde_json::from_str(test_data::data_type::TEXT_V1).expect("invalid json"),
            None,
        );
    }

    #[test]
    fn number() {
        check_serialization::<DataType>(
            serde_json::from_str(test_data::data_type::NUMBER_V1).expect("invalid json"),
            None,
        );
    }

    #[test]
    fn boolean() {
        check_serialization::<DataType>(
            serde_json::from_str(test_data::data_type::BOOLEAN_V1).expect("invalid json"),
            None,
        );
    }

    #[test]
    fn null() {
        check_serialization::<DataType>(
            serde_json::from_str(test_data::data_type::NULL_V1).expect("invalid json"),
            None,
        );
    }

    #[test]
    fn object() {
        check_serialization::<DataType>(
            serde_json::from_str(test_data::data_type::OBJECT_V1).expect("invalid json"),
            None,
        );
    }

    #[test]
    fn empty_list() {
        check_serialization::<DataType>(
            serde_json::from_str(test_data::data_type::EMPTY_LIST_V1).expect("invalid json"),
            None,
        );
    }
}
