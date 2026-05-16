use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WeatherData {
    pub temperature: f64,
    pub condition: String,
    pub rain_chance: f64,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub enum WeatherError {
    InvalidCity(String),
}