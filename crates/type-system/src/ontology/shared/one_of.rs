pub(in crate::ontology) mod repr {
    use serde::{Deserialize, Serialize};
    #[cfg(target_arch = "wasm32")]
    use {tsify::Tsify, wasm_bindgen::prelude::*};

    #[cfg_attr(target_arch = "wasm32", derive(Tsify))]
    #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
    #[serde(rename_all = "camelCase", deny_unknown_fields)]
    pub struct OneOf<T> {
        #[serde(rename = "oneOf")]
        // TODO: tsify doesn't seem to let us override the type of this without losing the generic
        //  see https://github.com/madonoharu/tsify/issues/4
        //  we want something like #[cfg_attr(target_arch = "wasm32", tsify(type = "[T, ...T[]]"))]
        pub possibilities: Vec<T>,
    }

    impl<T, R> TryFrom<OneOf<R>> for super::OneOf<T>
    where
        T: TryFrom<R>,
    {
        // TODO
        type Error = ();

        fn try_from(one_of_repr: OneOf<R>) -> Result<Self, Self::Error> {
            let inner = one_of_repr
                .possibilities
                .into_iter()
                .map(|ele| ele.try_into().map_err(|err| ()))
                .collect::<Result<Vec<_>, Self::Error>>()?;

            Ok(Self::new(inner).map_err(|err| ())?)
        }
    }

    impl<T, R> From<super::OneOf<T>> for OneOf<R>
    where
        R: From<T>,
    {
        fn from(one_of: super::OneOf<T>) -> Self {
            let possibilities = one_of
                .possibilities
                .into_iter()
                .map(|ele| ele.into())
                .collect();
            Self { possibilities }
        }
    }
}

use crate::ontology::shared::validate::ValidationError;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct OneOf<T> {
    possibilities: Vec<T>,
}

impl<T> OneOf<T> {
    /// Creates a new `OneOf` without validating.
    pub fn new_unchecked<U: Into<Vec<T>>>(possibilities: U) -> Self {
        Self {
            possibilities: possibilities.into(),
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
        &self.possibilities
    }

    fn validate(&self) -> Result<(), ValidationError> {
        if self.one_of().is_empty() {
            return Err(ValidationError::EmptyOneOf);
        }
        Ok(())
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
                Some(OneOf::new(["A".to_owned()]).expect("invalid OneOf")),
            );
        }

        #[test]
        fn multiple() {
            check_serialization(
                json!({
                    "oneOf": ["A", "B"]
                }),
                Some(OneOf::new(["A".to_owned(), "B".to_owned()]).expect("invalid OneOf")),
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
