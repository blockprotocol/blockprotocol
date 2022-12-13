//! Definitions of the elements of the Type System.
//!
//! This module contains the definitions of [`DataType`]s, [`PropertyType`]s, [`EntityType`]s. The
//! structs are Rust representations of their meta-schemas defined within the Block Protocol
//! specification, and are used to validate instances of types using [`serde`]. To aid with the
//! de/serialization, intermediary structs and helpers are defined across various submodules.

mod data_type;
mod entity_type;
mod property_type;
// TODO: reconsider calling these URIs in the spec, it seems to be a redundant term nowadays and
//  we should probably just go with URL
pub mod uri;

mod shared;

pub use data_type::{DataType, DataTypeReference, ParseDataTypeError};
pub use entity_type::{
    links::{Links, MaybeOrderedArray, ParseLinksError},
    EntityType, EntityTypeReference, ParseEntityTypeError,
};
pub use property_type::{
    ParsePropertyTypeError, PropertyType, PropertyTypeReference, PropertyValues,
};
pub use shared::{
    all_of::{error::ParseAllOfError, AllOf},
    array::{
        error::{
            ParseEntityTypeReferenceArrayError, ParseOneOfArrayError,
            ParsePropertyTypeReferenceArrayError,
        },
        Array, ValueOrArray,
    },
    object::{error::ParsePropertyTypeObjectError, Object},
    one_of::{error::ParseOneOfError, OneOf},
    validate::{ValidateUri, ValidationError},
};

// Re-export the repr contents so they're nicely grouped and so that they're easier to import in
// a non-ambiguous way where they don't get confused with their non repr counterparts.
// For example, `import crate::repr` lets you then use `repr::DataType`
pub mod repr {
    pub use super::{
        data_type::repr::{DataType, DataTypeReference},
        entity_type::{
            links::repr::{Links, MaybeOneOfEntityTypeReference},
            repr::{EntityType, EntityTypeReference},
        },
        property_type::repr::{PropertyType, PropertyTypeReference, PropertyValues},
        shared::{
            all_of::repr::AllOf,
            array::repr::{Array, ValueOrArray},
            object::repr::Object,
            one_of::repr::OneOf,
        },
    };
}
