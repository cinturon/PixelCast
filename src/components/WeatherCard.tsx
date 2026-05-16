export type WeatherCardProps = {
  city: string;
  temperatureF: number;
  condition: string;
  rainChance: number;
};

function WeatherCard({ city, temperatureF, condition, rainChance }: WeatherCardProps) {
  return (
    <div className="weather-card">
      <h2 className="ct-section-title">{city}</h2>
      <div className="weather-stats">
        <div className="weather-stat">
          <span className="weather-stat__label">Temperature</span>
          <span className="weather-stat__value">{temperatureF}°F</span>
        </div>
        <div className="weather-stat">
          <span className="weather-stat__label">Condition</span>
          <span className="weather-stat__value">{condition}</span>
        </div>
        <div className="weather-stat">
          <span className="weather-stat__label">Rain</span>
          <span className="weather-stat__value">{rainChance}%</span>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
