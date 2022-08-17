use url::Url;

use crate::ontology::uri::{error::ParseBaseUriError, BaseUri, VersionedUri};

impl BaseUri {
    pub fn new(uri: &str) -> Result<BaseUri, ParseBaseUriError> {
        // TODO: Propagate more useful errors
        // TODO: This attempts to parse the string _into_ a valid URL. Perhaps we want to enforce
        //  that the string is valid (by checking the output is equal to the input). An example:
        //  "file://loc%61lhost/" is turned into "file:///"
        let url = Url::parse(&uri).map_err(|_| ParseBaseUriError {})?;
        Ok(Self(url))
    }
}

impl VersionedUri {
    /// Creates a new `VersionedUri` from the given `base_uri` and `version`.
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
}
