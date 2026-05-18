import { WeatherCondition } from "../utils/weatherStructs";
import { weatherFlavorByCondition, weatherIconByKey } from "../utils/utils";

export const getWeatherCondition = (code: number): WeatherCondition => {
    const weatherCondition = setWeatherCondition(code);
    return weatherCondition;
}

export const getWeatherFlavor = (code: number) => {
    const weatherCondition = getWeatherCondition(code);
    return weatherFlavorByCondition[weatherCondition.condition] ?? weatherFlavorByCondition.Unknown;
}

export const getWeatherIcon = (code: number) => {
    const weatherCondition = getWeatherCondition(code);
    return weatherIconByKey[weatherCondition.icon] ?? weatherIconByKey.unknown;
}

const setWeatherCondition = (code: number): WeatherCondition => {
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