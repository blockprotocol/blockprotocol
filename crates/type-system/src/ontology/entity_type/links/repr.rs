use std::{collections::HashMap, str::FromStr};

use serde::{Deserialize, Serialize};
#[cfg(target_arch = "wasm32")]
use {tsify::Tsify, wasm_bindgen::prelude::*};

use crate::{
    repr, uri::VersionedUri, EntityTypeReference, ParseEntityTypeReferenceArrayError,
    ParseLinksError,
};

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Links {
    #[serde(default, skip_serializing_if = "HashMap::is_empty")]
    links: HashMap<String, ValueOrMaybeOrderedArray<repr::EntityTypeReference>>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    required_links: Vec<String>,
}

impl TryFrom<Links> for super::Links {
    type Error = ParseLinksError;

    fn try_from(links_repr: Links) -> Result<Self, Self::Error> {
        let links = links_repr
            .links
            .into_iter()
            .map(|(uri, val)| {
                Ok((
                    VersionedUri::from_str(&uri).map_err(ParseLinksError::InvalidLinkKey)?,
                    val.try_into()?,
                ))
            })
            .collect::<Result<HashMap<_, _>, Self::Error>>()?;

        let required_links = links_repr
            .required_links
            .into_iter()
            .map(|uri| VersionedUri::from_str(&uri).map_err(ParseLinksError::InvalidRequiredKey))
            .collect::<Result<Vec<_>, Self::Error>>()?;

        Self::new(links, required_links).map_err(ParseLinksError::ValidationError)
    }
}

impl From<super::Links> for Links {
    fn from(object: super::Links) -> Self {
        let links = object
            .links
            .into_iter()
            .map(|(uri, val)| (uri.to_string(), val.into()))
            .collect();
        let required_links = object
            .required_links
            .into_iter()
            .map(|uri| uri.to_string())
            .collect();
        Self {
            links,
            required_links,
        }
    }
}

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct MaybeOrderedArray<T> {
    #[serde(flatten)]
    array: repr::Array<T>,
    // By default, this will not be ordered.
    #[serde(default)]
    ordered: bool,
}

impl TryFrom<MaybeOrderedArray<repr::EntityTypeReference>>
    for super::MaybeOrderedArray<EntityTypeReference>
{
    type Error = ParseEntityTypeReferenceArrayError;

    fn try_from(
        maybe_ordered_array_repr: MaybeOrderedArray<repr::EntityTypeReference>,
    ) -> Result<Self, Self::Error> {
        Ok(Self {
            array: maybe_ordered_array_repr.array.try_into()?,
            ordered: maybe_ordered_array_repr.ordered,
        })
    }
}

impl<T, R> From<super::MaybeOrderedArray<T>> for MaybeOrderedArray<R>
where
    R: From<T>,
{
    fn from(maybe_ordered_array: super::MaybeOrderedArray<T>) -> Self {
        Self {
            array: maybe_ordered_array.array.into(),
            ordered: maybe_ordered_array.ordered,
        }
    }
}

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(untagged, deny_unknown_fields)]
pub enum ValueOrMaybeOrderedArray<T> {
    Value(T),
    Array(MaybeOrderedArray<T>),
}

impl TryFrom<ValueOrMaybeOrderedArray<repr::EntityTypeReference>>
    for super::ValueOrMaybeOrderedArray<EntityTypeReference>
{
    type Error = ParseLinksError;

    fn try_from(
        value_or_array_repr: ValueOrMaybeOrderedArray<repr::EntityTypeReference>,
    ) -> Result<Self, Self::Error> {
        Ok(match value_or_array_repr {
            ValueOrMaybeOrderedArray::Value(val) => Self::Value(
                val.try_into()
                    .map_err(ParseLinksError::InvalidEntityTypeReference)?,
            ),
            ValueOrMaybeOrderedArray::Array(array) => {
                Self::Array(array.try_into().map_err(ParseLinksError::InvalidArray)?)
            }
        })
    }
}

impl<T, R> From<super::ValueOrMaybeOrderedArray<T>> for ValueOrMaybeOrderedArray<R>
where
    R: From<T>,
{
    fn from(value_or_array: super::ValueOrMaybeOrderedArray<T>) -> Self {
        match value_or_array {
            super::ValueOrMaybeOrderedArray::Value(val) => Self::Value(val.into()),
            super::ValueOrMaybeOrderedArray::Array(array) => Self::Array(array.into()),
        }
    }
}

#[cfg(test)]
mod tests {
    use serde_json::json;

    use super::*;
    use crate::utils::tests::{
        check_repr_serialization_from_value, ensure_repr_failed_deserialization, StringTypeStruct,
    };

    // TODO - write some tests for validation of Link schemas, although most testing happens on
    //  entity types

    mod maybe_ordered_array {
        use super::*;

        #[test]
        fn unordered() {
            let expected_inner = json!(
                {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            );

            let as_json = json!({
                "type": "array",
                "items": {
                    "type": "string"
                },
                "ordered": false
            });

            let inner_array: repr::Array<StringTypeStruct> = serde_json::from_value(expected_inner)
                .expect("failed to deserialize array to repr");

            check_repr_serialization_from_value(
                as_json,
                Some(MaybeOrderedArray {
                    array: inner_array,
                    ordered: false,
                }),
            );
        }

        #[test]
        fn ordered() {
            let expected_inner = json!(
                {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            );

            let as_json = json!({
                "type": "array",
                "items": {
                    "type": "string"
                },
                "ordered": true
            });

            let inner_array: repr::Array<StringTypeStruct> = serde_json::from_value(expected_inner)
                .expect("failed to deserialize array to repr");

            check_repr_serialization_from_value(
                as_json,
                Some(MaybeOrderedArray {
                    array: inner_array,
                    ordered: true,
                }),
            );
        }

        #[test]
        fn constrained() {
            let expected_inner = json!(
                {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "minItems": 10,
                    "maxItems": 20
                }
            );

            let as_json = json!({
                "type": "array",
                "items": {
                    "type": "string"
                },
                "ordered": false,
                "minItems": 10,
                "maxItems": 20,
            });

            let inner_array: repr::Array<StringTypeStruct> = serde_json::from_value(expected_inner)
                .expect("failed to deserialize array to repr");

            check_repr_serialization_from_value(
                as_json,
                Some(MaybeOrderedArray {
                    array: inner_array,
                    ordered: false,
                }),
            );
        }

        #[test]
        fn additional_properties() {
            let as_json = json!({
                "type": "array",
                "items": {
                    "type": "string"
                },
                "ordered": false,
                "minItems": 10,
                "maxItems": 20,
                "additional": 30,
            });

            ensure_repr_failed_deserialization::<MaybeOrderedArray<StringTypeStruct>>(as_json);
        }
    }

    mod value_or_maybe_ordered_array {
        use serde_json::json;

        use super::*;

        #[test]
        fn value() {
            check_repr_serialization_from_value(
                json!("value"),
                Some(ValueOrMaybeOrderedArray::Value("value".to_owned())),
            );
        }

        #[test]
        fn array() {
            let expected_inner = json!(
                {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                }
            );

            let inner_array: repr::Array<StringTypeStruct> = serde_json::from_value(expected_inner)
                .expect("failed to deserialize array to repr");

            check_repr_serialization_from_value(
                json!({
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "ordered": false
                }),
                Some(ValueOrMaybeOrderedArray::Array(MaybeOrderedArray {
                    array: inner_array,
                    ordered: false,
                })),
            );
        }
    }
}
