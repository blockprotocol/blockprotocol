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

pub mod repr_shared;
