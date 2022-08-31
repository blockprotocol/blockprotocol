use std::{collections::HashMap, str::FromStr};

use serde::{Deserialize, Serialize};

use crate::{
    repr, uri::VersionedUri, EntityTypeReference, ParseEntityTypeReferenceArrayError,
    ParseLinksError,
};

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

// impl TryFrom<LinksRepr> for Links {
//     type Error = ValidationError;
//
//     fn try_from(links: LinksRepr) -> Result<Self, ValidationError> {
//         let links = Self { repr: links };
//         links.validate()?;
//         Ok(links)
//     }
// }

//
// #[cfg(test)]
// mod tests {
//     use serde_json::json;
//
//     use super::*;
//     use crate::ontology::tests::{
//         check, check_deserialization, check_invalid_json, StringTypeStruct,
//     };
//
//     // TODO - write some tests for validation of Link schemas, although most testing happens on
//     //  entity types
//
//     mod maybe_ordered_array {
//
//         use super::*;
//
//         #[test]
//         fn unordered() -> Result<(), serde_json::Error> {
//             check(
//                 &MaybeOrderedArray::new(false, StringTypeStruct::default(), None, None),
//                 json!({
//                     "type": "array",
//                     "items": {
//                         "type": "string"
//                     },
//                     "ordered": false,
//                 }),
//             )?;
//
//             check_deserialization(
//                 &MaybeOrderedArray::new(false, StringTypeStruct::default(), None, None),
//                 json!({
//                     "type": "array",
//                     "items": {
//                         "type": "string"
//                     },
//                 }),
//             )?;
//
//             Ok(())
//         }
//
//         #[test]
//         fn ordered() -> Result<(), serde_json::Error> {
//             check(
//                 &MaybeOrderedArray::new(true, StringTypeStruct::default(), None, None),
//                 json!({
//                     "type": "array",
//                     "items": {
//                         "type": "string"
//                     },
//                     "ordered": true
//                 }),
//             )
//         }
//
//         #[test]
//         fn constrained() -> Result<(), serde_json::Error> {
//             check(
//                 &MaybeOrderedArray::new(false, StringTypeStruct::default(), Some(10), Some(20)),
//                 json!({
//                     "type": "array",
//                     "items": {
//                         "type": "string"
//                     },
//                     "ordered": false,
//                     "minItems": 10,
//                     "maxItems": 20,
//                 }),
//             )
//         }
//
//         #[test]
//         fn additional_properties() {
//             check_invalid_json::<MaybeOrderedArray<StringTypeStruct>>(json!({
//                 "type": "array",
//                 "items": {
//                     "type": "string"
//                 },
//                 "ordered": false,
//                 "minItems": 10,
//                 "maxItems": 20,
//                 "additional": 30,
//             }));
//         }
//     }
//
//     mod value_or_maybe_ordered_array {
//         use serde_json::json;
//
//         use super::*;
//
//         #[test]
//         fn value() -> Result<(), serde_json::Error> {
//             check(
//                 &ValueOrMaybeOrderedArray::Value("value".to_owned()),
//                 json!("value"),
//             )
//         }
//
//         #[test]
//         fn array() -> Result<(), serde_json::Error> {
//             check(
//                 &MaybeOrderedArray::new(false, StringTypeStruct::default(), None, None),
//                 json!({
//                     "type": "array",
//                     "items": {
//                         "type": "string"
//                     },
//                     "ordered": false
//                 }),
//             )
//         }
//     }
// }
