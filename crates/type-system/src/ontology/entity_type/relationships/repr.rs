use std::{collections::HashMap, str::FromStr};

use serde::{Deserialize, Serialize};
#[cfg(target_arch = "wasm32")]
use {tsify::Tsify, wasm_bindgen::prelude::*};

use crate::{
    repr, uri::VersionedUri, EntityTypeReference, OneOf, ParseEntityTypeReferenceArrayError,
    ParseRelationshipsError,
};

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Relationships {
    #[serde(default, skip_serializing_if = "HashMap::is_empty")]
    relationships: HashMap<String, MaybeOrderedArray<repr::OneOf<repr::EntityTypeReference>>>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    required_relationships: Vec<String>,
}

impl TryFrom<Relationships> for super::Relationships {
    type Error = ParseRelationshipsError;

    fn try_from(relationships_repr: Relationships) -> Result<Self, Self::Error> {
        let relationships = relationships_repr
            .relationships
            .into_iter()
            .map(|(uri, val)| {
                Ok((
                    VersionedUri::from_str(&uri)
                        .map_err(ParseRelationshipsError::InvalidRelationshipKey)?,
                    val.try_into()
                        .map_err(ParseRelationshipsError::InvalidArray)?,
                ))
            })
            .collect::<Result<HashMap<_, _>, Self::Error>>()?;

        let required_relationships = relationships_repr
            .required_relationships
            .into_iter()
            .map(|uri| {
                VersionedUri::from_str(&uri).map_err(ParseRelationshipsError::InvalidRequiredKey)
            })
            .collect::<Result<Vec<_>, Self::Error>>()?;

        Self::new(relationships, required_relationships)
            .map_err(ParseRelationshipsError::ValidationError)
    }
}

impl From<super::Relationships> for Relationships {
    fn from(object: super::Relationships) -> Self {
        let relationships = object
            .relationships
            .into_iter()
            .map(|(uri, val)| (uri.to_string(), val.into()))
            .collect();
        let required_relationships = object
            .required_relationships
            .into_iter()
            .map(|uri| uri.to_string())
            .collect();
        Self {
            relationships,
            required_relationships,
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

impl TryFrom<MaybeOrderedArray<repr::OneOf<repr::EntityTypeReference>>>
    for super::MaybeOrderedArray<OneOf<EntityTypeReference>>
{
    type Error = ParseEntityTypeReferenceArrayError;

    fn try_from(
        maybe_ordered_array_repr: MaybeOrderedArray<repr::OneOf<repr::EntityTypeReference>>,
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

#[cfg(test)]
mod tests {
    use serde_json::json;

    use super::*;
    use crate::utils::tests::{
        check_repr_serialization_from_value, ensure_repr_failed_deserialization, StringTypeStruct,
    };

    // TODO - write some tests for validation of Relationship schemas, although most testing happens
    // on  entity types

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
}
