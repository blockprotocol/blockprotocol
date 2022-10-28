use std::{collections::HashMap, fmt::Debug};

use serde::{Deserialize, Serialize};
#[cfg(target_arch = "wasm32")]
use tsify::Tsify;

use crate::{
    repr, uri::BaseUri, ParsePropertyTypeObjectError, PropertyTypeReference, ValueOrArray,
};

/// Will serialize as a constant value `"object"`
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
enum ObjectTypeTag {
    Object,
}

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Object<T> {
    #[cfg_attr(target_arch = "wasm32", tsify(type = "'object'"))]
    r#type: ObjectTypeTag,
    #[cfg_attr(target_arch = "wasm32", tsify(type = "Record<BaseUri, T>"))]
    properties: HashMap<String, T>,
    #[cfg_attr(target_arch = "wasm32", tsify(optional, type = "BaseUri[]"))]
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    required: Vec<String>,
}

impl<const MIN: usize> TryFrom<Object<repr::ValueOrArray<repr::PropertyTypeReference>>>
    for super::Object<ValueOrArray<PropertyTypeReference>, MIN>
{
    type Error = ParsePropertyTypeObjectError;

    fn try_from(
        object_repr: Object<repr::ValueOrArray<repr::PropertyTypeReference>>,
    ) -> Result<Self, Self::Error> {
        let properties = object_repr
            .properties
            .into_iter()
            .map(|(base_uri, val)| {
                Ok((
                    BaseUri::new(base_uri)
                        .map_err(ParsePropertyTypeObjectError::InvalidPropertyKey)?,
                    val.try_into()?,
                ))
            })
            .collect::<Result<HashMap<_, _>, Self::Error>>()?;

        let required = object_repr
            .required
            .into_iter()
            .map(|base_uri| {
                BaseUri::new(base_uri).map_err(ParsePropertyTypeObjectError::InvalidRequiredKey)
            })
            .collect::<Result<Vec<_>, Self::Error>>()?;

        Self::new(properties, required).map_err(ParsePropertyTypeObjectError::ValidationError)
    }
}

impl<T, R, const MIN: usize> From<super::Object<T, MIN>> for Object<R>
where
    R: From<T>,
{
    fn from(object: super::Object<T, MIN>) -> Self {
        let properties = object
            .properties
            .into_iter()
            .map(|(uri, val)| (uri.to_string(), val.into()))
            .collect();
        let required = object
            .required
            .into_iter()
            .map(|uri| uri.to_string())
            .collect();
        Self {
            r#type: ObjectTypeTag::Object,
            properties,
            required,
        }
    }
}

#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use serde_json::json;

    use super::*;
    use crate::{
        repr::PropertyTypeReference,
        uri::VersionedUri,
        utils::tests::{check_repr_serialization_from_value, ensure_repr_failed_deserialization},
    };

    mod unconstrained {
        use super::*;

        type Object = super::Object<PropertyTypeReference>;

        #[test]
        fn empty() {
            check_repr_serialization_from_value(
                json!({
                    "type": "object",
                    "properties": {}
                }),
                Some(Object {
                    r#type: ObjectTypeTag::Object,
                    properties: HashMap::new(),
                    required: vec![],
                }),
            );
        }

        #[test]
        fn one() {
            let uri = VersionedUri::from_str("https://example.com/property_type/v/1")
                .expect("invalid Versioned URI");

            check_repr_serialization_from_value(
                json!({
                    "type": "object",
                    "properties": {
                        "https://example.com/property_type/": { "$ref": "https://example.com/property_type/v/1" },
                    }
                }),
                Some(Object {
                    r#type: ObjectTypeTag::Object,
                    properties: HashMap::from([(
                        uri.base_uri().to_string(),
                        PropertyTypeReference::new(uri.to_string()),
                    )]),
                    required: vec![],
                }),
            );
        }

        #[test]
        fn multiple() {
            let uri_a = VersionedUri::from_str("https://example.com/property_type_a/v/1")
                .expect("invalid Versioned URI");
            let uri_b = VersionedUri::from_str("https://example.com/property_type_b/v/1")
                .expect("invalid Versioned URI");

            check_repr_serialization_from_value(
                json!({
                    "type": "object",
                    "properties": {
                        "https://example.com/property_type_a/": { "$ref": "https://example.com/property_type_a/v/1" },
                        "https://example.com/property_type_b/": { "$ref": "https://example.com/property_type_b/v/1" },
                    }
                }),
                Some(Object {
                    r#type: ObjectTypeTag::Object,
                    properties: HashMap::from([
                        (
                            uri_a.base_uri().to_string(),
                            PropertyTypeReference::new(uri_a.to_string()),
                        ),
                        (
                            uri_b.base_uri().to_string(),
                            PropertyTypeReference::new(uri_b.to_string()),
                        ),
                    ]),
                    required: vec![],
                }),
            );
        }
    }

    mod constrained {
        use super::*;

        type Object = super::Object<PropertyTypeReference>;

        #[test]
        fn one() {
            let uri = VersionedUri::from_str("https://example.com/property_type/v/1")
                .expect("invalid Versioned URI");

            check_repr_serialization_from_value(
                json!({
                    "type": "object",
                    "properties": {
                        "https://example.com/property_type/": { "$ref": "https://example.com/property_type/v/1" },
                    }
                }),
                Some(Object {
                    r#type: ObjectTypeTag::Object,
                    properties: HashMap::from([(
                        uri.base_uri().to_string(),
                        PropertyTypeReference::new(uri.to_string()),
                    )]),
                    required: vec![],
                }),
            );
        }

        #[test]
        fn multiple() {
            let uri_a = VersionedUri::from_str("https://example.com/property_type_a/v/1")
                .expect("invalid Versioned URI");
            let uri_b = VersionedUri::from_str("https://example.com/property_type_b/v/1")
                .expect("invalid Versioned URI");

            check_repr_serialization_from_value(
                json!({
                    "type": "object",
                    "properties": {
                        "https://example.com/property_type_a/": { "$ref": "https://example.com/property_type_a/v/1" },
                        "https://example.com/property_type_b/": { "$ref": "https://example.com/property_type_b/v/1" },
                    }
                }),
                Some(Object {
                    r#type: ObjectTypeTag::Object,
                    properties: HashMap::from([
                        (
                            uri_a.base_uri().to_string(),
                            PropertyTypeReference::new(uri_a.to_string()),
                        ),
                        (
                            uri_b.base_uri().to_string(),
                            PropertyTypeReference::new(uri_b.to_string()),
                        ),
                    ]),
                    required: vec![],
                }),
            );
        }
    }

    #[test]
    fn required() {
        let uri_a = VersionedUri::from_str("https://example.com/property_type_a/v/1")
            .expect("invalid Versioned URI");
        let uri_b = VersionedUri::from_str("https://example.com/property_type_b/v/1")
            .expect("invalid Versioned URI");

        check_repr_serialization_from_value(
            json!({
                "type": "object",
                "properties": {
                    "https://example.com/property_type_a/": { "$ref": "https://example.com/property_type_a/v/1" },
                    "https://example.com/property_type_b/": { "$ref": "https://example.com/property_type_b/v/1" },
                },
                "required": [
                    "https://example.com/property_type_a/"
                ]
            }),
            Some(Object {
                r#type: ObjectTypeTag::Object,
                properties: HashMap::from([
                    (
                        uri_a.base_uri().to_string(),
                        PropertyTypeReference::new(uri_a.to_string()),
                    ),
                    (
                        uri_b.base_uri().to_string(),
                        PropertyTypeReference::new(uri_b.to_string()),
                    ),
                ]),
                required: vec![uri_a.base_uri().to_string()],
            }),
        );
    }

    #[test]
    fn additional_properties() {
        ensure_repr_failed_deserialization::<Object<PropertyTypeReference>>(json!({
            "type": "object",
            "properties": {
                "https://example.com/property_type_a/": { "$ref": "https://example.com/property_type_a/v/1" },
                "https://example.com/property_type_b/": { "$ref": "https://example.com/property_type_b/v/1" },
            },
            "additional_properties": 10
        }));
    }
}
