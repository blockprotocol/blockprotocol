use std::str::FromStr;

use serde::{Deserialize, Serialize};
#[cfg(target_arch = "wasm32")]
use {tsify::Tsify, wasm_bindgen::prelude::*};

use crate::{
    ontology::property_type::error::ParsePropertyTypeError,
    uri::{ParseVersionedUriError, VersionedUri},
};

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct PropertyTypeReference {
    #[serde(rename = "$ref")]
    uri: String,
}

impl TryFrom<PropertyTypeReference> for super::PropertyTypeReference {
    type Error = ParseVersionedUriError;

    fn try_from(property_type_ref_repr: PropertyTypeReference) -> Result<Self, Self::Error> {
        let uri = VersionedUri::from_str(&property_type_ref_repr.uri)?;
        Ok(Self::new(uri))
    }
}

impl From<super::PropertyTypeReference> for PropertyTypeReference {
    fn from(property_type_ref: super::PropertyTypeReference) -> Self {
        Self {
            uri: property_type_ref.uri.to_string(),
        }
    }
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

impl TryFrom<PropertyValues> for super::PropertyValues {
    type Error = ParsePropertyTypeError;

    fn try_from(property_values_repr: PropertyValues) -> Result<Self, Self::Error> {
        Ok(match property_values_repr {
            PropertyValues::DataTypeReference(data_type_ref_repr) => Self::DataTypeReference(
                data_type_ref_repr
                    .try_into()
                    .map_err(|err| ParsePropertyTypeError::InvalidDataTypeReference(err))?,
            ),
            PropertyValues::PropertyTypeObject(property_type_object_repr) => {
                Self::PropertyTypeObject(
                    property_type_object_repr
                        .try_into()
                        .map_err(|err| ParsePropertyTypeError::InvalidPropertyTypeObject())?,
                )
            }
            PropertyValues::ArrayOfPropertyValues(array_repr) => Self::ArrayOfPropertyValues(
                array_repr
                    .try_into()
                    .map_err(|err| ParsePropertyTypeError::InvalidArrayItems())?,
            ),
        })
    }
}

impl From<super::PropertyValues> for PropertyValues {
    fn from(property_values: super::PropertyValues) -> Self {
        match property_values {
            super::PropertyValues::DataTypeReference(data_type_ref) => {
                Self::DataTypeReference(data_type_ref.into())
            }
            super::PropertyValues::PropertyTypeObject(property_type_object) => {
                Self::PropertyTypeObject(property_type_object.into())
            }
            super::PropertyValues::ArrayOfPropertyValues(array) => {
                Self::ArrayOfPropertyValues(array.into())
            }
        }
    }
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

impl TryFrom<PropertyType> for super::PropertyType {
    type Error = ParsePropertyTypeError;

    fn try_from(property_type_repr: PropertyType) -> Result<Self, Self::Error> {
        let id = VersionedUri::from_str(&property_type_repr.id)
            .map_err(|err| ParsePropertyTypeError::InvalidVersionedUri(err))?;
        Ok(Self::new(
            id,
            property_type_repr.title,
            property_type_repr.plural_title,
            property_type_repr.description,
            property_type_repr
                .one_of
                .try_into()
                .map_err(|err| ParsePropertyTypeError::InvalidArrayItems())?,
        ))
    }
}

impl From<super::PropertyType> for PropertyType {
    fn from(property_type: super::PropertyType) -> Self {
        Self {
            kind: PropertyTypeTag::PropertyType,
            id: property_type.id.to_string(),
            title: property_type.title,
            plural_title: property_type.plural_title,
            description: property_type.description,
            one_of: property_type.one_of.into(),
        }
    }
}
