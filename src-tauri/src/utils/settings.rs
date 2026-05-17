struct Settings {
    temperature_unit: TemperatureUnit,
    city: String,
    latitude: f64,
    longitude: f64,
    enable_rain_effect: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum TemperatureUnit {
    Fahrenheit,
    Celsius,
}

impl Settings {
    fn new() -> Self {
        Self {
            temperature_unit: TemperatureUnit::Fahrenheit,
            city: String::from("Seattle"),
            latitude: 47.6062,
            longitude: -122.3321,
            enable_rain_effect: true,
        }
    }
}
