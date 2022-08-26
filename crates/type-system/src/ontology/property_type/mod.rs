#[cfg(target_arch = "wasm32")]
mod wasm;

use std::collections::HashSet;

use serde::{Deserialize, Serialize};
#[cfg(target_arch = "wasm32")]
use {tsify::Tsify, wasm_bindgen::prelude::*};

use crate::{
    ontology::data_type::DataTypeReference,
    uri::{BaseUri, VersionedUri},
    Array, Object, OneOf, ValidateUri, ValidationError, ValueOrArray,
};

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct PropertyTypeReference {
    #[serde(rename = "$ref")]
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

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(untagged)]
#[allow(clippy::enum_variant_names)]
pub enum PropertyValues {
    DataTypeReference(DataTypeReference),
    PropertyTypeObject(Object<ValueOrArray<PropertyTypeReference>, 1>),
    ArrayOfPropertyValues(
        // This is a hack, currently recursive enums seem to break tsify
        // https://github.com/madonoharu/tsify/issues/5
        #[cfg_attr(target_arch = "wasm32", tsify(type = "Array<OneOf<PropertyValues>>"))]
        Array<OneOf<PropertyValues>>,
    ),
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

/// Will serialize as a constant value `"propertyType"`
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[allow(clippy::use_self)]
enum PropertyTypeTag {
    PropertyType,
}

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct PropertyType {
    #[cfg_attr(target_arch = "wasm32", tsify(type = "'propertyType'"))]
    kind: PropertyTypeTag,
    #[serde(rename = "$id")]
    id: VersionedUri,
    title: String,
    plural_title: String,
    #[cfg_attr(target_arch = "wasm32", tsify(optional))]
    #[serde(skip_serializing_if = "Option::is_none")]
    description: Option<String>,
    #[serde(flatten)]
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
            kind: PropertyTypeTag::PropertyType,
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

#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use super::*;
    use crate::test_data;

    fn test_property_type_schema(schema: &serde_json::Value) -> PropertyType {
        let property_type: PropertyType =
            serde_json::from_value(schema.clone()).expect("invalid schema");
        assert_eq!(
            serde_json::to_value(property_type.clone()).expect("could not serialize"),
            *schema,
            "{property_type:#?}"
        );
        property_type
    }

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
        let property_type = test_property_type_schema(
            &serde_json::from_str(test_data::property_type::FAVORITE_QUOTE_V1)
                .expect("invalid JSON"),
        );

        test_property_type_data_refs(&property_type, [
            "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
        ]);

        test_property_type_property_refs(&property_type, []);
    }

    #[test]
    fn age() {
        let property_type = test_property_type_schema(
            &serde_json::from_str(test_data::property_type::AGE_V1).expect(
                "invalid
JSON",
            ),
        );

        test_property_type_data_refs(&property_type, [
            "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
        ]);

        test_property_type_property_refs(&property_type, []);
    }

    #[test]
    fn user_id() {
        let property_type = test_property_type_schema(
            &serde_json::from_str(test_data::property_type::USER_ID_V2).expect("invalid JSON"),
        );

        test_property_type_data_refs(&property_type, [
            "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
            "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
        ]);

        test_property_type_property_refs(&property_type, []);
    }

    #[test]
    fn contact_information() {
        let property_type = test_property_type_schema(
            &serde_json::from_str(test_data::property_type::CONTACT_INFORMATION_V1)
                .expect("invalid JSON"),
        );

        test_property_type_data_refs(&property_type, []);

        test_property_type_property_refs(&property_type, [
            "https://blockprotocol.org/@blockprotocol/types/property-type/email/v/1",
            "https://blockprotocol.org/@blockprotocol/types/property-type/phone-number/v/1",
        ]);
    }

    #[test]
    fn interests() {
        let property_type = test_property_type_schema(
            &serde_json::from_str(test_data::property_type::INTERESTS_V1).expect("invalid JSON"),
        );

        test_property_type_data_refs(&property_type, []);

        test_property_type_property_refs(&property_type, [
            "https://blockprotocol.org/@blockprotocol/types/property-type/favorite-film/v/1",
            "https://blockprotocol.org/@blockprotocol/types/property-type/favorite-song/v/1",
            "https://blockprotocol.org/@blockprotocol/types/property-type/hobby/v/1",
        ]);
    }

    #[test]
    fn numbers() {
        let property_type = test_property_type_schema(
            &serde_json::from_str(test_data::property_type::NUMBERS_V1).expect("invalid JSON"),
        );

        test_property_type_data_refs(&property_type, [
            "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
        ]);

        test_property_type_property_refs(&property_type, []);
    }

    #[test]
    fn contrived_property() {
        let property_type = test_property_type_schema(
            &serde_json::from_str(test_data::property_type::CONTRIVED_PROPERTY_V1)
                .expect("invalid JSON"),
        );

        test_property_type_data_refs(&property_type, [
            "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
        ]);

        test_property_type_property_refs(&property_type, []);
    }
}
