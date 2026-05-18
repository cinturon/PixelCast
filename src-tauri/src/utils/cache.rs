use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use tauri::Manager;

use crate::api::http::WeatherDataResponse;
use crate::domain::pixel_cast_error::PixelCastError;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WeatherCache {
    pub data: WeatherDataResponse,
    pub cached_at: DateTime<Utc>,
}

impl WeatherCache {
    pub fn new(weather_data_response: &WeatherDataResponse) -> Self {
        Self {
            data: weather_data_response.clone(),
            cached_at: Utc::now(),
        }
    }
}

pub fn cache_file_path(app: &tauri::AppHandle) -> Result<std::path::PathBuf, tauri::Error> {
    Ok(app.path().app_config_dir()?.join("weather_cache.json"))
}

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

pub fn load_weather_cache(
    app: &tauri::AppHandle,
) -> Result<WeatherCache, Box<dyn std::error::Error>> {
    let cache_file_path = cache_file_path(app)?;
    let cache_file = std::fs::read_to_string(&cache_file_path)?;
    let cache: WeatherCache = serde_json::from_str(&cache_file)?;
    Ok(cache)
}
