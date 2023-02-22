#![feature(lint_reasons)]
#![feature(extern_types)]
#![feature(once_cell)]
// This is a nuisance for wasm_bindgen which requires pub functions
#![cfg_attr(not(target_arch = "wasm32"), warn(unreachable_pub))]
#![warn(
    clippy::pedantic,
    clippy::nursery,
    // Encountering a lot of false positives appearing on things like `derive` macros. We should
    // revisit periodically in case the bug gets fixed
    // clippy::allow_attributes_without_reason,
    clippy::as_underscore,
    clippy::clone_on_ref_ptr,
    clippy::create_dir,
    clippy::dbg_macro,
    clippy::default_union_representation,
    clippy::deref_by_slicing,
    clippy::empty_structs_with_brackets,
    clippy::filetype_is_file,
    clippy::get_unwrap,
    clippy::print_stdout,
    clippy::print_stderr,
    clippy::rc_buffer,
    clippy::rc_mutex,
    clippy::same_name_method,
    clippy::str_to_string,
    clippy::string_add,
    clippy::string_slice,
    clippy::string_to_string,
    clippy::try_err,
    clippy::undocumented_unsafe_blocks,
    clippy::unnecessary_self_imports,
    clippy::unwrap_used,
    clippy::use_debug,
    clippy::verbose_file_reads
)]
#![allow(
    clippy::redundant_pub_crate,
    reason = "Conflicts with `unreachable_pub` \
                  see <https://github.com/rust-lang/rust-clippy/issues/5369>"
)]
#![expect(clippy::use_self, reason = "Too many false positives")]
#![expect(
    clippy::module_name_repetitions,
    reason = "This encourages importing `as` which breaks IDEs"
)]

mod ontology;
mod utils;

pub use ontology::*;

#[cfg(test)]
#[path = "../tests/data/lib.rs"]
mod test_data;
