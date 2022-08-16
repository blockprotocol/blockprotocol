mod error;
#[cfg(not(target_arch = "wasm32"))]
mod native;
#[cfg(target_arch = "wasm32")]
mod wasm;

use std::{fmt, result::Result, str::FromStr};

use error::ParseVersionedUriError;
use serde::{de, Deserialize, Deserializer, Serialize, Serializer};
#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
#[derive(Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(transparent)]
pub struct BaseUri(String);

impl fmt::Debug for BaseUri {
    fn fmt(&self, fmt: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt::Debug::fmt(&self.0, fmt)
    }
}

impl fmt::Display for BaseUri {
    fn fmt(&self, fmt: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt::Display::fmt(&self.0, fmt)
    }
}

#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct VersionedUri {
    base_uri: BaseUri,
    version: u32,
}

impl fmt::Display for VersionedUri {
    fn fmt(&self, fmt: &mut fmt::Formatter) -> fmt::Result {
        write!(fmt, "{}/v/{}", self.base_uri.0, self.version)
    }
}

impl FromStr for VersionedUri {
    type Err = ParseVersionedUriError;

    fn from_str(uri: &str) -> Result<Self, ParseVersionedUriError> {
        let (base_uri, version) = uri.rsplit_once("/v/").ok_or(ParseVersionedUriError)?;

        // TODO: better error handling
        Self::new(
            &BaseUri::new(&base_uri).map_err(|_| ParseVersionedUriError {})?,
            version
                .parse().map_err(|_| ParseVersionedUriError {})?,
        ).map_err(|_| ParseVersionedUriError {})
    }
}

impl Serialize for VersionedUri {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: Serializer,
    {
        self.to_string().serialize(serializer)
    }
}

impl<'de> Deserialize<'de> for VersionedUri {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
        where
            D: Deserializer<'de>,
    {
        String::deserialize(deserializer)?
            .parse()
            .map_err(de::Error::custom)
    }
}
