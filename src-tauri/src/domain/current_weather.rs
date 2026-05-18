use serde::{Deserialize, Serialize};

use crate::WeatherCondition;

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct CurrentWeatherResponse {
    pub current: CurrentWeather,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct CurrentWeather {
    pub temperature_2m: f64,
    pub weather_code: i64,
    pub precipitation: f64,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CurrentWeatherData {
    pub temperature_2m: f64,
    pub weather_code: i64,
    pub precipitation: f64,
    pub weather_condition: String,
    pub weather_flavor: String,
}

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
