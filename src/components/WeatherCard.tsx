export type WeatherCardProps = {
  city: string;
  temperature: number;
  weather_code: number;
  precipitation: number;
};

function WeatherCard({ city, temperature, weather_code, precipitation }: WeatherCardProps) {
  return (
    <div className="weather-card">
      <h2 className="ct-section-title">{city}</h2>
      <div className="weather-stats">
        <div className="weather-stat">
          <span className="weather-stat__label">Temperature</span>
          <span className="weather-stat__value">{temperature}°F</span>
        </div>
        <div className="weather-stat">
          <span className="weather-stat__label">Condition</span>
          <span className="weather-stat__value">{weather_code}</span>
        </div>
        <div className="weather-stat">
          <span className="weather-stat__label">Rain</span>
          <span className="weather-stat__value">{precipitation}%</span>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
