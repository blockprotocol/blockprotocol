use std::{collections::HashMap, str::FromStr};

use serde::{Deserialize, Serialize};
#[cfg(target_arch = "wasm32")]
use tsify::Tsify;

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

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct EntityType {
    #[cfg_attr(target_arch = "wasm32", tsify(type = "'entityType'"))]
    kind: EntityTypeTag,
    #[serde(rename = "$id")]
    id: String,
    title: String,
    plural_title: String,
    #[cfg_attr(target_arch = "wasm32", tsify(optional))]
    #[serde(skip_serializing_if = "Option::is_none")]
    description: Option<String>,
    // TODO - Improve the typing of the values
    #[cfg_attr(target_arch = "wasm32", tsify(type = "Record<VersionedUri, any>"))]
    #[serde(default, skip_serializing_if = "HashMap::is_empty")]
    default: HashMap<String, serde_json::Value>,
    #[cfg_attr(target_arch = "wasm32", tsify(type = "Record<VersionedUri, any>"))]
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

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
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
