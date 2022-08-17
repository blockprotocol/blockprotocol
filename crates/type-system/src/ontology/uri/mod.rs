mod error;
#[cfg(not(target_arch = "wasm32"))]
mod native;
#[cfg(target_arch = "wasm32")]
mod wasm;

use std::{fmt, result::Result, str::FromStr};

use error::ParseVersionedUriError;
use serde::{de, Deserialize, Deserializer, Serialize, Serializer};
use url::Url;
#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
#[derive(Clone, PartialEq, Eq, Hash)]
pub struct BaseUri(Url);

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

impl VersionedUri {
    fn as_url(&self) -> Url {
        self.base_uri.0
            .join(&format!("v/{}", self.version))
            .expect("failed to add version path to Base URI")
    }
}

impl fmt::Display for VersionedUri {
    fn fmt(&self, fmt: &mut fmt::Formatter) -> fmt::Result {
        write!(fmt, "{}", self.as_url().as_str())
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
