mod error;
pub(in crate::ontology) mod repr;
#[cfg(target_arch = "wasm32")]
mod wasm;

use std::{collections::HashMap, str::FromStr};
use serde::{Deserialize, Deserializer, Serialize, Serializer};

pub use error::ParseDataTypeError;

use crate::{
    uri::{BaseUri, ParseVersionedUriError, VersionedUri},
    ValidateUri, ValidationError,
};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DataType {
    id: VersionedUri,
    title: String,
    description: Option<String>,
    json_type: String,
    /// Properties which are not currently strongly typed.
    ///
    /// The data type meta-schema currently allows arbitrary, untyped properties. This is a
    /// catch-all field to store all non-typed data.
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

impl FromStr for DataType {
    type Err = ParseDataTypeError;

    fn from_str(data_type_str: &str) -> Result<Self, Self::Err> {
        let data_type_repr: repr::DataType = serde_json::from_str(data_type_str)
            .map_err(|err| ParseDataTypeError::InvalidJson(err.to_string()))?;

        Self::try_from(data_type_repr)
    }
}

impl TryFrom<serde_json::Value> for DataType {
    type Error = ParseDataTypeError;

    fn try_from(value: serde_json::Value) -> Result<Self, Self::Error> {
        let data_type_repr: repr::DataType = serde_json::from_value(value)
            .map_err(|err| ParseDataTypeError::InvalidJson(err.to_string()))?;

        Self::try_from(data_type_repr)
    }
}

impl<'de> Deserialize<'de> for DataType {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        Self::try_from(repr::DataType::deserialize(deserializer)?).map_err(serde::de::Error::custom)
    }
}

impl From<DataType> for serde_json::Value {
    fn from(data_type: DataType) -> Self {
        let data_type_repr: repr::DataType = data_type.into();

        serde_json::to_value(data_type_repr).expect("Failed to deserialize Data Type repr")
    }
}

impl Serialize for DataType {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        repr::DataType::from(self.clone()).serialize(serializer)
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
#[repr(transparent)]
pub struct DataTypeReference {
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

impl From<&VersionedUri> for &DataTypeReference {
    fn from(uri: &VersionedUri) -> Self {
        // SAFETY: Self is `repr(transparent)`
        unsafe { &*(uri as *const VersionedUri).cast::<DataTypeReference>() }
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

impl TryFrom<serde_json::Value> for DataTypeReference {
    type Error = ParseVersionedUriError;

    fn try_from(value: serde_json::Value) -> Result<Self, Self::Error> {
        let data_type_ref_repr: repr::DataTypeReference = serde_json::from_value(value)
            .map_err(|err| ParseVersionedUriError::InvalidJson(err.to_string()))?;

        Self::try_from(data_type_ref_repr)
    }
}

impl From<DataTypeReference> for serde_json::Value {
    fn from(data_type_ref: DataTypeReference) -> Self {
        let data_type_ref_repr: repr::DataTypeReference = data_type_ref.into();

        serde_json::to_value(data_type_ref_repr)
            .expect("Failed to deserialize Data Type Reference repr")
    }
}

#[cfg(test)]
mod tests {
    use serde_json::json;

    use super::*;
    use crate::{
        test_data,
        utils::tests::{check_serialization_from_str, ensure_failed_validation},
    };

    #[test]
    fn text() {
        check_serialization_from_str::<DataType>(test_data::data_type::TEXT_V1, None);
    }

    #[test]
    fn number() {
        check_serialization_from_str::<DataType>(test_data::data_type::NUMBER_V1, None);
    }

    #[test]
    fn boolean() {
        check_serialization_from_str::<DataType>(test_data::data_type::BOOLEAN_V1, None);
    }

    #[test]
    fn null() {
        check_serialization_from_str::<DataType>(test_data::data_type::NULL_V1, None);
    }

    #[test]
    fn object() {
        check_serialization_from_str::<DataType>(test_data::data_type::OBJECT_V1, None);
    }

    #[test]
    fn empty_list() {
        check_serialization_from_str::<DataType>(test_data::data_type::EMPTY_LIST_V1, None);
    }

    #[test]
    fn invalid_id() {
        ensure_failed_validation::<repr::DataType, DataType>(
            &json!(
                {
                  "kind": "dataType",
                  "$id": "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1.5",
                  "title": "Text",
                  "description": "An ordered sequence of characters",
                  "type": "string"
                }
            ),
            ParseDataTypeError::InvalidVersionedUri(ParseVersionedUriError::AdditionalEndContent),
        );
    }

    #[test]
    fn validate_data_type_ref_valid() {
        let uri = VersionedUri::from_str(
            "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
        )
        .expect("failed to create VersionedUri");

        let data_type_ref = DataTypeReference::new(uri.clone());

        data_type_ref
            .validate_uri(uri.base_uri())
            .expect("failed to validate against base URI");
    }

    #[test]
    fn validate_data_type_ref_invalid() {
        let uri_a =
            VersionedUri::from_str("https://blockprotocol.org/@alice/types/property-type/age/v/2")
                .expect("failed to parse VersionedUri");
        let uri_b =
            VersionedUri::from_str("https://blockprotocol.org/@alice/types/property-type/name/v/1")
                .expect("failed to parse VersionedUri");

        let data_type_ref = DataTypeReference::new(uri_a);

        data_type_ref
            .validate_uri(uri_b.base_uri()) // Try and validate against a different URI
            .expect_err("expected validation against base URI to fail but it didn't");
    }
}
