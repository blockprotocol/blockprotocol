use std::str::FromStr;

use serde::{Deserialize, Serialize};

use crate::{uri::VersionedUri, ParseLinkTypeError};

/// Will serialize as a constant value `"linkType"`
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
enum LinkTypeTag {
    LinkType,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LinkType {
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

// #[cfg(test)]
// mod tests {
//     use super::*;
//
//     fn test_link_type_schema(schema: &serde_json::Value) -> LinkType {
//         let link_type: LinkType = serde_json::from_value(schema.clone()).expect("invalid
// schema");         assert_eq!(
//             serde_json::to_value(link_type.clone()).expect("could not serialize"),
//             *schema,
//             "{link_type:#?}"
//         );
//         link_type
//     }
//
//     #[test]
//     fn owns() {
//         test_link_type_schema(
//             &serde_json::from_str(crate::test_data::link_type::OWNS_V2).expect("invalid JSON"),
//         );
//     }
//
//     #[test]
//     fn submitted_by() {
//         test_link_type_schema(
//             &serde_json::from_str(crate::test_data::link_type::SUBMITTED_BY_V1)
//                 .expect("invalid JSON"),
//         );
//     }
// }
