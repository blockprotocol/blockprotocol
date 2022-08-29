use serde::{Deserialize, Serialize};
use serde_json::error::Category;

pub(in crate::ontology) fn serialize_with_delimiter<T>(contents: T) -> String
where
    T: Serialize,
{
    format!(
        "$%$%{}$%$%",
        serde_json::to_string(&contents).expect("failed to serialize")
    )
}

pub(in crate::ontology) trait HasSerdeJsonError {
    fn new_serde_json_error(contents: String) -> Self;
}

/// TODO - DOC
pub const SERDE_DELIMITER: &str = "$%$%";

/// TODO - DOC
#[allow(clippy::string_slice)]
pub(in crate::ontology) fn parse_serde_json_error<T>(err: &serde_json::Error) -> T
where
    T: for<'de> Deserialize<'de> + HasSerdeJsonError,
{
    match err.classify() {
        Category::Data => {
            let serde_json_err_string = err.to_string();
            let start_index = serde_json_err_string
                .find(SERDE_DELIMITER)
                .unwrap_or_else(|| {
                    panic!(
                        "starting delimiter was missing from error message: \
                         {serde_json_err_string}"
                    )
                })
                + SERDE_DELIMITER.len();

            let end_index = serde_json_err_string[start_index..]
                .find(SERDE_DELIMITER)
                .unwrap_or_else(|| {
                    panic!(
                        "ending delimiter was missing from error message: {serde_json_err_string}"
                    )
                })
                + start_index;

            serde_json::from_str(&serde_json_err_string.as_str()[start_index..end_index])
        }
        _ => Ok(T::new_serde_json_error(err.to_string())),
    }
    .expect("failed to deserialize error")
}
