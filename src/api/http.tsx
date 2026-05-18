import { WeatherData } from "../utils/weatherStructs";
import { invoke } from "@tauri-apps/api/core";

export const callAPI = async () => {
    const data = await invoke<WeatherData>("get_data");
    return data;
}