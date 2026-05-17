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
    menu::{MenuBuilder, SubmenuBuilder, MenuItemBuilder},
    Emitter, Manager,
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
            let settings = utils::settings::load_or_create_settings(app.handle())?;
            app.manage(settings);


            let settings_menu_item = MenuItemBuilder::with_id("settings", "Open Settings")
                .build(app)?;

            
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
        .invoke_handler(tauri::generate_handler![get_data,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
