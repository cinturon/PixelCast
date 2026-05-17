use serde::{Deserialize, Serialize};
use tauri::Manager;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    pub temperature_unit: TemperatureUnit,
    pub city: String,
    pub latitude: f64,
    pub longitude: f64,
    pub enable_rain_effect: bool,
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

pub fn load_or_create_settings(
    app: &tauri::AppHandle,
) -> Result<Settings, Box<dyn std::error::Error>> {
    let settings_file_path = settings_file_path(app)?;

    if !settings_file_path.exists() {
        let settings: Settings = Settings::default();

        let settings_dir = settings_file_path.parent();
        if let Some(settings_dir) = settings_dir {
            std::fs::create_dir_all(settings_dir)?;
        }

        let settings_json = serde_json::to_string(&settings)?;
        std::fs::write(&settings_file_path, settings_json)?;
    }

    let settings_file = std::fs::read_to_string(&settings_file_path)?;
    let settings: Settings = serde_json::from_str(&settings_file)?;
    Ok(settings)
}
