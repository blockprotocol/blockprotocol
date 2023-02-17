mod error;
#[cfg(target_arch = "wasm32")]
mod wasm;
use std::{fmt, result::Result, str::FromStr, sync::LazyLock};

pub use error::{ParseBaseUriError, ParseVersionedUriError};
use regex::Regex;
use serde::{de, Deserialize, Deserializer, Serialize, Serializer};
#[cfg(target_arch = "wasm32")]
use tsify::Tsify;
use url::Url;

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Clone, PartialEq, Eq, Ord, PartialOrd, Hash)]
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

impl BaseUri {
    /// Creates a new [`BaseUri`] from a given URI string
    ///
    /// # Errors
    /// - `ParseBaseUriError` if the given URI string is invalid
    pub fn new(uri: String) -> Result<BaseUri, ParseBaseUriError> {
        Self::validate_str(&uri)?;

        Ok(Self(uri))
    }

    fn validate_str(uri: &str) -> Result<(), ParseBaseUriError> {
        if !uri.ends_with('/') {
            return Err(ParseBaseUriError::MissingTrailingSlash);
        }
        // TODO: Propagate more useful errors
        if Url::parse(uri)
            .map_err(|err| ParseBaseUriError::UrlParseError(err.to_string()))?
            .cannot_be_a_base()
        {
            Err(ParseBaseUriError::CannotBeABase)
        } else {
            Ok(())
        }
    }

    #[must_use]
    pub fn to_url(&self) -> Url {
        Url::parse(&self.0).expect("invalid Base URI")
    }

    #[must_use]
    pub fn as_str(&self) -> &str {
        self.0.as_str()
    }
}

impl Serialize for BaseUri {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        self.to_string().serialize(serializer)
    }
}

impl<'de> Deserialize<'de> for BaseUri {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        Self::new(String::deserialize(deserializer)?).map_err(de::Error::custom)
    }
}

// TODO: can we impl Tsify to turn this into a type: template string
//  if we can then we should delete wasm::VersionedUriPatch
#[derive(Debug, Clone, PartialEq, Eq, Ord, PartialOrd, Hash)]
pub struct VersionedUri {
    pub base_uri: BaseUri,
    pub version: u32,
}

impl VersionedUri {
    #[must_use]
    pub fn to_url(&self) -> Url {
        let mut url = self.base_uri.to_url();
        url.path_segments_mut()
            .expect("invalid Base URI, we should have caught an invalid base already")
            .extend(["v", &self.version.to_string()]);

        url
    }
}

impl fmt::Display for VersionedUri {
    fn fmt(&self, fmt: &mut fmt::Formatter) -> fmt::Result {
        write!(fmt, "{}v/{}", self.base_uri.as_str(), self.version)
    }
}

impl FromStr for VersionedUri {
    type Err = ParseVersionedUriError;

    fn from_str(uri: &str) -> Result<Self, ParseVersionedUriError> {
        static RE: LazyLock<Regex> =
            LazyLock::new(|| Regex::new(r#"(.+/)v/(\d+)(.*)"#).expect("regex failed to compile"));
        let captures = RE
            .captures(uri)
            .ok_or(ParseVersionedUriError::IncorrectFormatting)?;
        let base_uri = captures
            .get(1)
            .ok_or(ParseVersionedUriError::MissingBaseUri)?
            .as_str();
        let version = captures
            .get(2)
            .ok_or(ParseVersionedUriError::MissingVersion)?
            .as_str();

        if let Some(suffix) = captures.get(3) {
            // Regex returns an empty string for capturing groups that don't match anything
            if !suffix.as_str().is_empty() {
                return Err(ParseVersionedUriError::AdditionalEndContent);
            }
        }

        Ok(Self {
            base_uri: BaseUri::new(base_uri.to_owned())
                .map_err(ParseVersionedUriError::InvalidBaseUri)?,
            version: u32::from_str(version)
                .map_err(|error| ParseVersionedUriError::InvalidVersion(error.to_string()))?,
        })
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
        let uri = VersionedUri::from_str(input_str).expect("parsing versioned URI failed");
        assert_eq!(&uri.to_string(), input_str);
    }
}
