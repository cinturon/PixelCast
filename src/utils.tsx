export const weatherIconByKey: Record<string, string> = {
    clear: "/icons/sun.png",
    cloudy: "/icons/cloudy.png",
    light_snow: "/icons/light_snow.png",
    heavy_snow: "/icons/heavy_snow.png",
    heavy_rain: "/icons/heavy_rain.png",
    light_rain: "/icons/light_rain.png",
    thunderstorm: "/icons/thunder_storm.png",
    unknown: "/icons/sun.png",
};

export const weatherFlavorByCondition: Record<string, string> = {
    "Clear sky": "The sky glows like a freshly opened treasure chest.",
    "Mainly clear": "A bright day. Perfect weather for crossing the overworld.",
    "Partly cloudy": "The sun hides behind a veil. Something stirs in the distance.",
    "Overcast": "A muted sky hangs over the town square.",
    "Fog": "The path ahead fades into silver mist.",
    "Drizzle": "The roads are slick. Equip sturdy boots.",
    "Freezing drizzle": "A cold rain falls across the kingdom.",
    "Rain": "Rain taps the rooftops like a thousand tiny drummers.",
    "Freezing rain": "Travelers may wish to seek shelter at the nearest inn.",
    "Snow fall": "A cold enchantment settles over the land.",
    "Snow grains": "Snow falls softly, quieting the overworld.",
    "Rain showers": "A cleansing rain sweeps across the kingdom.",
    "Snow showers": "Footprints vanish almost as soon as they are made.",
    "Thunderstorm": "Storm clouds gather. The air hums with danger.",
    "Thunderstorm with hail": "The heavens charge their ultimate spell.",
    "Unknown": "The sky keeps its secrets for now.",
};

export type WeatherCondition = {
    condition: string;
    icon: string;
};

export const getWeatherCondition = (code: number): WeatherCondition => {
    switch (code) {
        case 0:
            return { condition: "Clear sky", icon: "sun" };
        case 1:
            return { condition: "Mainly clear", icon: "sun" };
        case 2:
            return { condition: "Partly cloudy", icon: "cloudy" };
        case 3:
            return { condition: "Overcast", icon: "cloudy" };
        case 45:
        case 48:
            return { condition: "Fog", icon: "cloudy" };
        case 51:
        case 53:
        case 55:
            return { condition: "Drizzle", icon: "light_rain" };
        case 56:
        case 57:
            return { condition: "Freezing drizzle", icon: "light_rain" };
        case 61:
        case 63:
        case 65:
            return { condition: "Rain", icon: "light_rain" };
        case 66:
        case 67:
            return { condition: "Freezing rain", icon: "light_rain" };
        case 71:
        case 73:
        case 75:
            return { condition: "Snow fall", icon: "light_snow" };
        case 77:
            return { condition: "Snow grains", icon: "light_snow" };
        case 80:
        case 81:
        case 82:
            return { condition: "Rain showers", icon: "heavy_rain" };
        case 85:
        case 86:
            return { condition: "Snow showers", icon: "heavy_snow" };
        case 95:
            return { condition: "Thunderstorm", icon: "thunderstorm" };
        case 96:
        case 99:
            return { condition: "Thunderstorm with hail", icon: "thunderstorm" };
        default:
            return { condition: "Unknown", icon: "sun" };
    }
};