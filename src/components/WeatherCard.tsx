import { TemperatureUnit, CurrentWeather } from "../utils/weatherStructs";
import { getWeatherIcon, getWeatherFlavor, getWeatherCondition } from "../api/data";
import { formatTemperature } from "../utils/utils";

export type WeatherCardProps = {
  currentWeather: CurrentWeather;
  unit: TemperatureUnit;
};

function WeatherCard({ currentWeather, unit }: WeatherCardProps) {
  return (
    <div className="weather-card">
      <h2 className="ct-section-title">Today's Weather</h2>
      <div className="weather-stats">
        <img
          className="weather-stat__icon weather-stat__icon--large"
          src={getWeatherIcon(currentWeather.weather_code)}
          alt={`${getWeatherCondition(currentWeather.weather_code).condition}`}
        />
        <p className="weather-flavor">{getWeatherFlavor(currentWeather.weather_code)}</p>
        <div className="weather-stat">
          <span className="weather-stat__label">Temperature</span>
          <span className="weather-stat__value">{formatTemperature(currentWeather.temperature_2m, unit)}</span>
        </div>
        <div className="weather-stat">
          <span className="weather-stat__label">Condition</span>
          <span className="weather-stat__value weather-stat__value--condition">
            {getWeatherCondition(currentWeather.weather_code).condition}
          </span>
        </div>
        <div className="weather-stat">
          <span className="weather-stat__label">Rain</span>
          <span className="weather-stat__value">{currentWeather.precipitation}%</span>
        </div>
      </div>
    </div >
  );
}

export default WeatherCard;
