import { FullCurrentWeather } from "../App";

export type WeatherCardProps = {
  city: string;
  fullCurrentWeather: FullCurrentWeather;
};

function WeatherCard({ city, fullCurrentWeather }: WeatherCardProps) {
  return (
    <div className="weather-card">
      <h2 className="ct-section-title">{city}</h2>
      <div className="weather-stats">
        <img
          className="weather-stat__icon weather-stat__icon--large"
          src={fullCurrentWeather.weather_icon}
          alt={`${fullCurrentWeather.weather_condition} icon`}
        />
        <p className="weather-flavor">{fullCurrentWeather.weather_flavor}</p>
        <div className="weather-stat">
          <span className="weather-stat__label">Temperature</span>
          <span className="weather-stat__value">{fullCurrentWeather.temperature_2m}°F</span>
        </div>
        <div className="weather-stat">
          <span className="weather-stat__label">Condition</span>
          <span className="weather-stat__value weather-stat__value--condition">
            {fullCurrentWeather.weather_condition}
          </span>
        </div>
        <div className="weather-stat">
          <span className="weather-stat__label">Rain</span>
          <span className="weather-stat__value">{fullCurrentWeather.precipitation}%</span>
        </div>
      </div>
    </div >
  );
}

export default WeatherCard;
