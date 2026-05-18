import { TemperatureUnit } from "./weatherStructs";

const iconsDir = "/icons/";

export const weatherIconByKey: Record<string, string> = {

    "Clear sky": iconsDir + "sun.svg",
    "Mainly clear": iconsDir + "sun.svg",
    "Partly cloudy": iconsDir + "cloudy.svg",
    "Overcast": iconsDir + "cloudy.svg",
    "Fog": iconsDir + "cloudy.svg",
    "Drizzle": iconsDir + "cloudy.svg",
    "Freezing drizzle": iconsDir + "cloudy.svg",
    "Rain": iconsDir + "cloudy.svg",
    "Freezing rain": iconsDir + "cloudy.svg",
    "Snow fall": iconsDir + "cloudy.svg",
    "Snow grains": iconsDir + "cloudy.svg",
    "Rain showers": iconsDir + "cloudy.svg",
    "Snow showers": iconsDir + "cloudy.svg",
    "Thunderstorm": iconsDir + "cloudy.svg",
    "Thunderstorm with hail": iconsDir + "cloudy.svg",
    "Unknown": iconsDir + "sun.svg",
};

export const formatTemperature = (valueF: number, unit: TemperatureUnit) => {
    if (unit === "Celsius") {
        return `${Math.round((valueF - 32) * 5 / 9)}°C`;
    }
    return `${Math.round(valueF)}°F`;
}