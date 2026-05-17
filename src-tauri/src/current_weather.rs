use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct CurrentWeatherResponse {
    pub current: CurrentWeather,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CurrentWeather {
    pub temperature_2m: f64,
    pub weather_code: i64,
    pub precipitation: f64,
}
