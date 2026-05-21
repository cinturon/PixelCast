use serde::{Deserialize, Serialize};
use tauri::Manager;

/// Visual theme applied to the desktop UI.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum Theme {
    Chrono,
    #[serde(rename = "8bit")]
    EightBit,
    Fall,
    Winter,
}

impl Default for Theme {
    fn default() -> Self {
        Self::Chrono
    }
}

/// User preferences persisted between app launches.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    /// Color palette and styling preset for the app chrome.
    #[serde(default)]
    pub theme: Theme,
    /// Preferred unit used when displaying temperatures.
    pub temperature_unit: TemperatureUnit,
    /// Display name for the configured forecast location.
    pub city: String,
    /// Latitude passed to weather requests.
    pub latitude: f64,
    /// Longitude passed to weather requests.
    pub longitude: f64,
    /// Controls whether rainy conditions render the animated rain effect.
    pub enable_rain_effect: bool,
    /// When true, play low-volume ambient loops from `public/audio/`.
    #[serde(default = "default_enable_ambient_audio")]
    pub enable_ambient_audio: bool,
    /// Ambient loop volume from 0.0 (mute) to 1.0 (full).
    #[serde(default = "default_ambient_audio_volume")]
    pub ambient_audio_volume: f64,
    /// When true, register PixelCast to launch when the user logs in.
    #[serde(default)]
    pub launch_at_startup: bool,
}

fn default_enable_ambient_audio() -> bool {
    true
}

fn default_ambient_audio_volume() -> f64 {
    0.22
}

/// Supported temperature units for weather display.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum TemperatureUnit {
    Fahrenheit,
    Celsius,
}

impl Settings {
    /// Provide first-run defaults when no settings file exists yet.
    pub fn new() -> Self {
        Self {
            theme: Theme::default(),
            temperature_unit: TemperatureUnit::Fahrenheit,
            city: String::from("Seattle"),
            latitude: 47.6062,
            longitude: -122.3321,
            enable_rain_effect: true,
            enable_ambient_audio: default_enable_ambient_audio(),
            ambient_audio_volume: default_ambient_audio_volume(),
            launch_at_startup: false,
        }
    }
}

/// Enable or disable OS login-item registration to match the saved preference.
pub fn apply_launch_at_startup(
    app: &tauri::AppHandle,
    enabled: bool,
) -> Result<(), Box<dyn std::error::Error>> {
    use tauri_plugin_autostart::ManagerExt;

    let autolaunch = app.autolaunch();
    if enabled {
        autolaunch.enable()?;
    } else {
        autolaunch.disable()?;
    }
    Ok(())
}

impl Default for Settings {
    fn default() -> Self {
        Self::new()
    }
}

/// Resolve the app-specific settings file path managed by Tauri.
pub fn settings_file_path(app: &tauri::AppHandle) -> Result<std::path::PathBuf, tauri::Error> {
    Ok(app.path().app_config_dir()?.join("settings.json"))
}

/// Ensure a settings file exists, then load the user's persisted preferences.
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

/// Persist the user's current settings to disk.
pub fn save_settings(
    app: &tauri::AppHandle,
    settings: &Settings,
) -> Result<(), Box<dyn std::error::Error>> {
    let settings_file_path = settings_file_path(app)?;
    let settings_json = serde_json::to_string(settings)?;
    std::fs::write(&settings_file_path, settings_json)?;
    Ok(())
}

/// Read saved settings without creating defaults.
pub fn load_settings(app: &tauri::AppHandle) -> Result<Settings, Box<dyn std::error::Error>> {
    let settings_file_path = settings_file_path(app)?;
    let settings_file = std::fs::read_to_string(&settings_file_path)?;
    let settings: Settings = serde_json::from_str(&settings_file)?;
    Ok(settings)
}
