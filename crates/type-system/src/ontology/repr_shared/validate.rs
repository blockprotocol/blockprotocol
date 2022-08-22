use std::{
    error::Error,
    fmt,
    fmt::{Display, Formatter},
};

#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

use crate::uri::{BaseUri, VersionedUri};

#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
#[derive(Debug)]
pub enum ValidationError {
    /// When associating a property name with a reference to a Type, we expect the name to match
    /// the [`VersionedUri::base_uri`] inside the reference.
    BaseUriMismatch {
        base_uri: BaseUri,
        versioned_uri: VersionedUri,
    },
}

impl Display for ValidationError {
    fn fmt(&self, fmt: &mut Formatter) -> fmt::Result {
        match self {
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
        }
    }
}

impl Error for ValidationError {}

/// TODO: DOC
pub trait ValidateUri {
    fn validate_uri(&self, base_uri: &BaseUri) -> Result<(), ValidationError>;
}
