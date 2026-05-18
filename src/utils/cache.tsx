import { WeatherDataResponse } from "./weatherStructs";
import { invoke } from "@tauri-apps/api/core";

export type WeatherCache = {
    data: WeatherDataResponse;
    cachedAt: Date;
}

export const saveWeatherCache = async (data: WeatherDataResponse) => {
    await invoke("save_weather_cache", {
        weatherDataResponse: data,
      });}


export const loadDataFromCache = async () => {
    const cache = await invoke<WeatherCache>("load_weather_cache");
    return cache;
}