use serde::{Deserialize, Serialize};
#[cfg(target_arch = "wasm32")]
use {tsify::Tsify, wasm_bindgen::prelude::*};

use crate::ontology::repr_shared::validate::ValidationError;

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct OneOfRepr<T> {
    // TODO: tsify doesn't seem to let us override the type of this without losing the generic
    //  see https://github.com/madonoharu/tsify/issues/4
    //  we want something like #[cfg_attr(target_arch = "wasm32", tsify(type = "[T, ...T[]]"))]
    one_of: Vec<T>,
}

#[cfg_attr(target_arch = "wasm32", derive(Tsify))]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(try_from = "OneOfRepr<T>")]
pub struct OneOf<T> {
    #[serde(flatten)]
    repr: OneOfRepr<T>,
}

impl<T> OneOf<T> {
    /// Creates a new `OneOf` without validating.
    pub fn new_unchecked<U: Into<Vec<T>>>(one_of: U) -> Self {
        Self {
            repr: OneOfRepr {
                one_of: one_of.into(),
            },
        }
    }

    /// Creates a new `OneOf` from the given vector.
    ///
    /// # Errors
    ///
    /// - [`ValidationError`] if the object is not in a valid state.
    pub fn new<U: Into<Vec<T>>>(one_of: U) -> Result<Self, ValidationError> {
        let one_of = Self::new_unchecked(one_of);
        one_of.validate()?;
        Ok(one_of)
    }

    #[must_use]
    pub fn one_of(&self) -> &[T] {
        &self.repr.one_of
    }

    fn validate(&self) -> Result<(), ValidationError> {
        if self.one_of().is_empty() {
            return Err(ValidationError::EmptyOneOf);
        }
        Ok(())
    }
}

impl<T> TryFrom<OneOfRepr<T>> for OneOf<T> {
    type Error = ValidationError;

    fn try_from(one_of: OneOfRepr<T>) -> Result<Self, Self::Error> {
        Self::new(one_of.one_of)
    }
}

#[cfg(test)]
mod tests {
    use serde_json::json;

    use super::*;

    mod one_of {
        use super::*;
        use crate::utils::tests::{check_serialization, ensure_failed_deserialization};

        #[test]
        fn empty() {
            ensure_failed_deserialization::<OneOf<()>>(json!({
                "oneOf": []
            }));
        }

        #[test]
        fn one() {
            check_serialization(
                json!({
                    "oneOf": ["A"]
                }),
                Some(OneOf::new(["A".to_owned()]).expect("Invalid OneOf")),
            );
        }

        #[test]
        fn multiple() {
            check_serialization(
                json!({
                    "oneOf": ["A", "B"]
                }),
                Some(OneOf::new(["A".to_owned(), "B".to_owned()]).expect("Invalid OneOf")),
            );
        }

        #[test]
        fn additional_properties() {
            ensure_failed_deserialization::<OneOf<()>>(json!({
                "oneOf": ["A", "B"],
                "additional": 10,
            }));
        }
    }
}
