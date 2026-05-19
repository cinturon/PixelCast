use serde::{Deserialize, Serialize};

/// Raw forecast payload shape returned by Open-Meteo.
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct FiveDayForecastResponse {
    pub daily: FiveDayForecastDaily,
}

/// Parallel arrays returned by Open-Meteo for daily forecast values.
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct FiveDayForecastDaily {
    /// Forecast dates aligned by index with the other daily arrays.
    pub time: Vec<String>,
    /// Daily high temperatures aligned with `time`.
    pub temperature_2m_max: Vec<f64>,
    /// Daily low temperatures aligned with `time`.
    pub temperature_2m_min: Vec<f64>,
    /// Open-Meteo condition codes used to derive app display text.
    pub weather_code: Vec<i64>,
    /// Highest daily precipitation probability from the forecast.
    pub precipitation_probability_max: Vec<f64>,
}

/// App-facing forecast row sent over the Tauri boundary.
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct DailyForecast {
    /// Forecast date for this row.
    pub date: String,
    /// Daily high temperature in Fahrenheit.
    #[serde(rename = "highF")]
    pub high_f: f64,
    /// Daily low temperature in Fahrenheit.
    #[serde(rename = "lowF")]
    pub low_f: f64,
    /// Original API condition code retained for icon and label derivation.
    #[serde(rename = "weatherCode")]
    pub weather_code: i64,
    /// Rain chance shown in the forecast row.
    #[serde(rename = "rainChance")]
    pub rain_chance: f64,
    /// Human-readable condition label derived from `weather_code`.
    #[serde(rename = "weatherCondition")]
    pub weather_condition: String,
}
