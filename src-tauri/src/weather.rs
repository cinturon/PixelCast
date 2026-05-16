use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WeatherData {
    pub temperature: f64,
    pub condition: String,
    pub rain_chance: f64,
}