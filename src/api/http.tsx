import { WeatherData } from "../utils/weatherStructs";
import type { GeoLocationResponse } from "../utils/geoLocationStructs";
import { invoke } from "@tauri-apps/api/core";

export const callAPI = async () => {
    const data = await invoke<WeatherData>("get_data");
    return data;
}

export const getGeolocationResponseLatandLong = async (city: string) => {
    const response = await invoke<GeoLocationResponse>("get_long_and_lat", { city });
    const first = response.results[0];
    if (!first) {
        throw new Error(`No location found for "${city}"`);
    }
    return { latitude: first.latitude, longitude: first.longitude };
};

