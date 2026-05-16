use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct CurrentWeather {
    pub temperature_2m: f64,
    pub weather_code: i64,
    pub weather_condition: Option<String>,
    pub precipitation: f64,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WeatherDataResponse {
    pub current: CurrentWeather,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CurrentWeatherError {
    pub error_type: String,
    pub message: String,
}

impl CurrentWeatherError {
    pub fn new(error_type: String, message: String) -> Self {
        Self {
            error_type,
            message,
        }
    }
}
