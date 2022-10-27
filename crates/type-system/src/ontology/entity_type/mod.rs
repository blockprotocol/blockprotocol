mod error;
pub(in crate::ontology) mod relationships;
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
    AllOf, Object, OneOf, PropertyTypeReference, Relationships, ValidateUri, ValidationError,
    ValueOrArray, ValueOrMaybeOrderedArray,
};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct EntityType {
    id: VersionedUri,
    title: String,
    plural_title: String,
    description: Option<String>,
    property_object: Object<ValueOrArray<PropertyTypeReference>>,
    inherits_from: AllOf<EntityTypeReference>,
    relationships: Relationships,
    default: HashMap<BaseUri, serde_json::Value>,
    examples: Vec<HashMap<BaseUri, serde_json::Value>>,
}

impl EntityType {
    /// Creates a new `EntityType`
    #[must_use]
    #[expect(clippy::too_many_arguments)]
    pub fn new(
        id: VersionedUri,
        title: String,
        plural_title: String,
        description: Option<String>,
        property_object: Object<ValueOrArray<PropertyTypeReference>>,
        inherits_from: AllOf<EntityTypeReference>,
        relationships: Relationships,
        default: HashMap<BaseUri, serde_json::Value>,
        examples: Vec<HashMap<BaseUri, serde_json::Value>>,
    ) -> Self {
        Self {
            id,
            title,
            plural_title,
            description,
            property_object,
            inherits_from,
            relationships,
            default,
            examples,
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
    pub fn plural_title(&self) -> &str {
        &self.plural_title
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
    pub const fn properties(&self) -> &HashMap<BaseUri, ValueOrArray<PropertyTypeReference>> {
        self.property_object.properties()
    }

    #[must_use]
    pub fn required(&self) -> &[BaseUri] {
        self.property_object.required()
    }

    #[must_use]
    pub const fn relationships(
        &self,
    ) -> &HashMap<VersionedUri, ValueOrMaybeOrderedArray<OneOf<EntityTypeReference>>> {
        self.relationships.relationships()
    }

    #[must_use]
    pub fn required_relationships(&self) -> &[VersionedUri] {
        self.relationships.required()
    }

    #[must_use]
    pub const fn default(&self) -> &HashMap<BaseUri, serde_json::Value> {
        &self.default
    }

    #[must_use]
    pub const fn examples(&self) -> &Vec<HashMap<BaseUri, serde_json::Value>> {
        &self.examples
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
    pub fn link_type_references(&self) -> HashMap<&VersionedUri, &[EntityTypeReference]> {
        self.relationships()
            .iter()
            .map(|(link_type, entity_type)| (link_type, entity_type.inner().one_of()))
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

#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use super::*;
    use crate::{test_data, utils::tests::check_serialization_from_str};

    fn test_property_type_references(
        entity_type: &EntityType,
        uris: impl IntoIterator<Item = &'static str>,
    ) {
        let expected_property_type_references = uris
            .into_iter()
            .map(|uri| VersionedUri::from_str(uri).expect("invalid URI"))
            .collect::<HashSet<_>>();

        let property_type_references = entity_type
            .property_type_references()
            .into_iter()
            .map(PropertyTypeReference::uri)
            .cloned()
            .collect::<HashSet<_>>();

        assert_eq!(property_type_references, expected_property_type_references);
    }

    fn test_link_type_references(
        entity_type: &EntityType,
        relationships: impl IntoIterator<Item = (&'static str, &'static str)>,
    ) {
        let expected_link_type_references = relationships
            .into_iter()
            .map(|(link_type_uri, entity_type_uri)| {
                (
                    VersionedUri::from_str(link_type_uri).expect("invalid URI"),
                    vec![VersionedUri::from_str(entity_type_uri).expect("invalid URI")],
                )
            })
            .collect::<HashMap<_, _>>();

        let link_type_references = entity_type
            .link_type_references()
            .into_iter()
            .map(|(link_type_uri, entity_type_ref)| {
                (
                    link_type_uri.clone(),
                    entity_type_ref
                        .iter()
                        .map(|reference| reference.uri().clone())
                        .collect(),
                )
            })
            .collect::<HashMap<_, _>>();

        assert_eq!(link_type_references, expected_link_type_references);
    }

    #[test]
    fn book() {
        let entity_type = check_serialization_from_str(test_data::entity_type::BOOK_V1, None);

        test_property_type_references(&entity_type, [
            "https://blockprotocol.org/@alice/types/property-type/name/v/1",
            "https://blockprotocol.org/@alice/types/property-type/blurb/v/1",
            "https://blockprotocol.org/@alice/types/property-type/published-on/v/1",
        ]);

        test_link_type_references(&entity_type, [(
            "https://blockprotocol.org/@alice/types/link-type/written-by/v/1",
            "https://blockprotocol.org/@alice/types/entity-type/person/v/1",
        )]);
    }

    #[test]
    fn address() {
        let entity_type = check_serialization_from_str(test_data::entity_type::ADDRESS_V1, None);

        test_property_type_references(&entity_type, [
            "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1",
            "https://blockprotocol.org/@alice/types/property-type/postcode/v/1",
            "https://blockprotocol.org/@alice/types/property-type/city/v/1",
        ]);

        test_link_type_references(&entity_type, []);
    }

    #[test]
    fn organization() {
        let entity_type =
            check_serialization_from_str(test_data::entity_type::ORGANIZATION_V1, None);

        test_property_type_references(&entity_type, [
            "https://blockprotocol.org/@alice/types/property-type/name/v/1",
        ]);

        test_link_type_references(&entity_type, []);
    }

    #[test]
    fn building() {
        let entity_type = check_serialization_from_str(test_data::entity_type::BUILDING_V1, None);

        test_property_type_references(&entity_type, []);

        test_link_type_references(&entity_type, [
            (
                "https://blockprotocol.org/@alice/types/link-type/located-at/v/1",
                "https://blockprotocol.org/@alice/types/entity-type/uk-address/v/1",
            ),
            (
                "https://blockprotocol.org/@alice/types/link-type/tenant/v/1",
                "https://blockprotocol.org/@alice/types/entity-type/person/v/1",
            ),
        ]);
    }

    #[test]
    fn person() {
        let entity_type = check_serialization_from_str(test_data::entity_type::PERSON_V1, None);

        test_property_type_references(&entity_type, [
            "https://blockprotocol.org/@alice/types/property-type/name/v/1",
        ]);

        test_link_type_references(&entity_type, [(
            "https://blockprotocol.org/@alice/types/link-type/friend-of/v/1",
            "https://blockprotocol.org/@alice/types/entity-type/person/v/1",
        )]);
    }

    #[test]
    fn playlist() {
        let entity_type = check_serialization_from_str(test_data::entity_type::PLAYLIST_V1, None);

        test_property_type_references(&entity_type, [
            "https://blockprotocol.org/@alice/types/property-type/name/v/1",
        ]);

        test_link_type_references(&entity_type, [(
            "https://blockprotocol.org/@alice/types/link-type/contains/v/1",
            "https://blockprotocol.org/@alice/types/entity-type/song/v/1",
        )]);
    }

    #[test]
    fn song() {
        let entity_type = check_serialization_from_str(test_data::entity_type::SONG_V1, None);

        test_property_type_references(&entity_type, [
            "https://blockprotocol.org/@alice/types/property-type/name/v/1",
        ]);

        test_link_type_references(&entity_type, []);
    }

    #[test]
    fn page() {
        let entity_type = check_serialization_from_str(test_data::entity_type::PAGE, None);

        test_property_type_references(&entity_type, [
            "https://blockprotocol.org/@alice/types/property-type/text/v/1",
        ]);

        test_link_type_references(&entity_type, [
            (
                "https://blockprotocol.org/@alice/types/link-type/written-by/v/1",
                "https://blockprotocol.org/@alice/types/entity-type/person/v/1",
            ),
            (
                "https://blockprotocol.org/@alice/types/link-type/contains/v/1",
                "https://blockprotocol.org/@alice/types/entity-type/block/v/1",
            ),
        ]);
    }
}
