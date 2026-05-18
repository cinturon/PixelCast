import { WeatherDataResponse } from "../utils/weatherStructs";
import { invoke } from "@tauri-apps/api/core";

export const callAPI = async () => {
    const data = await invoke<WeatherDataResponse>("get_data");
    return data;
}