pub(crate) mod error;
pub(in crate::ontology) mod repr;

use crate::{uri::BaseUri, ValidateUri, ValidationError};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Array<T> {
    items: T,
    min_items: Option<usize>,
    max_items: Option<usize>,
}

impl<T> Array<T> {
    #[must_use]
    pub const fn new(items: T, min_items: Option<usize>, max_items: Option<usize>) -> Self {
        Self {
            items,
            min_items,
            max_items,
        }
    }

    #[must_use]
    pub const fn items(&self) -> &T {
        &self.items
    }

    #[must_use]
    pub const fn min_items(&self) -> Option<usize> {
        self.min_items
    }

    #[must_use]
    pub const fn max_items(&self) -> Option<usize> {
        self.max_items
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ValueOrArray<T> {
    Value(T),
    Array(Array<T>),
}

impl<T: ValidateUri> ValidateUri for ValueOrArray<T> {
    fn validate_uri(&self, base_uri: &BaseUri) -> Result<(), ValidationError> {
        match self {
            Self::Value(value) => value.validate_uri(base_uri),
            Self::Array(array) => array.items().validate_uri(base_uri),
        }
    }
}

#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use serde_json::json;

    use super::*;
    use crate::{repr, uri::VersionedUri, PropertyTypeReference};

    fn get_test_value_or_array(uri: &VersionedUri) -> ValueOrArray<PropertyTypeReference> {
        let json_repr = json!({
            "type": "array",
            "items": {
                "$ref": uri.to_string()
            },
            "minItems": 10,
            "maxItems": 20,
        });
        let array_repr: repr::ValueOrArray<repr::PropertyTypeReference> =
            serde_json::from_value(json_repr).expect("failed to deserialize ValueOrArray");

        array_repr.try_into().expect("failed to convert array repr")
    }

    #[test]
    fn valid_uri() {
        let uri =
            VersionedUri::from_str("https://blockprotocol.org/@alice/types/property-type/age/v/2")
                .expect("failed to parse VersionedUri");
        let array = get_test_value_or_array(&uri);

        array
            .validate_uri(&uri.base_uri)
            .expect("failed to validate against base URI");
    }

    #[test]
    fn invalid_uri() {
        let uri_a =
            VersionedUri::from_str("https://blockprotocol.org/@alice/types/property-type/age/v/2")
                .expect("failed to parse VersionedUri");
        let uri_b =
            VersionedUri::from_str("https://blockprotocol.org/@alice/types/property-type/name/v/1")
                .expect("failed to parse VersionedUri");

        let array = get_test_value_or_array(&uri_a);

        array
            .validate_uri(&uri_b.base_uri) // Try and validate against a different URI
            .expect_err("expected validation against base URI to fail but it didn't");
    }
}
