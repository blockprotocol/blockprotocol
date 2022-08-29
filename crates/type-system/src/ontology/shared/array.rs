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

    impl<T, R> TryFrom<Array<R>> for super::Array<T>
    where
        T: TryFrom<R>,
    {
        // TODO
        type Error = ();

        fn try_from(array_repr: Array<R>) -> Result<Self, Self::Error> {
            Ok(Self {
                items: array_repr.items.try_into().map_err(|err| ())?,
                min_items: array_repr.min_items,
                max_items: array_repr.max_items,
            })
        }
    }

    impl<T> From<super::Array<T>> for Array<T> {
        fn from(array: super::Array<T>) -> Self {
            Self {
                r#type: ArrayTypeTag::Array,
                items: array.items.into(),
                min_items: array.min_items,
                max_items: array.max_items,
            }
        }
    }

    #[cfg_attr(target_arch = "wasm32", derive(Tsify))]
    #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
    #[serde(untagged, deny_unknown_fields)]
    pub enum ValueOrArray<T> {
        Value(T),
        Array(Array<T>),
    }

    impl<T, R> TryFrom<ValueOrArray<R>> for super::ValueOrArray<T>
    where
        T: TryFrom<R>,
    {
        // TODO
        type Error = ();

        fn try_from(value_or_array_repr: ValueOrArray<R>) -> Result<Self, Self::Error> {
            Ok(match value_or_array_repr {
                ValueOrArray::Value(val) => Self::Value(val.try_into().map_err(|err| ())?),
                ValueOrArray::Array(array) => Self::Array(array.try_into()?),
            })
        }
    }

    impl<T> From<super::ValueOrArray<T>> for ValueOrArray<T> {
        fn from(value_or_array: super::ValueOrArray<T>) -> Self {
            match value_or_array {
                super::ValueOrArray::Value(val) => Self::Value(val.into()),
                super::ValueOrArray::Array(array) => Self::Array(array.into()),
            }
        }
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
