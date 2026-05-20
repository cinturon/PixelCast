use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)] 
pub struct GeoLocationResponse {
    pub results: Vec<GeoLocationResult>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GeoLocationResult {
    pub name: String,
    pub latitude: f64,
    pub longitude: f64,
    pub timezone: String,
    pub country: String
}
