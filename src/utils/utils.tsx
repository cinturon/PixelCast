import { TemperatureUnit } from "./weatherStructs";

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

export const formatTemperature = (valueF: number, unit: TemperatureUnit) => {
    if (unit === "Celsius") {
        return `${Math.round((valueF - 32) * 5 / 9)}°C`;
    }
    return `${Math.round(valueF)}°F`;
}