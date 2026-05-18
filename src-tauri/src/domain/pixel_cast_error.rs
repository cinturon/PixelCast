use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PixelCastError {
    APIError(String),
    FilesystemError(String),
}

impl PixelCastError {
    pub fn api(error: impl Into<String>) -> Self {
        Self::APIError(error.into())
    }

    pub fn filesystem(error: impl Into<String>) -> Self {
        Self::FilesystemError(error.into())
    }
}

impl std::error::Error for PixelCastError {}

impl std::fmt::Display for PixelCastError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            PixelCastError::APIError(error) => write!(f, "API error: {error}"),
            PixelCastError::FilesystemError(error) => write!(f, "Filesystem error: {error}"),
        }
    }
}
