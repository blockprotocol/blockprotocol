#![feature(lint_reasons)]
#![warn(
    clippy::all,
    clippy::nursery,
    clippy::pedantic,
    clippy::restriction,
    future_incompatible,
    nonstandard_style
)]
#![cfg_attr(not(target_arch = "wasm32"), warn(unreachable_pub))]
#![allow(
    clippy::absolute_paths,
    clippy::allow_attributes,
    clippy::allow_attributes_without_reason,
    clippy::arithmetic_side_effects,
    clippy::as_conversions,
    clippy::blanket_clippy_restriction_lints,
    clippy::default_numeric_fallback,
    clippy::else_if_without_else,
    clippy::enum_variant_names,
    clippy::exhaustive_enums,
    clippy::exhaustive_structs,
    clippy::expect_used,
    clippy::impl_trait_in_params,
    clippy::implicit_return,
    clippy::indexing_slicing,
    clippy::let_underscore_must_use,
    clippy::min_ident_chars,
    clippy::missing_assert_message,
    clippy::missing_docs_in_private_items,
    clippy::missing_inline_in_public_items,
    clippy::missing_trait_methods,
    clippy::mod_module_files,
    clippy::module_name_repetitions,
    clippy::multiple_inherent_impl,
    clippy::multiple_unsafe_ops_per_block,
    clippy::panic,
    clippy::partial_pub_fields,
    clippy::pattern_type_mismatch,
    clippy::pub_use,
    clippy::pub_with_shorthand,
    clippy::question_mark_used,
    clippy::ref_patterns,
    clippy::redundant_pub_crate,
    clippy::self_named_module_files,
    clippy::semicolon_outside_block,
    clippy::separated_literal_suffix,
    clippy::shadow_reuse,
    clippy::shadow_same,
    clippy::shadow_unrelated,
    clippy::single_call_fn,
    clippy::single_char_lifetime_names,
    clippy::std_instead_of_alloc,
    clippy::std_instead_of_core,
    clippy::tests_outside_test_module,
    clippy::unimplemented,
    clippy::unneeded_field_pattern,
    clippy::unreachable,
    clippy::unwrap_in_result,
    clippy::wildcard_enum_match_arm
)]

mod ontology;
mod utils;

pub use ontology::*;

#[cfg(test)]
#[path = "../tests/data/lib.rs"]
mod test_data;
