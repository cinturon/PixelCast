import { WeatherData } from "./weatherStructs";
import { invoke } from "@tauri-apps/api/core";

export type WeatherCache = {
    data: WeatherData;
    cachedAt: Date;
}

export const saveWeatherCache = async (data: WeatherData) => {
    await invoke("save_weather_cache", {
        weatherDataResponse: data,
      });
    }


export const loadDataFromCache = async () => {
    const cache = await invoke<WeatherCache>("load_weather_cache");
    return cache;
}

export const isCacheExpired = (cachedAt: Date, now = new Date()) => {
    return new Date(cachedAt) < new Date(now.getTime() - 1000 * 60 * 60 * 1);
}