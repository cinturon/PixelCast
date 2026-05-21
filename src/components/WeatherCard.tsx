import { TemperatureUnit, CurrentWeatherData, WeatherError } from "../utils/weatherStructs";
import { getWeatherIcon } from "../api/data";
import { formatTemperature } from "../utils/utils";
import { PixelIcon } from "./PixelIcon";

export type WeatherCardProps = {
  currentWeather?: CurrentWeatherData;
  unit: TemperatureUnit;
  loading: boolean;
  error?: WeatherError;
  onRetry: () => void;
};

function WeatherCard({ currentWeather, unit, loading, error, onRetry }: WeatherCardProps) {
  return (
    loading ? (
      <p className="weather-placeholder">Loading Current Weather</p>
    ) : error ? (
      <div className="weather-placeholder">
        <p>Error Loading Current Weather: {error.errorType} - {error.message}</p>
        <button type="button" onClick={onRetry}>Retry</button>
      </div>
    ) : currentWeather ? (
      <div className="weather-card">
        <h2 className="ct-section-title">Current Weather</h2>
        <div className="weather-stats">
          <PixelIcon
            className="weather-stat__icon weather-stat__icon--large"
            icon={getWeatherIcon(currentWeather.weatherCondition)}
            condition={currentWeather.weatherCondition}
          />
          <p className="weather-flavor">{currentWeather.weatherFlavor}</p>
          <div className="weather-stat">
            <span className="weather-stat__label">Temperature</span>
            <span className="weather-stat__value">{formatTemperature(currentWeather.temperature2m, unit)}</span>
          </div>
          <div className="weather-stat">
            <span className="weather-stat__label">Condition</span>
            <span className="weather-stat__value weather-stat__value--condition">
              {currentWeather.weatherCondition}
            </span>
          </div>
          <div className="weather-stat">
            <span className="weather-stat__label">Rain</span>
            <span className="weather-stat__value">{currentWeather.precipitation}%</span>
          </div>
        </div>
      </div>
    ) : (
      <p className="weather-placeholder">Loading Current Weather</p>
    )
  );
}

export default WeatherCard;
