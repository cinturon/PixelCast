import { invoke } from "@tauri-apps/api/core";
import { toWeatherError } from "./errors";
import type { Theme } from "./themes";

export type Settings = {
  theme: Theme;
  city: string;
  temperatureUnit: "Fahrenheit" | "Celsius";
  latitude: number;
  longitude: number;
  enableRainEffect: boolean;
  launchAtStartup: boolean;
};

export const saveSettings = async (settings: Settings) => {
  try {
    await invoke("save_settings", { settings });
  } catch (error) {
    throw toWeatherError(error);
  }
};

export const loadSettings = async () => {
  try {
    return await invoke<Settings>("load_settings");
  } catch (error) {
    throw toWeatherError(error);
  }
};
