#[cfg(target_arch = "wasm32")]
pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    console_error_panic_hook::set_once();
}

#[cfg(test)]
pub mod tests {
    use serde::{Deserialize, Serialize};

    pub fn serialize_is_idempotent<T>(input: serde_json::Value)
    where
        T: for<'de> Deserialize<'de> + Serialize,
    {
        let deserialized: T = serde_json::from_value(input.clone()).expect("failed to deserialize");
        let reserialized = serde_json::to_value(&deserialized).expect("failed to serialize");

        assert_eq!(input, reserialized);
    }
}
