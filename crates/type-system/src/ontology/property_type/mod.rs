pub mod error;
pub(in crate::ontology) mod repr;
#[cfg(target_arch = "wasm32")]
mod wasm;

use std::{collections::HashSet, str::FromStr};

use crate::ontology::{
    data_type::DataTypeReference,
    property_type::error::ParsePropertyTypeError,
    uri::{BaseUri, ParseVersionedUriError, VersionedUri},
    Array, Object, OneOf, ValidateUri, ValidationError, ValueOrArray,
};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PropertyType {
    id: VersionedUri,
    title: String,
    plural_title: String,
    description: Option<String>,
    one_of: OneOf<PropertyValues>,
}

impl PropertyType {
    /// Creates a new `PropertyType`.
    #[must_use]
    pub const fn new(
        id: VersionedUri,
        title: String,
        plural_title: String,
        description: Option<String>,
        one_of: OneOf<PropertyValues>,
    ) -> Self {
        Self {
            id,
            title,
            plural_title,
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
    pub fn plural_title(&self) -> &str {
        &self.plural_title
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

impl FromStr for PropertyType {
    type Err = ParsePropertyTypeError;

    fn from_str(property_type_str: &str) -> Result<Self, Self::Err> {
        let property_type_repr: repr::PropertyType = serde_json::from_str(property_type_str)
            .map_err(|err| ParsePropertyTypeError::InvalidJson(err.to_string()))?;

        Self::try_from(property_type_repr)
    }
}

impl TryFrom<serde_json::Value> for PropertyType {
    type Error = ParsePropertyTypeError;

    fn try_from(value: serde_json::Value) -> Result<Self, Self::Error> {
        let property_type_repr: repr::PropertyType = serde_json::from_value(value)
            .map_err(|err| ParsePropertyTypeError::InvalidJson(err.to_string()))?;

        Self::try_from(property_type_repr)
    }
}

impl From<PropertyType> for serde_json::Value {
    fn from(property_type: PropertyType) -> Self {
        let property_type_repr: repr::PropertyType = property_type.into();

        serde_json::to_value(property_type_repr).expect("Failed to deserialize Property Type repr")
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
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

impl FromStr for PropertyTypeReference {
    type Err = ParseVersionedUriError;

    fn from_str(property_type_ref_str: &str) -> Result<Self, Self::Err> {
        let property_type_ref_repr: repr::PropertyTypeReference =
            serde_json::from_str(property_type_ref_str)
                .map_err(|err| ParseVersionedUriError::InvalidJson(err.to_string()))?;

        Self::try_from(property_type_ref_repr)
    }
}

impl TryFrom<serde_json::Value> for PropertyTypeReference {
    type Error = ParseVersionedUriError;

    fn try_from(value: serde_json::Value) -> Result<Self, Self::Error> {
        let property_type_ref_repr: repr::PropertyTypeReference = serde_json::from_value(value)
            .map_err(|err| ParseVersionedUriError::InvalidJson(err.to_string()))?;

        Self::try_from(property_type_ref_repr)
    }
}

impl From<PropertyTypeReference> for serde_json::Value {
    fn from(property_type_ref: PropertyTypeReference) -> Self {
        let property_type_ref_repr: repr::PropertyTypeReference = property_type_ref.into();

        serde_json::to_value(property_type_ref_repr)
            .expect("Failed to deserialize Property Type Reference repr")
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
#[allow(clippy::enum_variant_names)]
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
        ontology::shared::one_of::error::ParseOneOfError, test_data,
        utils::tests::check_serialization_from_str,
    };

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
            check_serialization_from_str(test_data::property_type::FAVORITE_QUOTE_V1, None);

        test_property_type_data_refs(&property_type, [
            "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
        ]);

        test_property_type_property_refs(&property_type, []);
    }

    #[test]
    fn age() {
        let property_type = check_serialization_from_str(test_data::property_type::AGE_V1, None);

        test_property_type_data_refs(&property_type, [
            "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
        ]);

        test_property_type_property_refs(&property_type, []);
    }

    #[test]
    fn user_id() {
        let property_type =
            check_serialization_from_str(test_data::property_type::USER_ID_V2, None);

        test_property_type_data_refs(&property_type, [
            "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
            "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
        ]);

        test_property_type_property_refs(&property_type, []);
    }

    #[test]
    fn contact_information() {
        let property_type =
            check_serialization_from_str(test_data::property_type::CONTACT_INFORMATION_V1, None);

        test_property_type_data_refs(&property_type, []);

        test_property_type_property_refs(&property_type, [
            "https://blockprotocol.org/@blockprotocol/types/property-type/email/v/1",
            "https://blockprotocol.org/@blockprotocol/types/property-type/phone-number/v/1",
        ]);
    }

    #[test]
    fn interests() {
        let property_type =
            check_serialization_from_str(test_data::property_type::INTERESTS_V1, None);

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
            check_serialization_from_str(test_data::property_type::NUMBERS_V1, None);

        test_property_type_data_refs(&property_type, [
            "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
        ]);

        test_property_type_property_refs(&property_type, []);
    }

    #[test]
    fn contrived_property() {
        let property_type =
            check_serialization_from_str(test_data::property_type::CONTRIVED_PROPERTY_V1, None);

        test_property_type_data_refs(&property_type, [
            "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
        ]);

        test_property_type_property_refs(&property_type, []);
    }

    #[test]
    fn invalid_id() {
        let invalid_property_type = json!(
            {
              "kind": "propertyType",
              "$id": "https://blockprotocol.org/@alice/types/property-type/age/v/1.2",
              "title": "Age",
              "pluralTitle": "Ages",
              "oneOf": [
                {
                  "$ref": "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1"
                }
              ]
            }
        );

        let result: Result<PropertyType, _> = invalid_property_type.try_into();
        assert_eq!(
            result,
            Err(ParsePropertyTypeError::InvalidVersionedUri(
                ParseVersionedUriError::AdditionalEndContent
            ))
        );
    }

    #[test]
    fn empty_one_of() {
        let invalid_property_type = json!(
            {
              "kind": "propertyType",
              "$id": "https://blockprotocol.org/@alice/types/property-type/age/v/1",
              "title": "Age",
              "pluralTitle": "Ages",
              "oneOf": []
            }
        );

        let result: Result<PropertyType, _> = invalid_property_type.try_into();
        assert_eq!(
            result,
            Err(ParsePropertyTypeError::InvalidOneOf(Box::new(
                ParseOneOfError::ValidationError(ValidationError::EmptyOneOf)
            )))
        );
    }

    #[test]
    fn invalid_reference() {
        let invalid_property_type = json!(
            {
              "kind": "propertyType",
              "$id": "https://blockprotocol.org/@alice/types/property-type/age/v/1",
              "title": "Age",
              "pluralTitle": "Ages",
              "oneOf": [
                {
                  "$ref": "https://blockprotocol.org/@blockprotocol/types/data-type/number"
                }
              ]
            }
        );

        let result: Result<PropertyType, _> = invalid_property_type.try_into();
        assert_eq!(
            result,
            Err(ParsePropertyTypeError::InvalidOneOf(Box::new(
                ParseOneOfError::PropertyValuesError(
                    ParsePropertyTypeError::InvalidDataTypeReference(
                        ParseVersionedUriError::IncorrectFormatting
                    )
                )
            )))
        );
    }
}
