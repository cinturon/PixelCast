use chrono::{DateTime, Utc};

use crate::api::http::WeatherDataResponse;

pub struct WeatherCache {
    pub city: String,
    pub latitude: f64,
    pub longitude: f64,
    pub cached_at: DateTime<Utc>,
    pub data: WeatherDataResponse,
}

impl WeatherCache {
    pub fn new(city: String, latitude: f64, longitude: f64, data: WeatherDataResponse) -> Self {
        Self {
            city,
            latitude,
            longitude,
            cached_at: Utc::now(),
            data,
        }
    }
}