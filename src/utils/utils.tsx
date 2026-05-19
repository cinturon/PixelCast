import { TemperatureUnit } from "./weatherStructs";

const iconsDir = "/icons/";

export const weatherIconByKey: Record<string, string> = {

    "Clear sky": iconsDir + "sun.png",
    "Mainly clear": iconsDir + "sun.png",
    "Partly cloudy": iconsDir + "cloudy.png",
    "Overcast": iconsDir + "cloudy.png",
    "Fog": iconsDir + "cloudy.png",
    "Drizzle": iconsDir + "light_rain.png",
    "Freezing drizzle": iconsDir + "light_rain.png",
    "Rain": iconsDir + "light_rain.png",
    "Freezing rain": iconsDir + "heavy_rain.png",
    "Snow fall": iconsDir + "light_snow.png",
    "Snow grains": iconsDir + "light_snow.png",
    "Rain showers": iconsDir + "heavy_rain.png",
    "Snow showers": iconsDir + "heavy_snow.png",
    "Thunderstorm": iconsDir + "thunder_storm.png",
    "Thunderstorm with hail": iconsDir + "thunder_storm.png",
    "Unknown": iconsDir + "sun.png",
};

export const formatTemperature = (valueF: number, unit: TemperatureUnit) => {
    if (unit === "Celsius") {
        return `${Math.round((valueF - 32) * 5 / 9)}°C`;
    }
    return `${Math.round(valueF)}°F`;
}