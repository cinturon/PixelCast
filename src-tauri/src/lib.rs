mod api {
    pub mod http;
}

mod domain {
    pub mod current_weather;
    pub mod forecast;
    pub mod pixel_cast_error;
    pub mod weather_conditon;
}

pub use domain::pixel_cast_error::PixelCastError;
pub use domain::weather_conditon::WeatherCondition;

pub mod utils {
    pub mod cache;
    pub mod settings;
}

use tauri::{
    menu::{MenuBuilder, MenuItemBuilder, SubmenuBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Emitter, Manager,
};

use api::http::{get_current_weather_data, get_forecast_data, WeatherDataResponse};
use domain::current_weather::CurrentWeatherData;
use domain::forecast::DailyForecast;
use utils::cache::WeatherCache;
use utils::settings::Settings;

#[tauri::command]
async fn get_data() -> Result<WeatherDataResponse, PixelCastError> {
    let current: CurrentWeatherData = get_current_weather_data().await?;
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
    utils::cache::save_weather_cache(&app, &weather_data_response)
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
            let tray_icon = tauri::include_image!("icons/tray_icon.png");

            let refresh_item =
                MenuItemBuilder::with_id("tray_refresh", "Refresh").build(app)?;
            let quit_item =
                MenuItemBuilder::with_id("tray_quit", "Quit").build(app)?;
            let tray_menu = MenuBuilder::new(app)
                .item(&refresh_item)
                .item(&quit_item)
                .build()?;


            let tray = TrayIconBuilder::new()
                .icon(tray_icon)
                .tooltip("PixelCast")
                .menu(&tray_menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| {
                    if event.id().0.as_str() == "tray_refresh" {
                        let _ = app.emit("refresh_weather",());
                    }
                    if event.id().0.as_str() == "tray_quit" {
                        app.exit(0);
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.unminimize();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            app.manage(tray);

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
