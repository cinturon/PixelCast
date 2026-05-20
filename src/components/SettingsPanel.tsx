import { TemperatureUnit } from "../utils/weatherStructs";

type SettingsPanelProps = {
  city: string;
  unit: TemperatureUnit;
  enableRainEffect: boolean;
  launchAtStartup: boolean;
  latitude: number;
  longitude: number;
  onEnableRainEffectChange: (enableRainEffect: boolean) => void;
  onLaunchAtStartupChange: (launchAtStartup: boolean) => void;
  onCityChange: (city: string) => void;
  onUnitChange: (unit: TemperatureUnit) => void;
  onSave: () => void | Promise<void>;
  onClose: () => void;
};

export default function SettingsPanel({
  city,
  unit,
  latitude,
  longitude,
  enableRainEffect,
  launchAtStartup,
  onCityChange,
  onUnitChange,
  onEnableRainEffectChange,
  onLaunchAtStartupChange,
  onSave,
  onClose
}: SettingsPanelProps) {
  return (
    <aside className="settings-panel" aria-labelledby="settings-panel-title">
      <div className="settings-panel__header">
        <h2 id="settings-panel-title" className="ct-section-title">Settings</h2>
        <button type="button" onClick={onClose}>Close</button>
      </div>

      <div className="settings-panel__coordinate-row">
        <label className="settings-panel__field">
          Latitude: {latitude.toFixed(4)}
        </label>
        <label className="settings-panel__field">
          Longitude: {longitude.toFixed(4)}
        </label>
      </div>

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
        Launch at login
        <input
          type="checkbox"
          checked={launchAtStartup}
          onChange={(e) => onLaunchAtStartupChange(e.target.checked)}
        />
      </label>

      <button type="button" onClick={onSave}>Save</button>
    </aside>
  );
}