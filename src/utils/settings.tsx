import { invoke } from "@tauri-apps/api/core";

export type Settings = {
  city: string;
  temperatureUnit: "Fahrenheit" | "Celsius";
  latitude: number;
  longitude: number;
  enableRainEffect: boolean;
}

export const saveSettings = async (settings: Settings) => {
  await invoke("save_settings", {
    settings
  });
}

export const loadSettings = async () => {
  const settings = await invoke<Settings>("load_settings");
  return settings;
}