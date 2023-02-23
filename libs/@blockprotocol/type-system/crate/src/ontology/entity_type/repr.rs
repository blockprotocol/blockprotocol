use std::{collections::HashMap, str::FromStr};

use serde::{Deserialize, Serialize};
#[cfg(target_arch = "wasm32")]
use tsify::Tsify;

use crate::{
    repr,
    url::{BaseUrl, ParseVersionedUrlError, VersionedUrl},
    ParseEntityTypeError,
};

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

impl TryFrom<EntityType> for super::EntityType {
    type Error = ParseEntityTypeError;

    fn try_from(entity_type_repr: EntityType) -> Result<Self, Self::Error> {
        let id = VersionedUrl::from_str(&entity_type_repr.id)
            .map_err(ParseEntityTypeError::InvalidVersionedUrl)?;

        // TODO - validate examples against the entity type
        let examples = entity_type_repr
            .examples
            .into_iter()
            .map(|example_hash_map| {
                example_hash_map
                    .into_iter()
                    .map(|(uri, val)| {
                        Ok((
                            BaseUrl::new(uri).map_err(ParseEntityTypeError::InvalidExamplesKey)?,
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
                    .map(|(uri, val)| (uri.to_string(), val))
                    .collect()
            })
            .collect();

        Self {
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
    uri: String,
}

impl TryFrom<EntityTypeReference> for super::EntityTypeReference {
    type Error = ParseVersionedUrlError;

    fn try_from(entity_type_ref_repr: EntityTypeReference) -> Result<Self, Self::Error> {
        let uri = VersionedUrl::from_str(&entity_type_ref_repr.uri)?;
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
