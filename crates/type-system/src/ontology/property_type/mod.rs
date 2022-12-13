mod error;
pub(in crate::ontology) mod repr;
#[cfg(target_arch = "wasm32")]
mod wasm;

use std::collections::HashSet;

pub use error::ParsePropertyTypeError;

use crate::{
    uri::{BaseUri, VersionedUri},
    Array, DataTypeReference, Object, OneOf, ValidateUri, ValidationError, ValueOrArray,
};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PropertyType {
    id: VersionedUri,
    title: String,
    description: Option<String>,
    one_of: OneOf<PropertyValues>,
}

impl PropertyType {
    /// Creates a new `PropertyType`.
    #[must_use]
    pub const fn new(
        id: VersionedUri,
        title: String,
        description: Option<String>,
        one_of: OneOf<PropertyValues>,
    ) -> Self {
        Self {
            id,
            title,
            description,
            one_of,
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
    pub fn one_of(&self) -> &[PropertyValues] {
        self.one_of.one_of()
    }

    #[must_use]
    pub fn data_type_references(&self) -> HashSet<&DataTypeReference> {
        self.one_of
            .one_of()
            .iter()
            .flat_map(|value| value.data_type_references().into_iter())
            .collect()
    }

    #[must_use]
    pub fn property_type_references(&self) -> HashSet<&PropertyTypeReference> {
        self.one_of
            .one_of()
            .iter()
            .flat_map(|value| value.property_type_references().into_iter())
            .collect()
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
#[repr(transparent)]
pub struct PropertyTypeReference {
    uri: VersionedUri,
}

impl PropertyTypeReference {
    /// Creates a new `PropertyTypeReference` from the given [`VersionedUri`].
    #[must_use]
    pub const fn new(uri: VersionedUri) -> Self {
        Self { uri }
    }

    #[must_use]
    pub const fn uri(&self) -> &VersionedUri {
        &self.uri
    }
}

impl From<&VersionedUri> for &PropertyTypeReference {
    fn from(uri: &VersionedUri) -> Self {
        // SAFETY: Self is `repr(transparent)`
        unsafe { &*(uri as *const VersionedUri).cast::<PropertyTypeReference>() }
    }
}

impl ValidateUri for PropertyTypeReference {
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

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PropertyValues {
    DataTypeReference(DataTypeReference),
    PropertyTypeObject(Object<ValueOrArray<PropertyTypeReference>, 1>),
    ArrayOfPropertyValues(Array<OneOf<PropertyValues>>),
}

impl PropertyValues {
    #[must_use]
    fn data_type_references(&self) -> Vec<&DataTypeReference> {
        match self {
            Self::DataTypeReference(reference) => vec![reference],
            Self::ArrayOfPropertyValues(values) => values
                .items()
                .one_of()
                .iter()
                .flat_map(|value| value.data_type_references().into_iter())
                .collect(),
            Self::PropertyTypeObject(_) => vec![],
        }
    }

    #[must_use]
    fn property_type_references(&self) -> Vec<&PropertyTypeReference> {
        match self {
            Self::DataTypeReference(_) => vec![],
            Self::ArrayOfPropertyValues(values) => values
                .items()
                .one_of()
                .iter()
                .flat_map(|value| value.property_type_references().into_iter())
                .collect(),
            Self::PropertyTypeObject(object) => object
                .properties()
                .values()
                .map(|value| match value {
                    ValueOrArray::Value(one) => one,
                    ValueOrArray::Array(array) => array.items(),
                })
                .collect(),
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
        utils::tests::{check_serialization_from_str, ensure_failed_validation},
        ParseOneOfError,
    };
    use crate::uri::ParseVersionedUriError;

    fn test_property_type_data_refs(
        property_type: &PropertyType,
        uris: impl IntoIterator<Item = &'static str>,
    ) {
        let expected_data_type_references = uris
            .into_iter()
            .map(|uri| VersionedUri::from_str(uri).expect("invalid URI"))
            .collect::<HashSet<_>>();

        let data_type_references = property_type
            .data_type_references()
            .into_iter()
            .map(DataTypeReference::uri)
            .cloned()
            .collect::<HashSet<_>>();

        assert_eq!(data_type_references, expected_data_type_references);
    }

    fn test_property_type_property_refs(
        property_type: &PropertyType,
        uris: impl IntoIterator<Item = &'static str>,
    ) {
        let expected_property_type_references = uris
            .into_iter()
            .map(|uri| VersionedUri::from_str(uri).expect("invalid URI"))
            .collect::<HashSet<_>>();

        let property_type_references = property_type
            .property_type_references()
            .into_iter()
            .map(PropertyTypeReference::uri)
            .cloned()
            .collect::<HashSet<_>>();

        assert_eq!(property_type_references, expected_property_type_references);
    }

    #[test]
    fn favorite_quote() {
        let property_type =
            check_serialization_from_str::<PropertyType, repr::PropertyType>(test_data::property_type::FAVORITE_QUOTE_V1, None);

        test_property_type_data_refs(&property_type, [
            "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
        ]);

        test_property_type_property_refs(&property_type, []);
    }

    #[test]
    fn age() {
        let property_type = check_serialization_from_str::<PropertyType, repr::PropertyType>(test_data::property_type::AGE_V1, None);

        test_property_type_data_refs(&property_type, [
            "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
        ]);

        test_property_type_property_refs(&property_type, []);
    }

    #[test]
    fn user_id() {
        let property_type =
            check_serialization_from_str::<PropertyType, repr::PropertyType>(test_data::property_type::USER_ID_V2, None);

        test_property_type_data_refs(&property_type, [
            "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
            "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
        ]);

        test_property_type_property_refs(&property_type, []);
    }

    #[test]
    fn contact_information() {
        let property_type =
            check_serialization_from_str::<PropertyType, repr::PropertyType>(test_data::property_type::CONTACT_INFORMATION_V1, None);

        test_property_type_data_refs(&property_type, []);

        test_property_type_property_refs(&property_type, [
            "https://blockprotocol.org/@blockprotocol/types/property-type/email/v/1",
            "https://blockprotocol.org/@blockprotocol/types/property-type/phone-number/v/1",
        ]);
    }

    #[test]
    fn interests() {
        let property_type =
            check_serialization_from_str::<PropertyType, repr::PropertyType>(test_data::property_type::INTERESTS_V1, None);

        test_property_type_data_refs(&property_type, []);

        test_property_type_property_refs(&property_type, [
            "https://blockprotocol.org/@blockprotocol/types/property-type/favorite-film/v/1",
            "https://blockprotocol.org/@blockprotocol/types/property-type/favorite-song/v/1",
            "https://blockprotocol.org/@blockprotocol/types/property-type/hobby/v/1",
        ]);
    }

    #[test]
    fn numbers() {
        let property_type =
            check_serialization_from_str::<PropertyType, repr::PropertyType>(test_data::property_type::NUMBERS_V1, None);

        test_property_type_data_refs(&property_type, [
            "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
        ]);

        test_property_type_property_refs(&property_type, []);
    }

    #[test]
    fn contrived_property() {
        let property_type =
            check_serialization_from_str::<PropertyType, repr::PropertyType>(test_data::property_type::CONTRIVED_PROPERTY_V1, None);

        test_property_type_data_refs(&property_type, [
            "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
        ]);

        test_property_type_property_refs(&property_type, []);
    }

    #[test]
    fn invalid_id() {
        ensure_failed_validation::<repr::PropertyType, PropertyType>(
            &json!(
                {
                  "kind": "propertyType",
                  "$id": "https://blockprotocol.org/@alice/types/property-type/age/v/1.2",
                  "title": "Age",
                  "oneOf": [
                    {
                      "$ref": "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1"
                    }
                  ]
                }
            ),
            ParsePropertyTypeError::InvalidVersionedUri(
                ParseVersionedUriError::AdditionalEndContent,
            ),
        );
    }

    #[test]
    fn empty_one_of() {
        ensure_failed_validation::<repr::PropertyType, PropertyType>(
            &json!(
                {
                  "kind": "propertyType",
                  "$id": "https://blockprotocol.org/@alice/types/property-type/age/v/1",
                  "title": "Age",
                  "oneOf": []
                }
            ),
            ParsePropertyTypeError::InvalidOneOf(Box::new(ParseOneOfError::ValidationError(
                ValidationError::EmptyOneOf,
            ))),
        );
    }

    #[test]
    fn invalid_reference() {
        ensure_failed_validation::<repr::PropertyType, PropertyType>(
            &json!(
                {
                  "kind": "propertyType",
                  "$id": "https://blockprotocol.org/@alice/types/property-type/age/v/1",
                  "title": "Age",
                  "oneOf": [
                    {
                      "$ref": "https://blockprotocol.org/@blockprotocol/types/data-type/number"
                    }
                  ]
                }
            ),
            ParsePropertyTypeError::InvalidOneOf(Box::new(ParseOneOfError::PropertyValuesError(
                ParsePropertyTypeError::InvalidDataTypeReference(
                    ParseVersionedUriError::IncorrectFormatting,
                ),
            ))),
        );
    }

    #[test]
    fn validate_property_type_ref_valid() {
        let uri = VersionedUri::from_str(
            "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
        )
        .expect("failed to create VersionedUri");

        let property_type_ref = PropertyTypeReference::new(uri.clone());

        property_type_ref
            .validate_uri(uri.base_uri())
            .expect("failed to validate against base URI");
    }

    #[test]
    fn validate_property_type_ref_invalid() {
        let uri_a =
            VersionedUri::from_str("https://blockprotocol.org/@alice/types/property-type/age/v/2")
                .expect("failed to parse VersionedUri");
        let uri_b =
            VersionedUri::from_str("https://blockprotocol.org/@alice/types/property-type/name/v/1")
                .expect("failed to parse VersionedUri");

        let property_type_ref = PropertyTypeReference::new(uri_a);

        property_type_ref
            .validate_uri(uri_b.base_uri()) // Try and validate against a different URI
            .expect_err("expected validation against base URI to fail but it didn't");
    }
}
