mod error;
pub(in crate::ontology) mod repr;

use std::collections::HashMap;

pub use error::ParseLinksError;

use crate::{
    uri::{BaseUri, VersionedUri},
    Array, EntityTypeReference, OneOf, ValidateUri, ValidationError,
};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Links {
    links: HashMap<VersionedUri, MaybeOrderedArray<Option<OneOf<EntityTypeReference>>>>,
    required_links: Vec<VersionedUri>,
}

impl Links {
    /// Creates a new `Links` without validating.
    #[must_use]
    pub const fn new_unchecked(
        links: HashMap<VersionedUri, MaybeOrderedArray<Option<OneOf<EntityTypeReference>>>>,
        required: Vec<VersionedUri>,
    ) -> Self {
        Self {
            links,
            required_links: required,
        }
    }

    /// Creates a new `Links`.
    ///
    /// # Errors
    ///
    /// - [`ValidationError::MissingRequiredLink`] if a required link is not a key in `links`.
    pub fn new(
        links: HashMap<VersionedUri, MaybeOrderedArray<Option<OneOf<EntityTypeReference>>>>,
        required: Vec<VersionedUri>,
    ) -> Result<Self, ValidationError> {
        let links = Self::new_unchecked(links, required);
        links.validate()?;
        Ok(links)
    }

    fn validate(&self) -> Result<(), ValidationError> {
        for link in self.required() {
            if !self.links().contains_key(link) {
                return Err(ValidationError::MissingRequiredLink(link.clone()));
            }
        }
        Ok(())
    }

    #[must_use]
    pub const fn links(
        &self,
    ) -> &HashMap<VersionedUri, MaybeOrderedArray<Option<OneOf<EntityTypeReference>>>> {
        &self.links
    }

    #[must_use]
    pub fn required(&self) -> &[VersionedUri] {
        &self.required_links
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MaybeOrderedArray<T> {
    array: Array<T>,
    ordered: bool,
}

impl<T> MaybeOrderedArray<T> {
    #[must_use]
    pub const fn new(
        ordered: bool,
        items: T,
        min_items: Option<usize>,
        max_items: Option<usize>,
    ) -> Self {
        Self {
            array: Array::new(items, min_items, max_items),
            ordered,
        }
    }

    #[must_use]
    pub const fn array(&self) -> &Array<T> {
        &self.array
    }

    #[must_use]
    pub const fn ordered(&self) -> bool {
        self.ordered
    }
}

impl<T: ValidateUri> ValidateUri for MaybeOrderedArray<T> {
    fn validate_uri(&self, base_uri: &BaseUri) -> Result<(), ValidationError> {
        self.array().items().validate_uri(base_uri)
    }
}

// TODO - write some tests for validation of Link schemas, although most testing
//   happens on entity types

// #[cfg(test)]
// mod tests {
//     use serde_json::json;
//
//     use super::*;
//     use crate::ontology::tests::{
//         check, check_deserialization, check_invalid_json, StringTypeStruct,
//     };
//
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
