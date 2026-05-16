mod weather;
use weather::{WeatherData, WeatherError};
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[tauri::command]
fn get_current_weather(_city: String) -> Result<WeatherData, WeatherError> {
    if _city.is_empty() {
        return Err(WeatherError::InvalidCity("City is required".to_string()));
    }
    Ok(WeatherData {
        temperature: 70.0,
        condition: "Sunny".to_string(),
        rain_chance: 0.1,
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_current_weather])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
