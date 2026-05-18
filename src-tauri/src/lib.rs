mod api {
    pub mod http;
}

mod domain {
    pub mod current_weather;
    pub mod forecast;
    pub mod pixel_cast_error;
}

pub use domain::pixel_cast_error::PixelCastError;

pub mod utils {
    pub mod cache;
    pub mod settings;
}

use tauri::{
    menu::{MenuBuilder, MenuItemBuilder, SubmenuBuilder},
    Emitter, Manager,
};

use api::http::{get_current_weather_data, get_forecast_data, WeatherDataResponse, WeatherError};
use domain::current_weather::CurrentWeather;
use domain::forecast::DailyForecast;
use utils::cache::WeatherCache;
use utils::settings::Settings;

#[tauri::command]
async fn get_data() -> Result<WeatherDataResponse, WeatherError> {
    let current: CurrentWeather = get_current_weather_data().await?;
    let forecasts: Vec<DailyForecast> = get_forecast_data().await?;

    let data: WeatherDataResponse = WeatherDataResponse { current, forecasts };
    Ok(data)
}

#[tauri::command]
async fn save_settings(app: tauri::AppHandle, settings: Settings) -> Result<(), String> {
    utils::settings::save_settings(&app, &settings).map_err(|error| error.to_string())?;
    Ok(())
}

#[tauri::command]
async fn load_settings(app: tauri::AppHandle) -> Result<Settings, String> {
    let settings = utils::settings::load_settings(&app).map_err(|error| error.to_string())?;
    Ok(settings)
}

#[tauri::command]
async fn save_weather_cache(
    app: tauri::AppHandle,
    weather_data_response: WeatherDataResponse,
) -> Result<(), String> {
    utils::cache::save_weather_cache(&app, &weather_data_response as &WeatherDataResponse)
        .map_err(|error| error.to_string())?;
    Ok(())
}

#[tauri::command]
async fn load_weather_cache(app: tauri::AppHandle) -> Result<WeatherCache, String> {
    let cache = utils::cache::load_weather_cache(&app).map_err(|error| error.to_string())?;
    Ok(cache)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let settings = utils::settings::load_or_create_settings(app.handle())?;
            app.manage(settings);

            let settings_menu_item =
                MenuItemBuilder::with_id("settings", "Open Settings").build(app)?;

            let settings_menu = SubmenuBuilder::new(app, "Settings")
                .item(&settings_menu_item)
                .build()?;

            let menu = MenuBuilder::new(app).item(&settings_menu).build()?;

            app.set_menu(menu)?;

            app.on_menu_event(move |app, event| {
                if event.id().0.as_str() == "settings" {
                    let _ = app.emit("settings_clicked", "settings_clicked");
                }
            });

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_data,
            save_settings,
            load_settings,
            save_weather_cache,
            load_weather_cache,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
