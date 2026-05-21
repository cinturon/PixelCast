/** Tracks shipped under `public/audio/`. Add filenames here when adding new files. */
export const AUDIO_TRACKS = [
  { id: "pixel-drift-garden", file: "Pixel Drift Garden.mp3", label: "Pixel Drift Garden" },
  { id: "crimson-gear-meadow", file: "Crimson Gear Meadow.mp3", label: "Crimson Gear Meadow" },
  { id: "mossy-star-path", file: "Mossy Star Path.mp3", label: "Mossy Star Path" },
  { id: "lavender-map", file: "Lavender Map.mp3", label: "Lavender Map" },
] as const;

export type AudioTrackId = (typeof AUDIO_TRACKS)[number]["id"];

const audioFileById = Object.fromEntries(
  AUDIO_TRACKS.map((track) => [track.id, track.file]),
) as Record<AudioTrackId, string>;

/** Vite serves `public/audio/` at `/audio/`. */
export function getAudioSrc(filename: string): string {
  return `/audio/${encodeURIComponent(filename)}`;
}

export function getAudioFileForTrackId(trackId: AudioTrackId): string {
  return audioFileById[trackId];
}

const CLEAR_CONDITIONS = new Set(["Clear sky", "Mainly clear"]);
const CLOUDY_CONDITIONS = new Set(["Partly cloudy", "Overcast", "Fog"]);
const RAINY_AUDIO_TRACK: AudioTrackId = "lavender-map";
const SNOWY_CONDITIONS = new Set([
  "Snow fall",
  "Snow grains",
  "Snow showers",
  "Freezing drizzle",
  "Freezing rain",
]);
const STORM_CONDITIONS = new Set(["Thunderstorm", "Thunderstorm with hail"]);

/**
 * Pick an ambient loop for the current weather, or `null` when idle.
 * Rainy weather uses the calm rain bed; other groups get their own track.
 */
export function getAmbientTrackForCondition(
  condition: string | undefined,
): AudioTrackId | null {
  if (!condition) {
    return null;
  }

  if (CLEAR_CONDITIONS.has(condition)) {
    return "pixel-drift-garden";
  }
  if (CLOUDY_CONDITIONS.has(condition)) {
    return "mossy-star-path";
  }
  if (SNOWY_CONDITIONS.has(condition)) {
    return "crimson-gear-meadow";
  }
  if (STORM_CONDITIONS.has(condition)) {
    return "crimson-gear-meadow";
  }
  if (
    condition === "Drizzle" ||
    condition === "Rain" ||
    condition === "Rain showers"
  ) {
    return RAINY_AUDIO_TRACK;
  }

  return "lavender-map";
}

export function getAmbientAudioFileForCondition(
  condition: string | undefined,
): string | null {
  const trackId = getAmbientTrackForCondition(condition);
  return trackId ? getAudioFileForTrackId(trackId) : null;
}
