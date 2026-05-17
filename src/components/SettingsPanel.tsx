import { TemperatureUnit } from "../App";

type SettingsPanelProps = {
  city: string;
  unit: TemperatureUnit;
  enableRainEffect: boolean;
  latitude: number;
  longitude: number;
  onEnableRainEffectChange: (enableRainEffect: boolean) => void;
  onCityChange: (city: string) => void;
  onUnitChange: (unit: TemperatureUnit) => void;
  onSave: () => void;
  onClose: () => void;
};

export default function SettingsPanel({
  city,
  unit,
  latitude,
  longitude,
  enableRainEffect,
  onCityChange,
  onUnitChange,
  onEnableRainEffectChange,
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
          <option value="fahrenheit">Fahrenheit</option>
          <option value="celsius">Celsius</option>
        </select>
      </label>

      <label className="settings-panel__field">
        Enable Rain Effect
        <input type="checkbox" checked={enableRainEffect} onChange={(e) => onEnableRainEffectChange(e.target.checked)} />
      </label>

      <button type="button" onClick={onSave}>Save</button>
    </aside>
  );
}