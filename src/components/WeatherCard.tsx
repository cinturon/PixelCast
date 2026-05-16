export type WeatherCardProps = {
  city: string;
  temperatureF: number;
  condition: string;
  rainChance: number;
};

function WeatherCard({ city, temperatureF, condition, rainChance }: WeatherCardProps) {
  return (
    <div>
      <h1>{city}</h1>
      <p>Temperature: {temperatureF}°F</p>
      <p>Condition: {condition}</p>
      <p>Rain Chance: {rainChance}%</p>
    </div>
  );
}

export default WeatherCard;
