use serde::{Deserialize, Serialize};

use crate::current_weather::{CurrentWeather, CurrentWeatherResponse};
use crate::forecast::{DailyForecast, FiveDayForecastResponse};

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WeatherError {
    pub error_type: String,
    pub message: String,
}

impl WeatherError {
    pub fn new(error_type: impl Into<String>, message: impl Into<String>) -> Self {
        Self {
            error_type: error_type.into(),
            message: message.into(),
        }
    }
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WeatherDataResponse {
    pub current: CurrentWeather,
    pub forecasts: Vec<DailyForecast>,
}

async fn api_request(params: &[(&str, &str)]) -> Result<String, WeatherError> {
    let base_url = "https://api.open-meteo.com/v1/forecast";
    let query = params
        .iter()
        .map(|(key, value)| format!("{key}={value}"))
        .collect::<Vec<_>>()
        .join("&");
    let url = format!("{base_url}?{query}");
    let response = reqwest::get(url)
        .await
        .map_err(|error| WeatherError::new("Request Error", error.to_string()))?;
    if !response.status().is_success() {
        return Err(WeatherError::new(
            "Request Failed Error",
            response.status().to_string(),
        ));
    }
    let body = response
        .text()
        .await
        .map_err(|error| WeatherError::new("Request Body Error", error.to_string()))?;
    Ok(body)
}

pub async fn get_current_weather_data() -> Result<CurrentWeather, WeatherError> {
    let params = [
        ("latitude", "47.6062"),
        ("longitude", "-122.3321"),
        ("current", "temperature_2m,weather_code,precipitation"),
        ("temperature_unit", "fahrenheit"),
    ];

    let body = api_request(&params).await?;
    let data: CurrentWeatherResponse = serde_json::from_str::<CurrentWeatherResponse>(&body)
        .map_err(|error| WeatherError::new("Parse Current Weather JSON Error", error.to_string()))?;
    Ok(data.current)
}

pub async fn get_forecast_data() -> Result<Vec<DailyForecast>, WeatherError> {
    let params = [
        ("latitude", "47.6062"),
        ("longitude", "-122.3321"),
        (
            "daily",
            "temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max",
        ),
        ("temperature_unit", "fahrenheit"),
        ("forecast_days", "5"),
        ("timezone", "auto"),
    ];
    let body = api_request(&params).await?;
    let data = serde_json::from_str::<FiveDayForecastResponse>(&body)
        .map_err(|error| WeatherError::new("Parsing Forecast JSON Error", error.to_string()))?;
    map_forecast_data(data).await
}

async fn map_forecast_data(
    data: FiveDayForecastResponse,
) -> Result<Vec<DailyForecast>, WeatherError> {
    let forecasts = data.daily
        .time
        .iter()
        .enumerate()
        .map(|(index, time)| DailyForecast {
            date: time.to_string(),
            high_f: data.daily.temperature_2m_max[index],
            low_f: data.daily.temperature_2m_min[index],
            weather_code: data.daily.weather_code[index],
            rain_chance: data.daily.precipitation_probability_max[index],
        })
        .collect();
    Ok(forecasts)
}
