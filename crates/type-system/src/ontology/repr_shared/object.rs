use std::collections::HashMap;

use serde::{de, Deserialize, Deserializer, Serialize};
#[cfg(target_arch = "wasm32")]
use tsify::Tsify;

use crate::{
    ontology::repr_shared::validate::{ValidateUri, ValidationError},
    uri::BaseUri,
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
struct ObjectRepr<V> {
    #[cfg_attr(target_arch = "wasm32", tsify(type = "'object'"))]
    r#type: ObjectTypeTag,
    properties: HashMap<BaseUri, V>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    required: Vec<BaseUri>,
}

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct Object<V, const MIN: usize = 0> {
    #[serde(flatten)]
    repr: ObjectRepr<V>,
}

impl<V: ValidateUri, const MIN: usize> Object<V, MIN> {
    /// Creates a new `Object` without validating.
    #[must_use]
    pub fn new_unchecked(properties: HashMap<BaseUri, V>, required: Vec<BaseUri>) -> Self {
        Self {
            repr: ObjectRepr {
                r#type: ObjectTypeTag::Object,
                properties,
                required,
            },
        }
    }

    /// Creates a new `Object` with the given properties and required properties.
    ///
    /// # Errors
    ///
    /// - [`ValidationError::MissingRequiredProperty`] if a required property is not a key in
    ///   `properties`.
    /// - [`ValidationError::MismatchedPropertyCount`] if the number of properties is less than
    ///   `MIN`.
    pub fn new(
        properties: HashMap<BaseUri, V>,
        required: Vec<BaseUri>,
    ) -> Result<Self, ValidationError> {
        let object = Self::new_unchecked(properties, required);
        object.validate()?;
        Ok(object)
    }

    fn validate(&self) -> Result<(), ValidationError> {
        let num_properties = self.properties().len();
        if num_properties < MIN {
            return Err(ValidationError::MismatchedPropertyCount {
                actual: num_properties,
                expected: MIN,
            });
        };

        for uri in self.required() {
            if !self.properties().contains_key(uri) {
                return Err(ValidationError::MissingRequiredProperty(uri.clone()));
            }
        }

        for (base_uri, reference) in self.properties() {
            reference.validate_uri(base_uri)?;
        }

        Ok(())
    }

    #[must_use]
    pub const fn properties(&self) -> &HashMap<BaseUri, V> {
        &self.repr.properties
    }

    #[must_use]
    pub fn required(&self) -> &[BaseUri] {
        &self.repr.required
    }
}

impl<'de, V: ValidateUri + Deserialize<'de>, const MIN: usize> Deserialize<'de> for Object<V, MIN> {
    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let object = Self {
            repr: ObjectRepr::deserialize(deserializer)?,
        };
        object.validate().map_err(de::Error::custom)?;
        Ok(object)
    }
}

#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use serde_json::json;

    use super::*;
    use crate::{
        uri::VersionedUri,
        utils::tests::{check_serialization, ensure_failed_deserialization},
        PropertyTypeReference,
    };

    mod unconstrained {
        use super::*;

        type Object = super::Object<PropertyTypeReference, 0>;

        #[test]
        fn empty() {
            check_serialization(
                json!({
                    "type": "object",
                    "properties": {}
                }),
                Some(Object::new_unchecked(HashMap::new(), vec![])),
            );
        }

        #[test]
        fn one() {
            let uri = VersionedUri::from_str("https://example.com/property_type/v/1")
                .expect("invalid Versioned URI");

            check_serialization(
                json!({
                    "type": "object",
                    "properties": {
                        "https://example.com/property_type/": { "$ref": "https://example.com/property_type/v/1" },
                    }
                }),
                Some(Object::new_unchecked(
                    HashMap::from([(uri.base_uri().clone(), PropertyTypeReference::new(uri))]),
                    vec![],
                )),
            );
        }

        #[test]
        fn multiple() {
            let uri_a = VersionedUri::from_str("https://example.com/property_type_a/v/1")
                .expect("invalid Versioned URI");
            let uri_b = VersionedUri::from_str("https://example.com/property_type_b/v/1")
                .expect("invalid Versioned URI");

            check_serialization(
                json!({
                    "type": "object",
                    "properties": {
                        "https://example.com/property_type_a/": { "$ref": "https://example.com/property_type_a/v/1" },
                        "https://example.com/property_type_b/": { "$ref": "https://example.com/property_type_b/v/1" },
                    }
                }),
                Some(Object::new_unchecked(
                    HashMap::from([
                        (uri_a.base_uri().clone(), PropertyTypeReference::new(uri_a)),
                        (uri_b.base_uri().clone(), PropertyTypeReference::new(uri_b)),
                    ]),
                    vec![],
                )),
            );
        }
    }

    mod constrained {
        use super::*;

        type Object = super::Object<PropertyTypeReference, 1>;

        #[test]
        fn empty() {
            ensure_failed_deserialization::<Object>(json!({
                "type": "object",
                "properties": {}
            }));
        }

        #[test]
        fn one() {
            let uri = VersionedUri::from_str("https://example.com/property_type/v/1")
                .expect("invalid Versioned URI");

            check_serialization(
                json!({
                    "type": "object",
                    "properties": {
                        "https://example.com/property_type/": { "$ref": "https://example.com/property_type/v/1" },
                    }
                }),
                Some(Object::new_unchecked(
                    HashMap::from([(uri.base_uri().clone(), PropertyTypeReference::new(uri))]),
                    vec![],
                )),
            );
        }

        #[test]
        fn multiple() {
            let uri_a = VersionedUri::from_str("https://example.com/property_type_a/v/1")
                .expect("invalid Versioned URI");
            let uri_b = VersionedUri::from_str("https://example.com/property_type_b/v/1")
                .expect("invalid Versioned URI");

            check_serialization(
                json!({
                    "type": "object",
                    "properties": {
                        "https://example.com/property_type_a/": { "$ref": "https://example.com/property_type_a/v/1" },
                        "https://example.com/property_type_b/": { "$ref": "https://example.com/property_type_b/v/1" },
                    }
                }),
                Some(Object::new_unchecked(
                    HashMap::from([
                        (uri_a.base_uri().clone(), PropertyTypeReference::new(uri_a)),
                        (uri_b.base_uri().clone(), PropertyTypeReference::new(uri_b)),
                    ]),
                    vec![],
                )),
            );
        }
    }

    #[test]
    fn required() {
        let uri_a = VersionedUri::from_str("https://example.com/property_type_a/v/1")
            .expect("invalid Versioned URI");
        let uri_b = VersionedUri::from_str("https://example.com/property_type_b/v/1")
            .expect("invalid Versioned URI");

        check_serialization(
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
            Some(Object::<_, 0>::new_unchecked(
                HashMap::from([
                    (
                        uri_a.base_uri().clone(),
                        PropertyTypeReference::new(uri_a.clone()),
                    ),
                    (uri_b.base_uri().clone(), PropertyTypeReference::new(uri_b)),
                ]),
                vec![uri_a.base_uri().clone()],
            )),
        );
    }

    #[test]
    fn additional_properties() {
        ensure_failed_deserialization::<Object<PropertyTypeReference>>(json!({
            "type": "object",
            "properties": {
                "https://example.com/property_type_a/": { "$ref": "https://example.com/property_type_a/v/1" },
                "https://example.com/property_type_b/": { "$ref": "https://example.com/property_type_b/v/1" },
            },
            "additional_properties": 10
        }));
    }

    #[test]
    fn invalid_uri() {
        ensure_failed_deserialization::<Object<PropertyTypeReference>>(json!({
            "type": "object",
            "properties": {
                "https://example.com/property_type_a/": { "$ref": "https://example.com/property_type_b/v/1" }
            }
        }));
    }

    #[test]
    fn invalid_required() {
        ensure_failed_deserialization::<Object<PropertyTypeReference>>(json!({
            "type": "object",
            "properties": {
                "https://example.com/property_type_a/": { "$ref": "https://example.com/property_type_a/v/1" },
                "https://example.com/property_type_b/": { "$ref": "https://example.com/property_type_b/v/1" },
            },
            "required": [
                "https://example.com/property_type_c/"
            ]
        }));
    }
}
