pub(in crate::ontology) mod repr {
    use serde::{Deserialize, Serialize};
    #[cfg(target_arch = "wasm32")]
    use tsify::Tsify;

    use crate::{
        ontology::shared::validate::{ValidateUri, ValidationError},
        uri::BaseUri,
    };

    /// Will serialize as a constant value `"array"`
    #[derive(Default, Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
    #[serde(rename_all = "camelCase")]
    enum ArrayTypeTag {
        #[default]
        Array,
    }

    #[cfg_attr(target_arch = "wasm32", derive(Tsify))]
    #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
    #[serde(rename_all = "camelCase", deny_unknown_fields)]
    pub struct Array<T> {
        #[cfg_attr(target_arch = "wasm32", tsify(type = "'array'"))]
        r#type: ArrayTypeTag,
        items: T,
        #[cfg_attr(target_arch = "wasm32", tsify(optional))]
        #[serde(skip_serializing_if = "Option::is_none")]
        min_items: Option<usize>,
        #[cfg_attr(target_arch = "wasm32", tsify(optional))]
        #[serde(skip_serializing_if = "Option::is_none")]
        max_items: Option<usize>,
    }

    #[cfg_attr(target_arch = "wasm32", derive(Tsify))]
    #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
    #[serde(untagged, deny_unknown_fields)]
    pub enum ValueOrArray<T> {
        Value(T),
        Array(Array<T>),
    }
}

use crate::{
    ontology::shared::validate::{ValidateUri, ValidationError},
    uri::BaseUri,
};

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
    use serde_json::json;

    use super::*;
    use crate::utils::tests::{
        check_serialization, ensure_failed_deserialization, StringTypeStruct,
    };

    #[test]
    fn unconstrained() {
        check_serialization(
            json!({
                "type": "array",
                "items": {
                    "type": "string"
                },
            }),
            Some(Array::new(StringTypeStruct::default(), None, None)),
        );
    }

    #[test]
    fn constrained() {
        check_serialization(
            json!({
                "type": "array",
                "items": {
                    "type": "string"
                },
                              "minItems": 10,
                "maxItems": 20,
            }),
            Some(Array::new(StringTypeStruct::default(), Some(10), Some(20))),
        );
    }

    #[test]
    fn additional_properties() {
        ensure_failed_deserialization::<Array<StringTypeStruct>>(json!({
            "type": "array",
            "items": {
                "type": "string"
            },
            "minItems": 10,
            "maxItems": 20,
            "additional": 30,
        }));
    }

    mod value_or_array {
        use serde_json::json;

        use super::*;
        use crate::utils::tests::check_serialization;

        #[test]
        fn value() {
            check_serialization(
                json!("value"),
                Some(ValueOrArray::Value("value".to_owned())),
            );
        }

        #[test]
        fn array() {
            check_serialization(
                json!({
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                }),
                Some(ValueOrArray::Array(Array::new(
                    StringTypeStruct::default(),
                    None,
                    None,
                ))),
            );
        }
    }
}
