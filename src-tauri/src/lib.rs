mod weather;

use weather::{WeatherDataResponse, CurrentWeather, CurrentWeatherError, WeatherCondition};

#[tauri::command]
async fn  get_current_weather(_city: String) -> Result<CurrentWeather, CurrentWeatherError> {
    if _city.is_empty() {
        return Err(CurrentWeatherError::new("City Error".to_string(), "City is required".to_string()));
    }
    
    let url = "https://api.open-meteo.com/v1/forecast";
    let params = [
        ("latitude", "47.6062"),
        ("longitude", "-122.3321"),
        ("current", "temperature_2m,weather_code,precipitation"),
        ("temperature_unit", "fahrenheit"),
    ];

    let query = params
        .iter()
        .map(|(key, value)| format!("{key}={value}"))
        .collect::<Vec<_>>()
        .join("&");

    let url = format!("{url}?{query}");
    let response = reqwest::get(url)
        .await
        .map_err(|error| CurrentWeatherError::new("Request Error".to_string(), error.to_string()))?;

        if !response.status().is_success() {
        return Err(CurrentWeatherError::new("Request Error".to_string(), response.status().to_string()));
    }

    let body = response.text().await.map_err(|error| CurrentWeatherError::new("Request Error".to_string(), error.to_string()))?;

    // println!("Open-Meteo raw response: {body}");

    if body.is_empty() || body == "null" {
        return Err(CurrentWeatherError::new("Request Error".to_string(), "Response is empty".to_string()));
    }

    match serde_json::from_str::<WeatherDataResponse>(&body) {
        Ok(data) => {
            Ok(data.current)
        },
        Err(error) => {
            println!("Body: {body}");
            println!("Parse error: {:?}", error);
            Err(CurrentWeatherError::new("Parse Error".to_string(), error.to_string()))
        }
    }
}

#[tauri::command]
async fn  get_weather_condition(code: i64) -> WeatherCondition {
    WeatherCondition::from(code)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_current_weather, get_weather_condition])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
