mod current_weather;
mod forecast;
mod http;

use current_weather::CurrentWeather;
use forecast::DailyForecast;
use http::{get_current_weather_data, get_forecast_data, WeatherDataResponse, WeatherError};

#[tauri::command]
async fn get_data(_city: String) -> Result<WeatherDataResponse, WeatherError> {
    if _city.is_empty() {
        return Err(WeatherError::new("City Error", "City is required"));
    }

    let current: CurrentWeather = get_current_weather_data().await?;
    let forecasts: Vec<DailyForecast> = get_forecast_data().await?;

    let data: WeatherDataResponse = WeatherDataResponse { current, forecasts };
    Ok(data)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_data,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
