use serde::{Deserialize, Serialize};
#[cfg(target_arch = "wasm32")]
use {tsify::Tsify, wasm_bindgen::prelude::*};

use crate::{uri::VersionedUri, Array, Object, OneOf, ValidateUri, ValidationError, ValueOrArray};

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct PropertyTypeReference {
    #[serde(rename = "$ref")]
    uri: String,
}

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(untagged)]
#[allow(clippy::enum_variant_names)]
pub enum PropertyValues {
    DataTypeReference(crate::ontology::data_type::repr::DataTypeReference),
    PropertyTypeObject(
        crate::ontology::shared::object::repr::Object<
            crate::ontology::shared::array::repr::ValueOrArray<PropertyTypeReference>,
        >,
    ),
    ArrayOfPropertyValues(
        // This is a hack, currently recursive enums seem to break tsify
        // https://github.com/madonoharu/tsify/issues/5
        #[cfg_attr(target_arch = "wasm32", tsify(type = "Array<OneOf<PropertyValues>>"))]
        crate::ontology::shared::array::repr::Array<
            crate::ontology::shared::one_of::repr::OneOf<PropertyValues>,
        >,
    ),
}

/// Will serialize as a constant value `"propertyType"`
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[allow(clippy::use_self)]
enum PropertyTypeTag {
    PropertyType,
}

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct PropertyType {
    #[cfg_attr(target_arch = "wasm32", tsify(type = "'propertyType'"))]
    kind: PropertyTypeTag,
    #[serde(rename = "$id")]
    id: String,
    title: String,
    plural_title: String,
    #[cfg_attr(target_arch = "wasm32", tsify(optional))]
    #[serde(skip_serializing_if = "Option::is_none")]
    description: Option<String>,
    #[serde(flatten)]
    one_of: crate::ontology::shared::one_of::repr::OneOf<PropertyValues>,
}
