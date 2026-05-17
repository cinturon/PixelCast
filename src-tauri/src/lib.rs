mod api {
    pub mod http;
}

mod domain {
    pub mod current_weather;
    pub mod forecast;
}

pub mod utils {
    pub mod settings;
}

use tauri::{
    menu::{MenuBuilder, SubmenuBuilder},
    Emitter,
};

use api::http::{get_current_weather_data, get_forecast_data, WeatherDataResponse, WeatherError};
use domain::current_weather::CurrentWeather;
use domain::forecast::DailyForecast;

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
        .setup(|app| {
            let settings_menu = SubmenuBuilder::new(app, "Settings")
                .text("unit_fahrenheit", "Fahrenheit")
                .text("unit_celsius", "Celsius")
                .build()?;
            let menu = MenuBuilder::new(app).item(&settings_menu).build()?;
            app.set_menu(menu)?;
            app.on_menu_event(|app, event| match event.id().0.as_str() {
                "unit_fahrenheit" => {
                    let _ = app.emit("temperature-unit-changed", "fahrenheit");
                }
                "unit_celsius" => {
                    let _ = app.emit("temperature-unit-changed", "celsius");
                }
                _ => {}
            });

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_data,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
