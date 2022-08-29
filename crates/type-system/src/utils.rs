#[cfg(target_arch = "wasm32")]
pub use wasm::*;

#[cfg(target_arch = "wasm32")]
mod wasm {
    use serde::{Deserialize, Serialize};
    use tsify::Tsify;

    pub fn set_panic_hook() {
        // When the `console_error_panic_hook` feature is enabled, we can call the
        // `set_panic_hook` function at least once during initialization, and then
        // we will get better error messages if our code ever panics.
        //
        // For more details see
        // https://github.com/rustwasm/console_error_panic_hook#readme
        console_error_panic_hook::set_once();
    }

    /// TODO: Doc
    #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, Tsify)]
    #[serde(tag = "type", content = "inner")]
    pub enum Result<T, E> {
        Ok(T),
        Err(E),
    }

    impl<T, E> From<std::result::Result<T, E>> for Result<T, E> {
        fn from(result: std::result::Result<T, E>) -> Self {
            match result {
                Ok(val) => Self::Ok(val),
                Err(err) => Self::Err(err),
            }
        }
    }
}

#[cfg(test)]
pub mod tests {
    use std::{fmt::Debug, str::FromStr};

    use serde::{Deserialize, Serialize};

    /// Will serialize as a constant value `"string"`
    #[derive(Default, Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
    #[serde(rename_all = "camelCase")]
    pub enum StringTypeTag {
        #[default]
        String,
    }

    // Helpful for testing minimum cases of some of the serialization primitives
    #[derive(Default, Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
    #[serde(rename_all = "camelCase", deny_unknown_fields)]
    pub struct StringTypeStruct {
        r#type: StringTypeTag,
    }

    #[expect(clippy::similar_names)]
    #[expect(
        clippy::needless_pass_by_value,
        reason = "The value is used in the `assert_eq`, and passing by ref here is less convenient"
    )]
    pub fn check_serialization_from_str<T>(input: &str, expected_native_repr: Option<T>) -> T
    where
        T: FromStr + Into<serde_json::Value> + Debug + Clone + PartialEq,
        <T as FromStr>::Err: Debug,
    {
        let deserialized: T = T::from_str(input).expect("failed to deserialize");
        let _reserialized =
            serde_json::to_value(&deserialized.clone().into()).expect("failed to serialize");

        if let Some(repr) = expected_native_repr {
            assert_eq!(deserialized, repr);
        }

        deserialized
    }

    #[expect(clippy::similar_names)]
    #[expect(
        clippy::needless_pass_by_value,
        reason = "The value is used in the `assert_eq`, and passing by ref here is less convenient"
    )]
    pub fn check_repr_serialization_from_value<T>(
        input: serde_json::Value,
        expected_native_repr: Option<T>,
    ) -> T
    where
        T: for<'de> Deserialize<'de> + Serialize + Debug + PartialEq,
    {
        let deserialized: T = serde_json::from_value(input.clone()).expect("failed to deserialize");
        let reserialized = serde_json::to_value(&deserialized).expect("failed to serialize");

        if let Some(repr) = expected_native_repr {
            assert_eq!(deserialized, repr);
        }

        assert_eq!(input, reserialized);

        deserialized
    }

    pub fn ensure_repr_failed_deserialization<T>(json: serde_json::Value)
    where
        for<'de> T: Debug + Deserialize<'de>,
    {
        serde_json::from_value::<T>(json)
            .expect_err("JSON was expected to be invalid but it was accepted");
    }
}
