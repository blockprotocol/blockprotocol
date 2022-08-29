//! Definitions of the elements of the Type System.
//!
//! This module contains the definitions of [`DataType`]s, [`PropertyType`]s, [`EntityType`]s, and
//! [`LinkType`]s. The structs are Rust representations of their meta-schemas defined within the
//! Block Protocol specification, and are used to validate instances of types using [`serde`]. To
//! aid with the de/serialization, intermediary structs and helpers are defined across various
//! submodules.

pub mod data_type;
pub mod property_type;
// TODO: reconsider calling these URIs in the spec, it seems to be a redundant term nowadays and
//  we should probably just go with URL
pub mod uri;

mod shared;

pub use shared::{
    array::{Array, ValueOrArray},
    error::{serialize_with_delimiter, HasSerdeJsonError},
    object::Object,
    one_of::OneOf,
    validate::{ValidateUri, ValidationError},
};

// Re-export the repr contents so they're nicely grouped and so that they're easier to import in
// a non-ambiguous way where they don't get confused with their non repr counterparts.
// For example, `import crate::ontology::repr` lets you then use `repr::DataType`
pub mod repr {
    pub use super::{
        data_type::repr::{DataType, DataTypeReference},
        property_type::repr::{PropertyType, PropertyTypeReference, PropertyValues},
        shared::{
            array::repr::{Array, ValueOrArray},
            object::repr::Object,
            one_of::repr::OneOf,
        },
    };
}
