use url::Url;

use crate::ontology::uri::{error::ParseBaseUriError, BaseUri, VersionedUri};

impl BaseUri {
    pub fn new(uri: String) -> Result<BaseUri, ParseBaseUriError> {
        let url = Url::parse(&uri).map_err(|_| ParseBaseUriError {})?;
        Ok(Self(url.into()))
    }
}

impl VersionedUri {
    /// Creates a new `VersionedUri` from the given `base_uri` and `version`.
    pub fn new(base_uri: BaseUri, version: u32) -> Result<VersionedUri, ParseBaseUriError> {
        Ok(Self {
            base_uri,
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
}
