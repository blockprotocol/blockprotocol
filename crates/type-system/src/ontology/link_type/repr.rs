use std::str::FromStr;

use serde::{Deserialize, Serialize};
#[cfg(target_arch = "wasm32")]
use {tsify::Tsify, wasm_bindgen::prelude::*};

use crate::{uri::VersionedUri, ParseLinkTypeError};

/// Will serialize as a constant value `"linkType"`
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
enum LinkTypeTag {
    LinkType,
}

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LinkType {
    #[cfg_attr(target_arch = "wasm32", tsify(type = "'linkType'"))]
    kind: LinkTypeTag,
    #[serde(rename = "$id")]
    id: String,
    title: String,
    plural_title: String,
    description: String,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    related_keywords: Vec<String>,
}

impl TryFrom<LinkType> for super::LinkType {
    type Error = ParseLinkTypeError;

    fn try_from(link_type_repr: LinkType) -> Result<Self, Self::Error> {
        let id = VersionedUri::from_str(&link_type_repr.id)
            .map_err(ParseLinkTypeError::InvalidVersionedUri)?;

        Ok(Self::new(
            id,
            link_type_repr.title,
            link_type_repr.plural_title,
            link_type_repr.description,
            link_type_repr.related_keywords,
        ))
    }
}

impl From<super::LinkType> for LinkType {
    fn from(link_type: super::LinkType) -> Self {
        Self {
            kind: LinkTypeTag::LinkType,
            id: link_type.id.to_string(),
            title: link_type.title,
            plural_title: link_type.plural_title,
            description: link_type.description,
            related_keywords: link_type.related_keywords,
        }
    }
}
