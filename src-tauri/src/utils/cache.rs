use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use tauri::Manager;

use crate::api::http::WeatherDataResponse;
use crate::domain::pixel_cast_error::PixelCastError;

/// Persisted snapshot of the latest weather response.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WeatherCache {
    /// Complete weather payload restored when the cache is still usable.
    pub data: WeatherDataResponse,
    /// Timestamp used by the frontend to decide when to refresh.
    pub cached_at: DateTime<Utc>,
}

impl WeatherCache {
    /// Wrap fresh API data with the current UTC cache timestamp.
    pub fn new(weather_data_response: &WeatherDataResponse) -> Self {
        Self {
            data: weather_data_response.clone(),
            cached_at: Utc::now(),
        }
    }
}

/// Resolve the app-specific cache file path managed by Tauri.
pub fn cache_file_path(app: &tauri::AppHandle) -> Result<std::path::PathBuf, tauri::Error> {
    Ok(app.path().app_config_dir()?.join("weather_cache.json"))
}

/// Serialize fresh weather data so it can be reused on the next launch.
pub fn save_weather_cache(
    app: &tauri::AppHandle,
    weather_data_response: &WeatherDataResponse,
) -> Result<(), Box<dyn std::error::Error>> {
    let cache: WeatherCache = WeatherCache::new(weather_data_response);

    let cache_file_path = cache_file_path(app)?;

    if !cache_file_path.exists() {
        let cache_dir = cache_file_path
            .parent()
            .ok_or_else(|| PixelCastError::filesystem("Failed to get cache file path"))?;
        std::fs::create_dir_all(cache_dir)?;
    }
    let cache_json = serde_json::to_string(&cache)?;
    std::fs::write(&cache_file_path, cache_json)?;

    Ok(())
}

/// Read and deserialize the saved weather cache from disk.
pub fn load_weather_cache(
    app: &tauri::AppHandle,
) -> Result<WeatherCache, Box<dyn std::error::Error>> {
    let cache_file_path = cache_file_path(app)?;
    let cache_file = std::fs::read_to_string(&cache_file_path)?;
    let cache: WeatherCache = serde_json::from_str(&cache_file)?;
    Ok(cache)
}
