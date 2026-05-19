use serde::{Deserialize, Serialize};

use crate::WeatherCondition;

/// Raw current-weather payload shape returned by Open-Meteo.
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct CurrentWeatherResponse {
    /// Nested current conditions object in the Open-Meteo response.
    pub current: CurrentWeather,
}

/// Raw current conditions before app-specific display labels are added.
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct CurrentWeather {
    /// Air temperature measured at 2 meters, using the requested API unit.
    pub temperature_2m: f64,
    /// Open-Meteo condition code used to derive app display text.
    pub weather_code: i64,
    /// Current precipitation amount from the API response.
    pub precipitation: f64,
}

/// App-facing current weather data sent over the Tauri boundary.
#[derive(Clone, Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CurrentWeatherData {
    /// Temperature preserved from the API response for display formatting.
    pub temperature_2m: f64,
    /// Original API condition code retained for consumers that need raw codes.
    pub weather_code: i64,
    /// Precipitation value shown in the current weather card.
    pub precipitation: f64,
    /// Human-readable condition label derived from `weather_code`.
    pub weather_condition: String,
    /// PixelCast flavor text derived from the condition code.
    pub weather_flavor: String,
}

/// Enrich raw API data with labels and flavor text used by the UI.
impl From<CurrentWeather> for CurrentWeatherData {
    fn from(current_weather: CurrentWeather) -> Self {
        Self {
            temperature_2m: current_weather.temperature_2m,
            weather_code: current_weather.weather_code,
            precipitation: current_weather.precipitation,
            weather_condition: WeatherCondition::from_code(current_weather.weather_code)
                .label()
                .to_string(),
            weather_flavor: WeatherCondition::from_code(current_weather.weather_code)
                .flavor()
                .to_string(),
        }
    }
}
