use std::{
    error::Error,
    fmt,
    fmt::{Display, Formatter},
};

use serde::{Deserialize, Serialize};
#[cfg(target_arch = "wasm32")]
use tsify::Tsify;

use crate::uri::{BaseUri, VersionedUri};

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "type", content = "inner")]
pub enum ValidationError {
    /// A schema has marked a property with a [`BaseUri`] as required but the [`BaseUri`] does not
    /// exist in the `properties`.
    MissingRequiredProperty(BaseUri),
    /// When associating a property name with a reference to a Type, we expect the name to match
    /// the [`VersionedUri::base_uri`] inside the reference.
    BaseUriMismatch {
        base_uri: BaseUri,
        versioned_uri: VersionedUri,
    },
    /// A schema has marked a link as required but the link does not exist in the schema.
    MissingRequiredRelationship(VersionedUri),
    /// At least `expected` number of properties are required, but only `actual` were provided.
    MismatchedPropertyCount { actual: usize, expected: usize },
    /// `oneOf` requires at least one element.
    EmptyOneOf,
}

impl Display for ValidationError {
    fn fmt(&self, fmt: &mut Formatter) -> fmt::Result {
        match self {
            Self::MissingRequiredProperty(uri) => {
                write!(
                    fmt,
                    "the schema has marked the \"{uri}\" property as required, but it wasn't \
                     defined in the `\"properties\"` object"
                )
            }
            Self::BaseUriMismatch {
                base_uri,
                versioned_uri,
            } => {
                write!(
                    fmt,
                    "expected base URI ({base_uri}) differed from the base URI of \
                     ({versioned_uri})"
                )
            }
            Self::MissingRequiredRelationship(link) => {
                write!(
                    fmt,
                    "the schema has marked the \"{link}\" link as required, but it wasn't defined \
                     in the `\"relationships\"` object"
                )
            }
            Self::MismatchedPropertyCount { actual, expected } => {
                write!(
                    fmt,
                    "at least {expected} properties are required, but only {actual} were provided"
                )
            }
            Self::EmptyOneOf => fmt.write_str("`\"one_of\"` must have at least one item"),
        }
    }
}

impl Error for ValidationError {}

pub trait ValidateUri {
    /// TODO: DOC
    ///
    /// # Errors
    fn validate_uri(&self, base_uri: &BaseUri) -> Result<(), ValidationError>;
}
