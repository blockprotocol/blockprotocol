mod error;
#[cfg(target_arch = "wasm32")]
mod wasm;

use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use serde_json;
#[cfg(target_arch = "wasm32")]
use {tsify::Tsify, wasm_bindgen::prelude::*};

use crate::uri::VersionedUri;

/// Will serialize as a constant value `"dataType"`
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
enum DataTypeTag {
    DataType,
}

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DataType {
    #[cfg_attr(target_arch = "wasm32", tsify(type = "'dataType'"))]
    kind: DataTypeTag,
    #[serde(rename = "$id")]
    id: VersionedUri,
    title: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    description: Option<String>,
    #[serde(rename = "type")]
    json_type: String,
    /// Properties, which are not strongly typed.
    ///
    /// The data type meta-schema currently allows arbitrary, untyped properties. This is a
    /// catch-all field to store all non-typed data.
    #[cfg_attr(target_arch = "wasm32", tsify(type = "Record<string, any>"))]
    #[serde(flatten)]
    additional_properties: HashMap<String, serde_json::Value>,
}

impl DataType {
    #[must_use]
    pub const fn new(
        id: VersionedUri,
        title: String,
        description: Option<String>,
        json_type: String,
        additional_properties: HashMap<String, serde_json::Value>,
    ) -> Self {
        Self {
            kind: DataTypeTag::DataType,
            id,
            title,
            description,
            json_type,
            additional_properties,
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
    pub fn description(&self) -> Option<&str> {
        self.description.as_deref()
    }

    #[must_use]
    pub fn json_type(&self) -> &str {
        &self.json_type
    }

    #[must_use]
    pub const fn additional_properties(&self) -> &HashMap<String, serde_json::Value> {
        &self.additional_properties
    }

    #[must_use]
    pub fn additional_properties_mut(&mut self) -> &mut HashMap<String, serde_json::Value> {
        &mut self.additional_properties
    }
}
