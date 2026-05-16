use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct CurrentWeather {
    pub temperature_2m: f64,
    pub weather_code: i64,
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

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct WeatherCondition {
    pub condition: &'static str,
    pub icon_key: &'static str
}

impl From<i64> for WeatherCondition {
    fn from(code: i64) -> Self {
        match code {
            0 => WeatherCondition {
                condition: "Clear sky",
                icon_key: "sun",
            },
            1 => WeatherCondition {
                condition: "Mainly clear",
                icon_key: "sun",
            },
            2 => WeatherCondition {
                condition: "Partly cloudy",
                icon_key: "cloudy",
            },
            3 => WeatherCondition {
                condition: "Overcast",
                icon_key: "cloudy",
            },
            45 | 48 => WeatherCondition {
                condition: "Fog",
                icon_key: "cloudy",
            },
            51 | 53 | 55 => WeatherCondition {
                condition: "Drizzle",
                icon_key: "light_rain",
            },
            56 | 57 => WeatherCondition {
                condition: "Freezing drizzle",
                icon_key: "light_rain",
            },
            61 | 63 | 65 => WeatherCondition {
                condition: "Rain",
                icon_key: "light_rain",
            },
            66 | 67 => WeatherCondition {
                condition: "Freezing rain",
                icon_key: "light_rain",
            },
            71 | 73 | 75 => WeatherCondition {
                condition: "Snow fall",
                icon_key: "light_snow",
            },
            77 => WeatherCondition {
                condition: "Snow grains",
                icon_key: "light_snow",
            },
            80..=82 => WeatherCondition {
                condition: "Rain showers",
                icon_key: "heavy_rain",
            },
            85 | 86 => WeatherCondition {
                condition: "Snow showers",
                icon_key: "heavy_snow",
            },
            95 => WeatherCondition {
                condition: "Thunderstorm",
                icon_key: "thunderstorm",
            },
            96 | 99 => WeatherCondition {
                condition: "Thunderstorm with hail",
                icon_key: "thunderstorm",
            },
            _ => WeatherCondition {
                condition: "Unknown",
                icon_key: "sun",
            },
        }
    }
}
