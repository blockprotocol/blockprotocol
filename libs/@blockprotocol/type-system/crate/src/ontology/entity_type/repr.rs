use std::{
    collections::{HashMap, HashSet},
    str::FromStr,
};

use serde::{Deserialize, Serialize};
#[cfg(target_arch = "wasm32")]
use tsify::Tsify;

use crate::{
    ontology::entity_type::error::MergeEntityTypeError,
    repr,
    url::{BaseUrl, ParseVersionedUrlError, VersionedUrl},
    ParseEntityTypeError,
};

const META_SCHEMA_ID: &str = "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type";

/// Will serialize as a constant value `"entityType"`
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
enum EntityTypeTag {
    EntityType,
}

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct EntityType {
    #[cfg_attr(
        target_arch = "wasm32",
        tsify(type = "'https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type'")
    )]
    #[serde(rename = "$schema")]
    schema: String,
    #[cfg_attr(target_arch = "wasm32", tsify(type = "'entityType'"))]
    kind: EntityTypeTag,
    #[cfg_attr(target_arch = "wasm32", tsify(type = "VersionedUrl"))]
    #[serde(rename = "$id")]
    id: String,
    title: String,
    #[cfg_attr(target_arch = "wasm32", tsify(optional))]
    #[serde(skip_serializing_if = "Option::is_none")]
    description: Option<String>,
    #[serde(flatten)]
    all_of: repr::AllOf<EntityTypeReference>,
    #[cfg_attr(
        target_arch = "wasm32",
        tsify(optional, type = "Record<BaseUrl, any>[]")
    )]
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    examples: Vec<HashMap<String, serde_json::Value>>,
    #[serde(flatten)]
    property_object: repr::Object<repr::ValueOrArray<repr::PropertyTypeReference>>,
    #[serde(flatten)]
    links: repr::Links,
}

impl EntityType {
    /// Merges another entity type into this one.
    ///
    /// This will:
    ///   - remove the other entity type from the `allOf`
    ///   - merge the `properties` and `required` fields
    ///   - merge the `links` field
    ///
    /// # Notes
    ///
    /// - This does not validate the resulting entity type.
    /// - The `required` field may have a different order after merging.
    ///
    /// # Errors
    ///
    /// - [`DoesNotInheritFrom`] if the other entity type is not in the `allOf` field
    ///
    /// [`DoesNotInheritFrom`]: MergeEntityTypeError::DoesNotInheritFrom
    pub fn merge_parent(&mut self, other: Self) -> Result<(), MergeEntityTypeError> {
        self.all_of.elements.remove(
            self.all_of
                .elements
                .iter()
                .position(|x| x.url == other.id)
                .ok_or_else(|| {
                    MergeEntityTypeError::DoesNotInheritFrom(other.id.clone(), self.id.clone())
                })?,
        );

        self.property_object
            .properties
            .extend(other.property_object.properties);

        self.property_object.required = self
            .property_object
            .required
            .drain(..)
            .chain(other.property_object.required)
            .collect::<HashSet<_>>()
            .into_iter()
            .collect();

        self.links.links.extend(other.links.links);

        Ok(())
    }
}

impl TryFrom<EntityType> for super::EntityType {
    type Error = ParseEntityTypeError;

    fn try_from(entity_type_repr: EntityType) -> Result<Self, Self::Error> {
        let id = VersionedUrl::from_str(&entity_type_repr.id)
            .map_err(ParseEntityTypeError::InvalidVersionedUrl)?;

        if entity_type_repr.schema != META_SCHEMA_ID {
            return Err(ParseEntityTypeError::InvalidMetaSchema(
                entity_type_repr.schema,
            ));
        }

        // TODO - validate examples against the entity type
        let examples = entity_type_repr
            .examples
            .into_iter()
            .map(|example_hash_map| {
                example_hash_map
                    .into_iter()
                    .map(|(url, val)| {
                        Ok((
                            BaseUrl::new(url).map_err(ParseEntityTypeError::InvalidExamplesKey)?,
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

        let inherits_from = entity_type_repr
            .all_of
            .try_into()
            .map_err(ParseEntityTypeError::InvalidAllOf)?;

        let links = entity_type_repr
            .links
            .try_into()
            .map_err(ParseEntityTypeError::InvalidLinks)?;

        Ok(Self::new(
            id,
            entity_type_repr.title,
            entity_type_repr.description,
            property_object,
            inherits_from,
            links,
            examples,
        ))
    }
}

impl From<super::EntityType> for EntityType {
    fn from(entity_type: super::EntityType) -> Self {
        let examples = entity_type
            .examples
            .into_iter()
            .map(|example_hash_map| {
                example_hash_map
                    .into_iter()
                    .map(|(url, val)| (url.to_string(), val))
                    .collect()
            })
            .collect();

        Self {
            schema: META_SCHEMA_ID.to_owned(),
            kind: EntityTypeTag::EntityType,
            id: entity_type.id.to_string(),
            title: entity_type.title,
            description: entity_type.description,
            property_object: entity_type.property_object.into(),
            all_of: entity_type.inherits_from.into(),
            examples,
            links: entity_type.links.into(),
        }
    }
}

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct EntityTypeReference {
    #[cfg_attr(target_arch = "wasm32", tsify(type = "VersionedUrl"))]
    #[serde(rename = "$ref")]
    url: String,
}

impl TryFrom<EntityTypeReference> for super::EntityTypeReference {
    type Error = ParseVersionedUrlError;

    fn try_from(entity_type_ref_repr: EntityTypeReference) -> Result<Self, Self::Error> {
        let url = VersionedUrl::from_str(&entity_type_ref_repr.url)?;
        Ok(Self::new(url))
    }
}

impl From<super::EntityTypeReference> for EntityTypeReference {
    fn from(entity_type_ref: super::EntityTypeReference) -> Self {
        Self {
            url: entity_type_ref.url.to_string(),
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::{repr, url::BaseUrl, utils::tests::check_serialization_from_str, EntityType};

    #[test]
    fn merge_entity_type() {
        let building = check_serialization_from_str::<EntityType, repr::EntityType>(
            crate::test_data::entity_type::BUILDING_V1,
            None,
        );
        let church: EntityType = check_serialization_from_str::<EntityType, repr::EntityType>(
            crate::test_data::entity_type::CHURCH_V1,
            None,
        );

        let building_repr = repr::EntityType::from(building);
        let mut church_repr = repr::EntityType::from(church);

        church_repr
            .merge_parent(building_repr)
            .expect("merging entity types failed");

        let church_closure =
            EntityType::try_from(church_repr).expect("entity type closure is not valid");

        assert!(
            church_closure.properties().contains_key(
                &BaseUrl::new(
                    "https://blockprotocol.org/@alice/types/property-type/built-at/".to_owned()
                )
                .expect("invalid url")
            )
        );
        assert!(
            church_closure.properties().contains_key(
                &BaseUrl::new(
                    "https://blockprotocol.org/@alice/types/property-type/number-bells/".to_owned()
                )
                .expect("invalid url")
            )
        );
        assert!(church_closure.inherits_from().all_of().is_empty());
    }
}
