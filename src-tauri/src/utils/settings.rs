use serde::{Deserialize, Serialize};
use tauri::Manager;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    temperature_unit: TemperatureUnit,
    city: String,
    latitude: f64,
    longitude: f64,
    enable_rain_effect: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum TemperatureUnit {
    Fahrenheit,
    Celsius,
}

impl Settings {
    pub fn new() -> Self {
        Self {
            temperature_unit: TemperatureUnit::Fahrenheit,
            city: String::from("Seattle"),
            latitude: 47.6062,
            longitude: -122.3321,
            enable_rain_effect: true,
        }
    }
}

impl Default for Settings {
    fn default() -> Self {
        Self::new()
    }
}

pub fn settings_file_path(app: &tauri::AppHandle) -> Result<std::path::PathBuf, tauri::Error> {
    Ok(app.path().app_config_dir()?.join("settings.json"))
}
