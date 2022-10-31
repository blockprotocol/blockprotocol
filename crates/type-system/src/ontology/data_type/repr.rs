use std::{collections::HashMap, str::FromStr};

use serde::{Deserialize, Serialize};
#[cfg(target_arch = "wasm32")]
use tsify::Tsify;

use crate::{
    uri::{ParseVersionedUriError, VersionedUri},
    ParseDataTypeError,
};

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
    #[cfg_attr(target_arch = "wasm32", tsify(type = "VersionedUri"))]
    #[serde(rename = "$id")]
    id: String,
    title: String,
    #[cfg_attr(target_arch = "wasm32", tsify(optional))]
    #[serde(skip_serializing_if = "Option::is_none")]
    description: Option<String>,
    #[serde(rename = "type")]
    json_type: String,
    /// Properties which are not currently strongly typed.
    ///
    /// The data type meta-schema currently allows arbitrary, untyped properties. This is a
    /// catch-all field to store all non-typed data.
    #[cfg_attr(target_arch = "wasm32", tsify(type = "Record<string, any>"))]
    #[serde(flatten)]
    additional_properties: HashMap<String, serde_json::Value>,
}

impl TryFrom<DataType> for super::DataType {
    type Error = ParseDataTypeError;

    fn try_from(data_type_repr: DataType) -> Result<Self, Self::Error> {
        let id = VersionedUri::from_str(&data_type_repr.id)
            .map_err(ParseDataTypeError::InvalidVersionedUri)?;

        Ok(Self::new(
            id,
            data_type_repr.title,
            data_type_repr.description,
            data_type_repr.json_type,
            data_type_repr.additional_properties,
        ))
    }
}

impl From<super::DataType> for DataType {
    fn from(data_type: super::DataType) -> Self {
        Self {
            kind: DataTypeTag::DataType,
            id: data_type.id.to_string(),
            title: data_type.title,
            description: data_type.description,
            json_type: data_type.json_type,
            additional_properties: data_type.additional_properties,
        }
    }
}

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct DataTypeReference {
    #[cfg_attr(target_arch = "wasm32", tsify(type = "VersionedUri"))]
    #[serde(rename = "$ref")]
    uri: String,
}

impl TryFrom<DataTypeReference> for super::DataTypeReference {
    type Error = ParseVersionedUriError;

    fn try_from(data_type_ref_repr: DataTypeReference) -> Result<Self, Self::Error> {
        let uri = VersionedUri::from_str(&data_type_ref_repr.uri)?;
        Ok(Self::new(uri))
    }
}

impl From<super::DataTypeReference> for DataTypeReference {
    fn from(data_type_ref: super::DataTypeReference) -> Self {
        Self {
            uri: data_type_ref.uri.to_string(),
        }
    }
}
