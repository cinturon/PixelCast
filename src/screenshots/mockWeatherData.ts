import { WeatherData } from "../utils/weatherStructs";

export const mockWeatherData: WeatherData = {
  current: {
    temperature2m: 58,
    weatherCode: 2,
    precipitation: 22,
    weatherCondition: "Partly cloudy",
    weatherFlavor: "The sun hides behind a veil. Something stirs in the distance.",
  },
  forecasts: [
    { date: "2026-05-18", highF: 62, lowF: 48, weatherCode: 2, rainChance: 25, weatherCondition: "Partly cloudy" },
    { date: "2026-05-19", highF: 65, lowF: 50, weatherCode: 1, rainChance: 10, weatherCondition: "Mainly clear" },
    { date: "2026-05-20", highF: 59, lowF: 47, weatherCode: 61, rainChance: 70, weatherCondition: "Rain" },
    { date: "2026-05-21", highF: 61, lowF: 49, weatherCode: 3, rainChance: 35, weatherCondition: "Overcast" },
    { date: "2026-05-22", highF: 68, lowF: 52, weatherCode: 0, rainChance: 5, weatherCondition: "Clear sky" },
    { date: "2026-05-23", highF: 70, lowF: 54, weatherCode: 1, rainChance: 8, weatherCondition: "Mainly clear" },
    { date: "2026-05-24", highF: 66, lowF: 51, weatherCode: 2, rainChance: 20, weatherCondition: "Partly cloudy" },
  ],
};

export const screenshotRefreshTime = new Date("2026-05-18T14:30:00");
