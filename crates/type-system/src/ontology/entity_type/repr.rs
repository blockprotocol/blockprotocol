use std::{collections::HashMap, str::FromStr};

use serde::{Deserialize, Serialize};

use crate::{
    repr,
    uri::{ParseVersionedUriError, VersionedUri},
    ParseEntityTypeError,
};

/// Will serialize as a constant value `"entityType"`
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
enum EntityTypeTag {
    EntityType,
}

/// Intermediate representation used during deserialization.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct EntityType {
    kind: EntityTypeTag,
    #[serde(rename = "$id")]
    id: String,
    title: String,
    plural_title: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    description: Option<String>,
    #[serde(default, skip_serializing_if = "HashMap::is_empty")]
    default: HashMap<String, serde_json::Value>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    examples: Vec<HashMap<String, serde_json::Value>>,
    #[serde(flatten)]
    property_object: repr::Object<repr::ValueOrArray<repr::PropertyTypeReference>>,
    #[serde(flatten)]
    links: repr::Links,
}

impl TryFrom<EntityType> for super::EntityType {
    type Error = ParseEntityTypeError;

    fn try_from(entity_type_repr: EntityType) -> Result<Self, Self::Error> {
        let id = VersionedUri::from_str(&entity_type_repr.id)
            .map_err(ParseEntityTypeError::InvalidVersionedUri)?;

        let default = entity_type_repr
            .default
            .into_iter()
            .map(|(uri, val)| {
                Ok((
                    VersionedUri::from_str(&uri)
                        .map_err(ParseEntityTypeError::InvalidDefaultKey)?,
                    val,
                ))
            })
            .collect::<Result<_, _>>()?;

        let examples = entity_type_repr
            .examples
            .into_iter()
            .map(|example_hash_map| {
                example_hash_map
                    .into_iter()
                    .map(|(uri, val)| {
                        Ok((
                            VersionedUri::from_str(&uri)
                                .map_err(ParseEntityTypeError::InvalidDefaultKey)?,
                            val,
                        ))
                    })
                    .collect()
            })
            .collect::<Result<_, _>>()?;

        let property_object = entity_type_repr
            .property_object
            .try_into()
            .map_err(ParseEntityTypeError::InvalidPropertyTypeObject)?;
        let links = entity_type_repr.links.try_into().map_err(|_| todo!())?;

        Ok(Self::new(
            id,
            entity_type_repr.title,
            entity_type_repr.plural_title,
            entity_type_repr.description,
            default,
            examples,
            property_object,
            links,
        ))
    }
}

impl From<super::EntityType> for EntityType {
    fn from(entity_type: super::EntityType) -> Self {
        let default = entity_type
            .default
            .into_iter()
            .map(|(uri, val)| (uri.to_string(), val))
            .collect();

        let examples = entity_type
            .examples
            .into_iter()
            .map(|example_hash_map| {
                example_hash_map
                    .into_iter()
                    .map(|(uri, val)| (uri.to_string(), val))
                    .collect()
            })
            .collect();

        Self {
            kind: EntityTypeTag::EntityType,
            id: entity_type.id.to_string(),
            title: entity_type.title,
            plural_title: entity_type.plural_title,
            description: entity_type.description,
            default,
            examples,
            property_object: entity_type.property_object.into(),
            links: entity_type.links.into(),
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct EntityTypeReference {
    #[serde(rename = "$ref")]
    uri: String,
}

impl TryFrom<EntityTypeReference> for super::EntityTypeReference {
    type Error = ParseVersionedUriError;

    fn try_from(entity_type_ref_repr: EntityTypeReference) -> Result<Self, Self::Error> {
        let uri = VersionedUri::from_str(&entity_type_ref_repr.uri)?;
        Ok(Self::new(uri))
    }
}

impl From<super::EntityTypeReference> for EntityTypeReference {
    fn from(entity_type_ref: super::EntityTypeReference) -> Self {
        Self {
            uri: entity_type_ref.uri.to_string(),
        }
    }
}

// #[cfg(test)]
// mod tests {
//     use super::*;
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
