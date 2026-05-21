import { WeatherData } from "../utils/weatherStructs";
import type { GeoLocationResponse } from "../utils/geoLocationStructs";
import { toWeatherError } from "../utils/errors";
import { invoke } from "@tauri-apps/api/core";

export const callAPI = async (): Promise<WeatherData> => {
  try {
    return await invoke<WeatherData>("get_data");
  } catch (error) {
    throw toWeatherError(error);
  }
};

export const getGeolocationResponseLatandLong = async (city: string) => {
  try {
    const response = await invoke<GeoLocationResponse>("get_long_and_lat", { city });
    const first = response.results[0];
    if (!first) {
      throw new Error(`No location found for "${city}"`);
    }
    return { latitude: first.latitude, longitude: first.longitude };
  } catch (error) {
    throw toWeatherError(error);
  }
};
