mod error;
pub(in crate::ontology) mod repr;
#[cfg(target_arch = "wasm32")]
mod wasm;

use std::collections::HashMap;

pub use error::ParseDataTypeError;

use crate::{
    url::{BaseUrl, VersionedUrl},
    ValidateUri, ValidationError,
};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DataType {
    id: VersionedUrl,
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
        id: VersionedUrl,
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
    pub const fn id(&self) -> &VersionedUrl {
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

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
#[repr(transparent)]
pub struct DataTypeReference {
    url: VersionedUrl,
}

impl DataTypeReference {
    /// Creates a new `DataTypeReference` from the given [`VersionedUrl`].
    #[must_use]
    pub const fn new(url: VersionedUrl) -> Self {
        Self { url }
    }

    #[must_use]
    pub const fn url(&self) -> &VersionedUrl {
        &self.url
    }
}

impl From<&VersionedUrl> for &DataTypeReference {
    fn from(url: &VersionedUrl) -> Self {
        // SAFETY: Self is `repr(transparent)`
        unsafe { &*(url as *const VersionedUrl).cast::<DataTypeReference>() }
    }
}

impl ValidateUri for DataTypeReference {
    fn validate_uri(&self, base_url: &BaseUrl) -> Result<(), ValidationError> {
        if base_url == &self.url().base_url {
            Ok(())
        } else {
            Err(ValidationError::BaseUrlMismatch {
                base_url: base_url.clone(),
                versioned_url: self.url().clone(),
            })
        }
    }
}

#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use serde_json::json;

    use super::*;
    use crate::{
        test_data,
        url::ParseVersionedUrlError,
        utils::tests::{check_serialization_from_str, ensure_failed_validation},
    };

    #[test]
    fn text() {
        check_serialization_from_str::<DataType, repr::DataType>(
            test_data::data_type::TEXT_V1,
            None,
        );
    }

    #[test]
    fn number() {
        check_serialization_from_str::<DataType, repr::DataType>(
            test_data::data_type::NUMBER_V1,
            None,
        );
    }

    #[test]
    fn boolean() {
        check_serialization_from_str::<DataType, repr::DataType>(
            test_data::data_type::BOOLEAN_V1,
            None,
        );
    }

    #[test]
    fn null() {
        check_serialization_from_str::<DataType, repr::DataType>(
            test_data::data_type::NULL_V1,
            None,
        );
    }

    #[test]
    fn object() {
        check_serialization_from_str::<DataType, repr::DataType>(
            test_data::data_type::OBJECT_V1,
            None,
        );
    }

    #[test]
    fn empty_list() {
        check_serialization_from_str::<DataType, repr::DataType>(
            test_data::data_type::EMPTY_LIST_V1,
            None,
        );
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
            ParseDataTypeError::InvalidVersionedUrl(ParseVersionedUrlError::AdditionalEndContent),
        );
    }

    #[test]
    fn validate_data_type_ref_valid() {
        let url = VersionedUrl::from_str(
            "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
        )
        .expect("failed to create VersionedUrl");

        let data_type_ref = DataTypeReference::new(url.clone());

        data_type_ref
            .validate_uri(&url.base_url)
            .expect("failed to validate against base URL");
    }

    #[test]
    fn validate_data_type_ref_invalid() {
        let uri_a =
            VersionedUrl::from_str("https://blockprotocol.org/@alice/types/property-type/age/v/2")
                .expect("failed to parse VersionedUrl");
        let uri_b =
            VersionedUrl::from_str("https://blockprotocol.org/@alice/types/property-type/name/v/1")
                .expect("failed to parse VersionedUrl");

        let data_type_ref = DataTypeReference::new(uri_a);

        data_type_ref
            .validate_uri(&uri_b.base_url) // Try and validate against a different URI
            .expect_err("expected validation against base URL to fail but it didn't");
    }
}
