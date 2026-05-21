import { TemperatureUnit } from "./weatherStructs";

export const formatTemperature = (valueF: number, unit: TemperatureUnit) => {
    if (unit === "Celsius") {
        return `${Math.round((valueF - 32) * 5 / 9)}°C`;
    }
    return `${Math.round(valueF)}°F`;
}