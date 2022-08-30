use std::str::FromStr;

use crate::uri::VersionedUri;

mod error;
pub(in crate::ontology) mod repr;
#[cfg(target_arch = "wasm32")]
mod wasm;

pub use error::ParseLinkTypeError;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct LinkType {
    id: VersionedUri,
    title: String,
    description: String,
    related_keywords: Vec<String>,
}

impl LinkType {
    /// Creates a new `LinkType`.
    #[must_use]
    pub const fn new(
        id: VersionedUri,
        title: String,
        description: String,
        related_keywords: Vec<String>,
    ) -> Self {
        Self {
            id,
            title,
            description,
            related_keywords,
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
    pub fn description(&self) -> &str {
        &self.description
    }

    #[must_use]
    pub fn related_keywords(&self) -> &[String] {
        &self.related_keywords
    }
}

impl FromStr for LinkType {
    type Err = ParseLinkTypeError;

    fn from_str(link_type_str: &str) -> Result<Self, Self::Err> {
        let link_type_repr: repr::LinkType = serde_json::from_str(link_type_str)
            .map_err(|err| ParseLinkTypeError::InvalidJson(err.to_string()))?;

        Self::try_from(link_type_repr)
    }
}

impl TryFrom<serde_json::Value> for LinkType {
    type Error = ParseLinkTypeError;

    fn try_from(value: serde_json::Value) -> Result<Self, Self::Error> {
        let link_type_repr: repr::LinkType = serde_json::from_value(value)
            .map_err(|err| ParseLinkTypeError::InvalidJson(err.to_string()))?;

        Self::try_from(link_type_repr)
    }
}

impl From<LinkType> for serde_json::Value {
    fn from(link_type: LinkType) -> Self {
        let link_type_repr: repr::LinkType = link_type.into();

        serde_json::to_value(link_type_repr).expect("Failed to deserialize Link Type repr")
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
