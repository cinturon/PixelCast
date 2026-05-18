use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct FiveDayForecastResponse {
    pub daily: FiveDayForecastDaily,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct FiveDayForecastDaily {
    pub time: Vec<String>,
    pub temperature_2m_max: Vec<f64>,
    pub temperature_2m_min: Vec<f64>,
    pub weather_code: Vec<i64>,
    pub precipitation_probability_max: Vec<f64>,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct DailyForecast {
    pub date: String,
    #[serde(rename = "highF")]
    pub high_f: f64,
    #[serde(rename = "lowF")]
    pub low_f: f64,
    #[serde(rename = "weatherCode")]
    pub weather_code: i64,
    #[serde(rename = "rainChance")]
    pub rain_chance: f64,
    #[serde(rename = "weatherCondition")]
    pub weather_condition: String,
}
