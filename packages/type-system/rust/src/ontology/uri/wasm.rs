use url::Url;
use wasm_bindgen::prelude::*;

use crate::ontology::uri::{error::ParseBaseUriError, BaseUri, VersionedUri};

#[wasm_bindgen]
impl BaseUri {
    #[wasm_bindgen(constructor)]
    pub fn new(uri: String) -> Result<BaseUri, ParseBaseUriError> {
        // TODO: Propagate more useful errors
        // TODO: This attempts to parse the string _into_ a valid URL. Perhaps we want to enforce
        //  that the string is valid (by checking the output is equal to the input). An example:
        //  "file://loc%61lhost/" is turned into "file:///"
        let url = Url::parse(&uri).map_err(|_| ParseBaseUriError {})?;
        Ok(Self(url.into()))
    }

    // TODO: is there another way around this
    #[allow(
        clippy::inherent_to_string_shadow_display,
        reason = "We need to shadow the impl in WASM to allow us to rename the js_name"
    )]
    #[wasm_bindgen(js_name = toString)]
    pub fn to_string(&self) -> String {
        format!("{}", self)
    }

    #[wasm_bindgen(js_name = toJSON)]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap()
    }
}

#[wasm_bindgen]
impl VersionedUri {
    #[wasm_bindgen(constructor)]
    /// Creates a new `VersionedUri` from the given `base_uri` and `version`.
    pub fn new(base_uri: BaseUri, version: u32) -> Result<VersionedUri, ParseBaseUriError> {
        Ok(Self {
            base_uri,
            version,
        })
    }

    #[wasm_bindgen(getter = baseUri)]
    pub fn base_uri(&self) -> BaseUri {
        self.base_uri.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn version(&self) -> u32 {
        self.version
    }

    // TODO: is there another way around this
    #[allow(
        clippy::inherent_to_string_shadow_display,
        reason = "We need to shadow the impl in WASM to allow us to rename the js_name"
    )]
    #[wasm_bindgen(js_name = toString)]
    pub fn to_string(&self) -> String {
        format!("{}", self)
    }

    #[wasm_bindgen(js_name = toJSON)]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap()
    }
}
