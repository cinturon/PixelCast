import { TemperatureUnit } from "../utils/weatherStructs";
import { THEMES, type Theme } from "../utils/themes";

type SettingsPanelProps = {
  theme: Theme;
  city: string;
  unit: TemperatureUnit;
  enableRainEffect: boolean;
  enableAmbientAudio: boolean;
  ambientAudioVolume: number;
  launchAtStartup: boolean;
  latitude: number;
  longitude: number;
  onEnableRainEffectChange: (enableRainEffect: boolean) => void;
  onEnableAmbientAudioChange: (enableAmbientAudio: boolean) => void;
  onAmbientAudioVolumeChange: (volume: number) => void;
  onLaunchAtStartupChange: (launchAtStartup: boolean) => void;
  onThemeChange: (theme: Theme) => void;
  onCityChange: (city: string) => void;
  onUnitChange: (unit: TemperatureUnit) => void;
  onSave: () => void | Promise<void>;
  onClose: () => void;
};

export default function SettingsPanel({
  theme,
  city,
  unit,
  latitude,
  longitude,
  enableRainEffect,
  enableAmbientAudio,
  ambientAudioVolume,
  launchAtStartup,
  onThemeChange,
  onCityChange,
  onUnitChange,
  onEnableRainEffectChange,
  onEnableAmbientAudioChange,
  onAmbientAudioVolumeChange,
  onLaunchAtStartupChange,
  onSave,
  onClose
}: SettingsPanelProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSave();
  };

  return (
    <aside className="settings-panel" aria-labelledby="settings-panel-title">
      <div className="settings-panel__header">
        <h2 id="settings-panel-title" className="ct-section-title">Settings</h2>
        <button type="button" onClick={onClose}>Close</button>
      </div>

      <form className="settings-panel__form" onSubmit={handleSubmit}>
      <div className="settings-panel__coordinate-row">
        <label className="settings-panel__field">
          Latitude: {latitude.toFixed(4)}
        </label>
        <label className="settings-panel__field">
          Longitude: {longitude.toFixed(4)}
        </label>
      </div>

      <label className="settings-panel__field">
        Theme
        <select value={theme} onChange={(e) => onThemeChange(e.target.value as Theme)}>
          {THEMES.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="settings-panel__field">
        City
        <input type="text" value={city} onChange={(e) => onCityChange(e.target.value)} />
      </label>

      <label className="settings-panel__field">
        Units
        <select value={unit} onChange={(e) => onUnitChange(e.target.value as TemperatureUnit)}>
          <option value="Fahrenheit">Fahrenheit</option>
          <option value="Celsius">Celsius</option>
        </select>
      </label>

      <label className="settings-panel__field">
        Enable Rain Effect
        <input type="checkbox" checked={enableRainEffect} onChange={(e) => onEnableRainEffectChange(e.target.checked)} />
      </label>

      <label className="settings-panel__field">
        Enable Ambient Audio
        <input
          type="checkbox"
          checked={enableAmbientAudio}
          onChange={(e) => onEnableAmbientAudioChange(e.target.checked)}
        />
      </label>

      <label className="settings-panel__field">
        Ambient Volume
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(ambientAudioVolume * 100)}
          disabled={!enableAmbientAudio}
          onChange={(e) => onAmbientAudioVolumeChange(Number(e.target.value) / 100)}
        />
      </label>

      <label className="settings-panel__field">
        Launch at login
        <input
          type="checkbox"
          checked={launchAtStartup}
          onChange={(e) => onLaunchAtStartupChange(e.target.checked)}
        />
      </label>

      <button type="submit">Save</button>
      </form>
    </aside>
  );
}