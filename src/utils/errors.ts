import type { WeatherError } from "./weatherStructs";

export function toWeatherError(error: unknown): WeatherError {
  const message = error instanceof Error ? error.message : String(error);
  const errorType = message.toLowerCase().includes("filesystem")
    ? "Filesystem"
    : "API";
  return { errorType, message };
}
