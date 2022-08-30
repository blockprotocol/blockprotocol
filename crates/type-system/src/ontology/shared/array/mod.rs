pub mod error;
pub(in crate::ontology) mod repr;

use crate::{uri::BaseUri, ValidateUri, ValidationError};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Array<T> {
    items: T,
    min_items: Option<usize>,
    max_items: Option<usize>,
}

impl<T> Array<T> {
    #[must_use]
    pub const fn new(items: T, min_items: Option<usize>, max_items: Option<usize>) -> Self {
        Self {
            items,
            min_items,
            max_items,
        }
    }

    #[must_use]
    pub const fn items(&self) -> &T {
        &self.items
    }

    #[must_use]
    pub const fn min_items(&self) -> Option<usize> {
        self.min_items
    }

    #[must_use]
    pub const fn max_items(&self) -> Option<usize> {
        self.max_items
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ValueOrArray<T> {
    Value(T),
    Array(Array<T>),
}

impl<T: ValidateUri> ValidateUri for ValueOrArray<T> {
    fn validate_uri(&self, base_uri: &BaseUri) -> Result<(), ValidationError> {
        match self {
            Self::Value(value) => value.validate_uri(base_uri),
            Self::Array(array) => array.items().validate_uri(base_uri),
        }
    }
}

#[cfg(test)]
mod tests {
    // TODO - Test Validation
}
