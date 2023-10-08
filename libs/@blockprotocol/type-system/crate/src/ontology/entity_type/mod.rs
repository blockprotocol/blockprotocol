mod error;
pub(in crate::ontology) mod links;
pub(in crate::ontology) mod raw;
#[cfg(target_arch = "wasm32")]
mod wasm;

use std::collections::{HashMap, HashSet};

pub use error::ParseEntityTypeError;

use crate::{
    url::{BaseUrl, VersionedUrl},
    AllOf, Links, MaybeOrderedArray, Object, OneOf, PropertyTypeReference, ValidateUrl,
    ValidationError, ValueOrArray,
};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct EntityType {
    id: VersionedUrl,
    title: String,
    description: Option<String>,
    property_object: Object<ValueOrArray<PropertyTypeReference>>,
    inherits_from: AllOf<EntityTypeReference>,
    links: Links,
    examples: Vec<HashMap<BaseUrl, serde_json::Value>>,
}

impl EntityType {
    /// Creates a new `EntityType`
    #[must_use]
    pub fn new(
        id: VersionedUrl,
        title: String,
        description: Option<String>,
        property_object: Object<ValueOrArray<PropertyTypeReference>>,
        inherits_from: AllOf<EntityTypeReference>,
        links: Links,
        examples: Vec<HashMap<BaseUrl, serde_json::Value>>,
    ) -> Self {
        Self {
            id,
            title,
            description,
            property_object,
            inherits_from,
            links,
            examples,
        }
    }

    #[must_use]
    pub const fn id(&self) -> &VersionedUrl {
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
    pub const fn inherits_from(&self) -> &AllOf<EntityTypeReference> {
        &self.inherits_from
    }

    #[must_use]
    pub const fn properties(&self) -> &HashMap<BaseUrl, ValueOrArray<PropertyTypeReference>> {
        self.property_object.properties()
    }

    #[must_use]
    pub fn required(&self) -> &[BaseUrl] {
        self.property_object.required()
    }

    #[must_use]
    pub const fn links(
        &self,
    ) -> &HashMap<VersionedUrl, MaybeOrderedArray<Option<OneOf<EntityTypeReference>>>> {
        self.links.links()
    }

    #[must_use]
    pub const fn examples(&self) -> &Vec<HashMap<BaseUrl, serde_json::Value>> {
        &self.examples
    }

    #[must_use]
    pub fn property_type_references(&self) -> HashSet<&PropertyTypeReference> {
        self.properties()
            .iter()
            .map(|(_, property_def)| match property_def {
                ValueOrArray::Value(url) => url,
                ValueOrArray::Array(array) => array.items(),
            })
            .collect()
    }

    #[must_use]
    pub fn link_mappings(&self) -> HashMap<&EntityTypeReference, Option<&[EntityTypeReference]>> {
        self.links()
            .iter()
            .map(|(link_entity_type, destination_constraint_entity_types)| {
                (
                    <&EntityTypeReference>::from(link_entity_type),
                    destination_constraint_entity_types
                        .array()
                        .items()
                        .as_ref()
                        .map(OneOf::one_of),
                )
            })
            .collect()
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
#[repr(transparent)]
pub struct EntityTypeReference {
    url: VersionedUrl,
}

impl EntityTypeReference {
    /// Creates a new `EntityTypeReference` from the given [`VersionedUrl`].
    #[must_use]
    pub const fn new(url: VersionedUrl) -> Self {
        Self { url }
    }

    #[must_use]
    pub const fn url(&self) -> &VersionedUrl {
        &self.url
    }
}

impl From<&VersionedUrl> for &EntityTypeReference {
    fn from(url: &VersionedUrl) -> Self {
        // SAFETY: Self is `repr(transparent)`
        unsafe { &*(url as *const VersionedUrl).cast::<EntityTypeReference>() }
    }
}

impl ValidateUrl for EntityTypeReference {
    fn validate_url(&self, base_url: &BaseUrl) -> Result<(), ValidationError> {
        if base_url == &self.url().base_url {
            Ok(())
        } else {
            Err(ValidationError::BaseUrlMismatch {
                base_url: base_url.clone(),
                versioned_url: self.url().clone(),
            })
        }
    }
}

#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use super::*;
    use crate::{test_data, utils::tests::check_serialization_from_str};

    fn test_property_type_references(
        entity_type: &EntityType,
        urls: impl IntoIterator<Item = &'static str>,
    ) {
        let expected_property_type_references = urls
            .into_iter()
            .map(|url| VersionedUrl::from_str(url).expect("invalid URL"))
            .collect::<HashSet<_>>();

        let property_type_references = entity_type
            .property_type_references()
            .into_iter()
            .map(PropertyTypeReference::url)
            .cloned()
            .collect::<HashSet<_>>();

        assert_eq!(property_type_references, expected_property_type_references);
    }

    fn test_link_mappings(
        entity_type: &EntityType,
        links: impl IntoIterator<Item = (&'static str, Vec<&'static str>)>,
    ) {
        let expected_link_entity_type_references = links
            .into_iter()
            .map(|(link_entity_type_url, entity_type_urls)| {
                (
                    VersionedUrl::from_str(link_entity_type_url).expect("invalid URL"),
                    entity_type_urls
                        .into_iter()
                        .map(|entity_type_url| {
                            VersionedUrl::from_str(entity_type_url).expect("invalid URL")
                        })
                        .collect::<Vec<_>>(),
                )
            })
            .collect::<HashMap<_, _>>();

        let link_entity_type_references = entity_type
            .link_mappings()
            .into_iter()
            .map(|(link_entity_type_url, entity_type_ref)| {
                (
                    link_entity_type_url.url().clone(),
                    entity_type_ref.map_or(vec![], |inner| {
                        inner
                            .iter()
                            .map(|reference| reference.url().clone())
                            .collect()
                    }),
                )
            })
            .collect::<HashMap<_, _>>();

        assert_eq!(
            link_entity_type_references,
            expected_link_entity_type_references
        );
    }

    #[test]
    fn book() {
        let entity_type = check_serialization_from_str::<EntityType, raw::EntityType>(
            test_data::entity_type::BOOK_V1,
            None,
        );

        test_property_type_references(&entity_type, [
            "https://blockprotocol.org/@alice/types/property-type/name/v/1",
            "https://blockprotocol.org/@alice/types/property-type/blurb/v/1",
            "https://blockprotocol.org/@alice/types/property-type/published-on/v/1",
        ]);

        test_link_mappings(&entity_type, [(
            "https://blockprotocol.org/@alice/types/entity-type/written-by/v/1",
            vec!["https://blockprotocol.org/@alice/types/entity-type/person/v/1"],
        )]);
    }

    #[test]
    fn address() {
        let entity_type = check_serialization_from_str::<EntityType, raw::EntityType>(
            test_data::entity_type::ADDRESS_V1,
            None,
        );

        test_property_type_references(&entity_type, [
            "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1",
            "https://blockprotocol.org/@alice/types/property-type/postcode/v/1",
            "https://blockprotocol.org/@alice/types/property-type/city/v/1",
        ]);

        test_link_mappings(&entity_type, []);
    }

    #[test]
    fn organization() {
        let entity_type = check_serialization_from_str::<EntityType, raw::EntityType>(
            test_data::entity_type::ORGANIZATION_V1,
            None,
        );

        test_property_type_references(&entity_type, [
            "https://blockprotocol.org/@alice/types/property-type/name/v/1",
        ]);

        test_link_mappings(&entity_type, []);
    }

    #[test]
    fn building() {
        let entity_type = check_serialization_from_str::<EntityType, raw::EntityType>(
            test_data::entity_type::BUILDING_V1,
            None,
        );

        test_property_type_references(&entity_type, []);

        test_link_mappings(&entity_type, [
            (
                "https://blockprotocol.org/@alice/types/entity-type/located-at/v/1",
                vec!["https://blockprotocol.org/@alice/types/entity-type/uk-address/v/1"],
            ),
            (
                "https://blockprotocol.org/@alice/types/entity-type/tenant/v/1",
                vec!["https://blockprotocol.org/@alice/types/entity-type/person/v/1"],
            ),
        ]);
    }

    #[test]
    fn person() {
        let entity_type = check_serialization_from_str::<EntityType, raw::EntityType>(
            test_data::entity_type::PERSON_V1,
            None,
        );

        test_property_type_references(&entity_type, [
            "https://blockprotocol.org/@alice/types/property-type/name/v/1",
        ]);

        test_link_mappings(&entity_type, [
            (
                "https://blockprotocol.org/@alice/types/entity-type/friend-of/v/1",
                vec!["https://blockprotocol.org/@alice/types/entity-type/person/v/1"],
            ),
            (
                "https://blockprotocol.org/@alice/types/entity-type/owns/v/1",
                vec![],
            ),
        ]);
    }

    #[test]
    fn playlist() {
        let entity_type = check_serialization_from_str::<EntityType, raw::EntityType>(
            test_data::entity_type::PLAYLIST_V1,
            None,
        );

        test_property_type_references(&entity_type, [
            "https://blockprotocol.org/@alice/types/property-type/name/v/1",
        ]);

        test_link_mappings(&entity_type, [(
            "https://blockprotocol.org/@alice/types/entity-type/contains/v/1",
            vec!["https://blockprotocol.org/@alice/types/entity-type/song/v/1"],
        )]);
    }

    #[test]
    fn song() {
        let entity_type = check_serialization_from_str::<EntityType, raw::EntityType>(
            test_data::entity_type::SONG_V1,
            None,
        );

        test_property_type_references(&entity_type, [
            "https://blockprotocol.org/@alice/types/property-type/name/v/1",
        ]);

        test_link_mappings(&entity_type, []);
    }

    #[test]
    fn page() {
        let entity_type = check_serialization_from_str::<EntityType, raw::EntityType>(
            test_data::entity_type::PAGE,
            None,
        );

        test_property_type_references(&entity_type, [
            "https://blockprotocol.org/@alice/types/property-type/text/v/1",
        ]);

        test_link_mappings(&entity_type, [
            (
                "https://blockprotocol.org/@alice/types/entity-type/written-by/v/1",
                vec!["https://blockprotocol.org/@alice/types/entity-type/person/v/1"],
            ),
            (
                "https://blockprotocol.org/@alice/types/entity-type/contains/v/1",
                vec!["https://blockprotocol.org/@alice/types/entity-type/block/v/1"],
            ),
        ]);
    }
}
