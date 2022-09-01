pub(crate) mod error;
pub(in crate::ontology) mod repr;

use std::collections::HashMap;

use crate::{uri::BaseUri, ValidateUri, ValidationError};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Object<T, const MIN: usize = 0> {
    properties: HashMap<BaseUri, T>,
    required: Vec<BaseUri>,
}

impl<T: ValidateUri, const MIN: usize> Object<T, MIN> {
    /// Creates a new `Object` without validating.
    #[must_use]
    pub fn new_unchecked(properties: HashMap<BaseUri, T>, required: Vec<BaseUri>) -> Self {
        Self {
            properties,
            required,
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
        properties: HashMap<BaseUri, T>,
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
    pub const fn properties(&self) -> &HashMap<BaseUri, T> {
        &self.properties
    }

    #[must_use]
    pub fn required(&self) -> &[BaseUri] {
        &self.required
    }
}

#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use serde_json::json;

    use super::*;
    use crate::{
        repr, uri::VersionedUri, utils::tests::ensure_failed_validation,
        ParsePropertyTypeObjectError, PropertyTypeReference, ValueOrArray,
    };

    type ObjectRepr = repr::Object<repr::ValueOrArray<repr::PropertyTypeReference>>;
    type Object = super::Object<ValueOrArray<PropertyTypeReference>, 1>;

    #[test]
    fn empty() {
        ensure_failed_validation::<ObjectRepr, Object>(
            &json!({
                "type": "object",
                "properties": {}
            }),
            ParsePropertyTypeObjectError::ValidationError(
                ValidationError::MismatchedPropertyCount {
                    actual: 0,
                    expected: 1,
                },
            ),
        );
    }

    #[test]
    fn invalid_uri() {
        ensure_failed_validation::<ObjectRepr, Object>(
            &json!({
                "type": "object",
                "properties": {
                    "https://example.com/property_type_a/": { "$ref": "https://example.com/property_type_b/v/1" }
                }
            }),
            ParsePropertyTypeObjectError::ValidationError(ValidationError::BaseUriMismatch {
                base_uri: BaseUri::new("https://example.com/property_type_a/".to_owned())
                    .expect("failed to create BaseURI"),
                versioned_uri: VersionedUri::from_str("https://example.com/property_type_b/v/1")
                    .expect("failed to create VersionedUri"),
            }),
        );
    }

    #[test]
    fn invalid_required() {
        ensure_failed_validation::<ObjectRepr, Object>(
            &json!({
                "type": "object",
                "properties": {
                    "https://example.com/property_type_a/": { "$ref": "https://example.com/property_type_a/v/1" },
                    "https://example.com/property_type_b/": { "$ref": "https://example.com/property_type_b/v/1" },
                },
                "required": [
                    "https://example.com/property_type_c/"
                ]
            }),
            ParsePropertyTypeObjectError::ValidationError(
                ValidationError::MissingRequiredProperty(
                    BaseUri::new("https://example.com/property_type_c/".to_owned())
                        .expect("failed to create BaseURI"),
                ),
            ),
        );
    }
}
