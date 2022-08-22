mod error;
#[cfg(target_arch = "wasm32")]
mod wasm;

use std::{fmt, result::Result, str::FromStr, sync::LazyLock};

use error::ParseVersionedUriError;
use regex::Regex;
use serde::{de, Deserialize, Deserializer, Serialize, Serializer};
use url::Url;

use crate::uri::error::ParseBaseUriError;

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

impl BaseUri {
    /// Creates a new [`BaseUri`] from a given URI string
    ///
    /// # Errors
    /// - `ParseBaseUriError` if the given URI string is invalid
    pub fn new(uri: &str) -> Result<BaseUri, ParseBaseUriError> {
        // TODO: Propagate more useful errors
        // TODO: This attempts to parse the string _into_ a valid URL. Perhaps we want to enforce
        //  that the string is valid (by checking the output is equal to the input). An example:
        //  "file://loc%61lhost/" is turned into "file:///"
        let parsed_url = Url::parse(uri).map_err(|_| ParseBaseUriError {})?;
        Ok(Self(parsed_url))
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct VersionedUri {
    base_uri: BaseUri,
    version: u32,
}

impl VersionedUri {
    /// Creates a new [`VersionedUri`] from the given `base_uri` and `version`.
    ///
    /// # Errors
    /// - `ParseBaseUriError` if the given URI string is invalid
    pub fn new(base_uri: &BaseUri, version: u32) -> Result<VersionedUri, ParseBaseUriError> {
        Ok(Self {
            base_uri: base_uri.clone(),
            version,
        })
    }

    #[must_use]
    pub const fn base_uri(&self) -> &BaseUri {
        &self.base_uri
    }

    #[must_use]
    pub const fn version(&self) -> u32 {
        self.version
    }

    #[must_use]
    fn as_url(&self) -> Url {
        self.base_uri
            .0
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
        // TODO: better error handling
        static RE: LazyLock<Regex> =
            LazyLock::new(|| Regex::new(r#"(.*/)v/(\d)*"#).expect("Regex failed to compile"));
        let captures = RE.captures(uri).ok_or(ParseVersionedUriError {})?;
        let base_uri = captures.get(1).ok_or(ParseVersionedUriError {})?.as_str();
        let version = captures.get(2).ok_or(ParseVersionedUriError {})?.as_str();

        Self::new(
            &BaseUri::new(base_uri).map_err(|_| ParseVersionedUriError {})?,
            version.parse().map_err(|_| ParseVersionedUriError {})?,
        )
        .map_err(|_| ParseVersionedUriError {})
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

#[cfg(test)]
mod tests {
    use super::*;

    // TODO: add some unit tests for base URI

    #[test]
    fn versioned_uri() {
        let input_str = "https://blockprotocol.org/@blockprotocol/types/data-type/empty-list/v/1";
        let uri = VersionedUri::from_str(input_str).expect("Parsing versioned URI failed");
        assert_eq!(&uri.to_string(), input_str);
    }
}
