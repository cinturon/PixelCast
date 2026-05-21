import { WeatherData } from "./weatherStructs";
import { toWeatherError } from "./errors";
import { invoke } from "@tauri-apps/api/core";

export type WeatherCache = {
  data: WeatherData;
  cachedAt: Date;
};

export const saveWeatherCache = async (data: WeatherData) => {
  try {
    await invoke("save_weather_cache", { weatherDataResponse: data });
  } catch (error) {
    throw toWeatherError(error);
  }
};

export const loadDataFromCache = async () => {
  try {
    return await invoke<WeatherCache>("load_weather_cache");
  } catch (error) {
    throw toWeatherError(error);
  }
};

export const isCacheExpired = (cachedAt: Date, now = new Date()) => {
  return new Date(cachedAt) < new Date(now.getTime() - 1000 * 60 * 60 * 1);
};
