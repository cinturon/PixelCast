import { CurrentWeather } from "../App";
import { weatherFlavorByCondition, weatherIconByKey } from "../utils";

export type WeatherCardProps = {
  currentWeather: CurrentWeather;
};

const getWeatherFlavor = (condition: string) => {
  return weatherFlavorByCondition[condition] ?? weatherFlavorByCondition.Unknown;
}

function WeatherCard({ currentWeather }: WeatherCardProps) {
  return (
    <div className="weather-card">
      <h2 className="ct-section-title">Today's Weather</h2>
      <div className="weather-stats">
        <img
          className="weather-stat__icon weather-stat__icon--large"
          src={weatherIconByKey[currentWeather.weather_condition.icon] ?? weatherIconByKey.unknown}
          alt={`${currentWeather.weather_condition.condition}`}
        />
        <p className="weather-flavor">{getWeatherFlavor(currentWeather.weather_condition.condition)}</p>
        <div className="weather-stat">
          <span className="weather-stat__label">Temperature</span>
          <span className="weather-stat__value">{currentWeather.temperature_2m}°F</span>
        </div>
        <div className="weather-stat">
          <span className="weather-stat__label">Condition</span>
          <span className="weather-stat__value weather-stat__value--condition">
            {currentWeather.weather_condition.condition}
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
