import { TemperatureUnit, CurrentWeatherData } from "../utils/weatherStructs";
import { getWeatherIcon  } from "../api/data";
import { formatTemperature } from "../utils/utils";

export type WeatherCardProps = {
  currentWeather: CurrentWeatherData;
  unit: TemperatureUnit;
};

function WeatherCard({ currentWeather, unit }: WeatherCardProps) {
  return (
    <div className="weather-card">
      <h2 className="ct-section-title">Today's Weather</h2>
      <div className="weather-stats">
        <img
          className="weather-stat__icon weather-stat__icon--large"
          src={getWeatherIcon(currentWeather.weatherCondition)}
          alt={currentWeather.weatherCondition}
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
    </div >
  );
}

export default WeatherCard;
