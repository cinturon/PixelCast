use serde::{Deserialize, Serialize};

/// App-level categories for the numeric weather codes returned by Open-Meteo.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum WeatherCondition {
    ClearSky,
    MainlyClear,
    PartlyCloudy,
    Overcast,
    Fog,
    Drizzle,
    FreezingDrizzle,
    Rain,
    FreezingRain,
    SnowFall,
    SnowGrains,
    RainShowers,
    SnowShowers,
    Thunderstorm,
    ThunderstormWithHail,
    Unknown,
}

impl WeatherCondition {
    /// Map Open-Meteo weather codes into the smaller set of app categories.
    pub fn from_code(code: i64) -> Self {
        match code {
            0 => Self::ClearSky,
            1 => Self::MainlyClear,
            2 => Self::PartlyCloudy,
            3 => Self::Overcast,
            45 | 48 => Self::Fog,
            51 | 53 | 55 => Self::Drizzle,
            56 | 57 => Self::FreezingDrizzle,
            61 | 63 | 65 => Self::Rain,
            66 | 67 => Self::FreezingRain,
            71 | 73 | 75 => Self::SnowFall,
            77 => Self::SnowGrains,
            80..=82 => Self::RainShowers,
            85 | 86 => Self::SnowShowers,
            95 => Self::Thunderstorm,
            96 | 99 => Self::ThunderstormWithHail,
            _ => Self::Unknown,
        }
    }

    /// Display label shown in the weather UI.
    pub fn label(self) -> &'static str {
        match self {
            Self::ClearSky => "Clear sky",
            Self::MainlyClear => "Mainly clear",
            Self::PartlyCloudy => "Partly cloudy",
            Self::Overcast => "Overcast",
            Self::Fog => "Fog",
            Self::Drizzle => "Drizzle",
            Self::FreezingDrizzle => "Freezing drizzle",
            Self::Rain => "Rain",
            Self::FreezingRain => "Freezing rain",
            Self::SnowFall => "Snow fall",
            Self::SnowGrains => "Snow grains",
            Self::RainShowers => "Rain showers",
            Self::SnowShowers => "Snow showers",
            Self::Thunderstorm => "Thunderstorm",
            Self::ThunderstormWithHail => "Thunderstorm with hail",
            Self::Unknown => "Unknown",
        }
    }

    /// PixelCast flavor text paired with the condition label.
    pub fn flavor(self) -> &'static str {
        match self {
            Self::ClearSky => "The sky glows like a freshly opened treasure chest.",
            Self::MainlyClear => "A bright day. Perfect weather for crossing the overworld.",
            Self::PartlyCloudy => "The sun hides behind a veil. Something stirs in the distance.",
            Self::Overcast => "A muted sky hangs over the town square.",
            Self::Fog => "The path ahead fades into silver mist.",
            Self::Drizzle => "The roads are slick. Equip sturdy boots.",
            Self::FreezingDrizzle => "A cold rain falls across the kingdom.",
            Self::Rain => "Rain taps the rooftops like a thousand tiny drummers.",
            Self::FreezingRain => "Travelers may wish to seek shelter at the nearest inn.",
            Self::SnowFall => "A cold enchantment settles over the land.",
            Self::SnowGrains => "Snow falls softly, quieting the overworld.",
            Self::RainShowers => "A cleansing rain sweeps across the kingdom.",
            Self::SnowShowers => "Footprints vanish almost as soon as they are made.",
            Self::Thunderstorm => "Storm clouds gather. The air hums with danger.",
            Self::ThunderstormWithHail => "The heavens charge their ultimate spell.",
            Self::Unknown => "The sky keeps its secrets for now.",
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_clear_sky() {
        assert_eq!(WeatherCondition::from_code(0), WeatherCondition::ClearSky);
    }

    #[test]
    fn test_rain() {
        assert_eq!(WeatherCondition::from_code(61), WeatherCondition::Rain);
        assert_eq!(WeatherCondition::from_code(63), WeatherCondition::Rain);
        assert_eq!(WeatherCondition::from_code(65), WeatherCondition::Rain);
    }

    #[test]
    fn test_fog() {
        assert_eq!(WeatherCondition::from_code(45), WeatherCondition::Fog);
        assert_eq!(WeatherCondition::from_code(48), WeatherCondition::Fog);
    }
}
