mod api {
    pub mod http;
}

mod domain {
    pub mod current_weather;
    pub mod forecast;
    pub mod geolocation;
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

use api::http::{
    get_current_weather_data, get_forecast_data, get_geolocation, WeatherDataResponse,
};

use domain::geolocation::GeoLocationResponse;
use utils::cache::WeatherCache;
use utils::settings::Settings;

#[tauri::command]
async fn get_data(app: tauri::AppHandle) -> Result<WeatherDataResponse, PixelCastError> {
    let settings = utils::settings::load_or_create_settings(&app)
        .map_err(|error| PixelCastError::filesystem(error.to_string()))?;

    let latitude = settings.latitude.to_string();
    let longitude = settings.longitude.to_string();
    
    let params = [
        ("latitude", latitude.as_str()),
        ("longitude", longitude.as_str()),
    ];
    let current =
        get_current_weather_data(&params, settings.temperature_unit).await?;
    let forecasts = get_forecast_data(&params, settings.temperature_unit).await?;

    let data: WeatherDataResponse = WeatherDataResponse { current, forecasts };
    Ok(data)
}

#[tauri::command]
async fn get_long_and_lat(city: &str) -> Result<GeoLocationResponse, PixelCastError> {
    let trimmed = city.trim();
    if trimmed.is_empty() {
        return Err(PixelCastError::api("City name cannot be empty"));
    }

    let response = get_geolocation(trimmed).await?;
    if response.results.is_empty() {
        return Err(PixelCastError::api(format!(
            "No location found for \"{trimmed}\""
        )));
    }

    Ok(response)
}

#[tauri::command]
async fn save_settings(app: tauri::AppHandle, settings: Settings) -> Result<(), String> {
    utils::settings::apply_launch_at_startup(&app, settings.launch_at_startup)
        .map_err(|e| e.to_string())?;
    utils::settings::save_settings(&app, &settings)
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn load_settings(app: tauri::AppHandle) -> Result<Settings, String> {
    utils::settings::load_or_create_settings(&app).map_err(|e| e.to_string())
}

#[tauri::command]
async fn save_weather_cache(
    app: tauri::AppHandle,
    weather_data_response: WeatherDataResponse,
) -> Result<(), String> {
    utils::cache::save_weather_cache(&app, &weather_data_response)
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn load_weather_cache(app: tauri::AppHandle) -> Result<WeatherCache, String> {
    utils::cache::load_weather_cache(&app).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::Builder::new().build())
        .setup(|app| {
            let tray_icon = tauri::include_image!("icons/tray_icon.png");

            let refresh_item = MenuItemBuilder::with_id("tray_refresh", "Refresh").build(app)?;
            let quit_item = MenuItemBuilder::with_id("tray_quit", "Quit").build(app)?;
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
                        let _ = app.emit("refresh_weather", ());
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
            utils::settings::apply_launch_at_startup(app.handle(), settings.launch_at_startup)
                .map_err(|error| error.to_string())?;
            app.manage(settings);

            let settings_menu_item =
                MenuItemBuilder::with_id("settings", "Open Settings").build(app)?;
            let about_menu_item =
                MenuItemBuilder::with_id("about", "About PixelCast").build(app)?;

            let settings_menu = SubmenuBuilder::new(app, "Settings")
                .item(&settings_menu_item)
                .item(&about_menu_item)
                .build()?;

            let menu = MenuBuilder::new(app).item(&settings_menu).build()?;

            app.set_menu(menu)?;

            app.on_menu_event(move |app, event| match event.id().0.as_str() {
                "settings" => {
                    let _ = app.emit("settings_clicked", "settings_clicked");
                }
                "about" => {
                    let _ = app.emit("about_clicked", ());
                }
                _ => {}
            });

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_data,
            get_long_and_lat,
            save_settings,
            load_settings,
            save_weather_cache,
            load_weather_cache,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
