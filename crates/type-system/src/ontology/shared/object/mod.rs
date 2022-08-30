pub mod error;
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
    // use super::*;
    // use crate::ontology::property_type::PropertyTypeReference;
    //
    // type Object = super::Object<PropertyTypeReference, 1>;
    //
    // TODO: validation tests
    // #[test]
    // fn empty() {
    //     ensure_repr_failed_deserialization::<Object>(json!({
    //         "type": "object",
    //         "properties": {}
    //     }));
    // }
    //
    // #[test]
    // fn additional_properties() {
    //     ensure_failed_deserialization::<Object<PropertyTypeReference>>(json!({
    //         "type": "object",
    //         "properties": {
    //             "https://example.com/property_type_a/": { "$ref": "https://example.com/property_type_a/v/1" },
    //             "https://example.com/property_type_b/": { "$ref": "https://example.com/property_type_b/v/1" },
    //         },
    //         "additional_properties": 10
    //     }));
    // }
    //
    // #[test]
    // fn invalid_uri() {
    //     ensure_failed_deserialization::<Object<PropertyTypeReference>>(json!({
    //         "type": "object",
    //         "properties": {
    //             "https://example.com/property_type_a/": { "$ref": "https://example.com/property_type_b/v/1" }
    //         }
    //     }));
    // }
    //
    // #[test]
    // fn invalid_required() {
    //     ensure_failed_deserialization::<Object<PropertyTypeReference>>(json!({
    //         "type": "object",
    //         "properties": {
    //             "https://example.com/property_type_a/": { "$ref": "https://example.com/property_type_a/v/1" },
    //             "https://example.com/property_type_b/": { "$ref": "https://example.com/property_type_b/v/1" },
    //         },
    //         "required": [
    //             "https://example.com/property_type_c/"
    //         ]
    //     }));
    // }
    //
    // #[test]
    // fn invalid_uri() {
    //     ensure_repr_failed_deserialization::<Object<PropertyTypeReference>>(json!({
    //             "type": "object",
    //             "properties": {
    //                 "https://example.com/property_type_a/": { "$ref": "https://example.com/property_type_b/v/1" }
    //             }
    //         }));
    // }
}
