mod error;
pub(in crate::ontology) mod links;
pub(in crate::ontology) mod repr;
#[cfg(target_arch = "wasm32")]
mod wasm;

use std::{
    collections::{HashMap, HashSet},
    str::FromStr,
};

pub use error::ParseEntityTypeError;

use crate::{
    uri::{BaseUri, ParseVersionedUriError, VersionedUri},
    Links, Object, PropertyTypeReference, ValidateUri, ValidationError, ValueOrArray,
    ValueOrMaybeOrderedArray,
};

/// Intermediate representation used during deserialization.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct EntityType {
    id: VersionedUri,
    title: String,
    description: Option<String>,
    default: HashMap<VersionedUri, serde_json::Value>,
    examples: Vec<HashMap<VersionedUri, serde_json::Value>>,
    property_object: Object<ValueOrArray<PropertyTypeReference>>,
    links: Links,
}

impl EntityType {
    /// Creates a new `EntityType`
    #[must_use]
    #[expect(clippy::too_many_arguments)]
    pub fn new(
        id: VersionedUri,
        title: String,
        description: Option<String>,
        default: HashMap<VersionedUri, serde_json::Value>,
        examples: Vec<HashMap<VersionedUri, serde_json::Value>>,
        property_object: Object<ValueOrArray<PropertyTypeReference>>,
        links: Links,
    ) -> Self {
        Self {
            id,
            title,
            description,
            default,
            examples,
            property_object,
            links,
        }
    }

    #[must_use]
    pub const fn id(&self) -> &VersionedUri {
        &self.id
    }

    #[must_use]
    pub fn title(&self) -> &str {
        &self.title
    }

    #[must_use]
    pub fn description(&self) -> Option<&str> {
        self.description.as_deref()
    }

    #[must_use]
    pub const fn default(&self) -> &HashMap<VersionedUri, serde_json::Value> {
        &self.default
    }

    #[must_use]
    pub const fn examples(&self) -> &Vec<HashMap<VersionedUri, serde_json::Value>> {
        &self.examples
    }

    #[must_use]
    pub const fn properties(&self) -> &HashMap<BaseUri, ValueOrArray<PropertyTypeReference>> {
        self.property_object.properties()
    }

    #[must_use]
    pub fn required(&self) -> &[BaseUri] {
        self.property_object.required()
    }

    #[must_use]
    pub const fn links(
        &self,
    ) -> &HashMap<VersionedUri, ValueOrMaybeOrderedArray<EntityTypeReference>> {
        self.links.links()
    }

    #[must_use]
    pub fn required_links(&self) -> &[VersionedUri] {
        self.links.required()
    }

    #[must_use]
    pub fn property_type_references(&self) -> HashSet<&PropertyTypeReference> {
        self.properties()
            .iter()
            .map(|(_, property_def)| match property_def {
                ValueOrArray::Value(uri) => uri,
                ValueOrArray::Array(array) => array.items(),
            })
            .collect()
    }

    #[must_use]
    pub fn link_type_references(&self) -> HashMap<&VersionedUri, &EntityTypeReference> {
        self.links()
            .iter()
            .map(|(link_type, entity_type)| (link_type, entity_type.inner()))
            .collect()
    }
}

impl FromStr for EntityType {
    type Err = ParseEntityTypeError;

    fn from_str(entity_type_str: &str) -> Result<Self, Self::Err> {
        let property_type_repr: repr::EntityType = serde_json::from_str(entity_type_str)
            .map_err(|err| ParseEntityTypeError::InvalidJson(err.to_string()))?;

        Self::try_from(property_type_repr)
    }
}

impl TryFrom<serde_json::Value> for EntityType {
    type Error = ParseEntityTypeError;

    fn try_from(value: serde_json::Value) -> Result<Self, Self::Error> {
        let entity_type_repr: repr::EntityType = serde_json::from_value(value)
            .map_err(|err| ParseEntityTypeError::InvalidJson(err.to_string()))?;

        Self::try_from(entity_type_repr)
    }
}

impl From<EntityType> for serde_json::Value {
    fn from(property_type: EntityType) -> Self {
        let entity_type_repr: repr::EntityType = property_type.into();

        serde_json::to_value(entity_type_repr).expect("Failed to deserialize Entity Type repr")
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct EntityTypeReference {
    uri: VersionedUri,
}

impl EntityTypeReference {
    /// Creates a new `EntityTypeReference` from the given [`VersionedUri`].
    #[must_use]
    pub const fn new(uri: VersionedUri) -> Self {
        Self { uri }
    }

    #[must_use]
    pub const fn uri(&self) -> &VersionedUri {
        &self.uri
    }
}

impl ValidateUri for EntityTypeReference {
    fn validate_uri(&self, base_uri: &BaseUri) -> Result<(), ValidationError> {
        if base_uri == self.uri().base_uri() {
            Ok(())
        } else {
            Err(ValidationError::BaseUriMismatch {
                base_uri: base_uri.clone(),
                versioned_uri: self.uri().clone(),
            })
        }
    }
}

impl TryFrom<serde_json::Value> for EntityTypeReference {
    type Error = ParseVersionedUriError;

    fn try_from(value: serde_json::Value) -> Result<Self, Self::Error> {
        let entity_type_ref_repr: repr::EntityTypeReference = serde_json::from_value(value)
            .map_err(|err| ParseVersionedUriError::InvalidJson(err.to_string()))?;

        Self::try_from(entity_type_ref_repr)
    }
}

impl From<EntityTypeReference> for serde_json::Value {
    fn from(entity_type_ref: EntityTypeReference) -> Self {
        let entity_type_ref_repr: repr::EntityTypeReference = entity_type_ref.into();

        serde_json::to_value(entity_type_ref_repr)
            .expect("Failed to deserialize Entity Type Reference repr")
    }
}

// #[cfg(test)]
// mod tests {
//     use std::str::FromStr;
//
//     use type_system::PropertyTypeReference;
//
//     use super::*;
//     use crate::PropertyTypeReference;
//
//     fn test_entity_type_schema(schema: &serde_json::Value) -> EntityType {
//         let entity_type: EntityType =
//             serde_json::from_value(schema.clone()).expect("invalid schema");
//         assert_eq!(
//             serde_json::to_value(entity_type.clone()).expect("could not serialize"),
//             *schema,
//             "{entity_type:#?}"
//         );
//         entity_type
//     }
//
//     fn test_property_type_references(
//         entity_type: &EntityType,
//         uris: impl IntoIterator<Item = &'static str>,
//     ) {
//         let expected_property_type_references = uris
//             .into_iter()
//             .map(|uri| VersionedUri::from_str(uri).expect("invalid URI"))
//             .collect::<HashSet<_>>();
//
//         let property_type_references = entity_type
//             .property_type_references()
//             .into_iter()
//             .map(PropertyTypeReference::uri)
//             .cloned()
//             .collect::<HashSet<_>>();
//
//         assert_eq!(property_type_references, expected_property_type_references);
//     }
//
//     fn test_link_type_references(
//         entity_type: &EntityType,
//         links: impl IntoIterator<Item = (&'static str, &'static str)>,
//     ) {
//         let expected_link_type_references = links
//             .into_iter()
//             .map(|(link_type_uri, entity_type_uri)| {
//                 (
//                     VersionedUri::from_str(link_type_uri).expect("invalid URI"),
//                     VersionedUri::from_str(entity_type_uri).expect("invalid URI"),
//                 )
//             })
//             .collect::<HashMap<_, _>>();
//
//         let link_type_references = entity_type
//             .link_type_references()
//             .into_iter()
//             .map(|(link_type_uri, entity_type_ref)| {
//                 (link_type_uri.clone(), entity_type_ref.uri().clone())
//             })
//             .collect::<HashMap<_, _>>();
//
//         assert_eq!(link_type_references, expected_link_type_references);
//     }
//
//     #[test]
//     fn book() {
//         let entity_type = test_entity_type_schema(
//             &serde_json::from_str(crate::test_data::entity_type::BOOK_V1).expect("invalid JSON"),
//         );
//
//         test_property_type_references(&entity_type, [
//             "https://blockprotocol.org/@alice/types/property-type/name/v/1",
//             "https://blockprotocol.org/@alice/types/property-type/blurb/v/1",
//             "https://blockprotocol.org/@alice/types/property-type/published-on/v/1",
//         ]);
//
//         test_link_type_references(&entity_type, [(
//             "https://blockprotocol.org/@alice/types/link-type/written-by/v/1",
//             "https://blockprotocol.org/@alice/types/entity-type/person/v/1",
//         )]);
//     }
//
//     #[test]
//     fn address() {
//         let entity_type = test_entity_type_schema(
//             &serde_json::from_str(crate::test_data::entity_type::ADDRESS_V1).expect("invalid
// JSON"),         );
//
//         test_property_type_references(&entity_type, [
//             "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1",
//             "https://blockprotocol.org/@alice/types/property-type/postcode/v/1",
//             "https://blockprotocol.org/@alice/types/property-type/city/v/1",
//         ]);
//
//         test_link_type_references(&entity_type, []);
//     }
//
//     #[test]
//     fn organization() {
//         let entity_type = test_entity_type_schema(
//             &serde_json::from_str(crate::test_data::entity_type::ORGANIZATION_V1)
//                 .expect("invalid JSON"),
//         );
//
//         test_property_type_references(&entity_type, [
//             "https://blockprotocol.org/@alice/types/property-type/name/v/1",
//         ]);
//
//         test_link_type_references(&entity_type, []);
//     }
//
//     #[test]
//     fn building() {
//         let entity_type = test_entity_type_schema(
//             &serde_json::from_str(crate::test_data::entity_type::BUILDING_V1)
//                 .expect("invalid JSON"),
//         );
//
//         test_property_type_references(&entity_type, []);
//
//         test_link_type_references(&entity_type, [
//             (
//                 "https://blockprotocol.org/@alice/types/link-type/located-at/v/1",
//                 "https://blockprotocol.org/@alice/types/entity-type/uk-address/v/1",
//             ),
//             (
//                 "https://blockprotocol.org/@alice/types/link-type/tenant/v/1",
//                 "https://blockprotocol.org/@alice/types/entity-type/person/v/1",
//             ),
//         ]);
//     }
//
//     #[test]
//     fn person() {
//         let entity_type = test_entity_type_schema(
//             &serde_json::from_str(crate::test_data::entity_type::PERSON_V1).expect("invalid
// JSON"),         );
//
//         test_property_type_references(&entity_type, [
//             "https://blockprotocol.org/@alice/types/property-type/name/v/1",
//         ]);
//
//         test_link_type_references(&entity_type, [(
//             "https://blockprotocol.org/@alice/types/link-type/friend-of/v/1",
//             "https://blockprotocol.org/@alice/types/entity-type/person/v/1",
//         )]);
//     }
//
//     #[test]
//     fn playlist() {
//         let entity_type = test_entity_type_schema(
//             &serde_json::from_str(crate::test_data::entity_type::PLAYLIST_V1)
//                 .expect("invalid JSON"),
//         );
//
//         test_property_type_references(&entity_type, [
//             "https://blockprotocol.org/@alice/types/property-type/name/v/1",
//         ]);
//
//         test_link_type_references(&entity_type, [(
//             "https://blockprotocol.org/@alice/types/link-type/contains/v/1",
//             "https://blockprotocol.org/@alice/types/entity-type/song/v/1",
//         )]);
//     }
//
//     #[test]
//     fn song() {
//         let entity_type = test_entity_type_schema(
//             &serde_json::from_str(crate::test_data::entity_type::SONG_V1).expect("invalid JSON"),
//         );
//
//         test_property_type_references(&entity_type, [
//             "https://blockprotocol.org/@alice/types/property-type/name/v/1",
//         ]);
//
//         test_link_type_references(&entity_type, []);
//     }
//
//     #[test]
//     fn page() {
//         let entity_type = test_entity_type_schema(
//             &serde_json::from_str(crate::test_data::entity_type::PAGE_V2).expect("invalid JSON"),
//         );
//
//         test_property_type_references(&entity_type, [
//             "https://blockprotocol.org/@alice/types/property-type/text/v/1",
//         ]);
//
//         test_link_type_references(&entity_type, [
//             (
//                 "https://blockprotocol.org/@alice/types/link-type/written-by/v/1",
//                 "https://blockprotocol.org/@alice/types/entity-type/person/v/1",
//             ),
//             (
//                 "https://blockprotocol.org/@alice/types/link-type/contains/v/1",
//                 "https://hash.ai/@hash/types/entity-type/block/v/1",
//             ),
//         ]);
//     }
// }
