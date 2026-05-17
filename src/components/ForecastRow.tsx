import { weatherIconByKey } from "../utils";
import { Forecast } from "../App";


const formatForecastDate = (date: string) => {
    const parsedDate = new Date(`${date}T00:00:00`);

    return parsedDate.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

function ForecastRow({ date, highF, lowF, weather_condition, rainChance }: Forecast) {
    return (
        <div className="forecast-row">
            <span className="forecast-row__day">{formatForecastDate(date)}</span>
            <img
                className="forecast-row__icon"
                src={weatherIconByKey[weather_condition.icon]}
                alt={`${weather_condition.condition}`}
            />
            <span className="forecast-row__temps">
                <span className="forecast-row__temp-label">Temp</span>
                <span className="forecast-row__temp-values">
                    {Math.round(highF)}°
                    <span className="forecast-row__temp-divider">/</span>
                    {Math.round(lowF)}°
                </span>
            </span>
            <span className="forecast-row__condition">{weather_condition.condition}</span>
            <span className="forecast-row__rain">
                <span className="forecast-row__rain-label">Rain</span>
                {rainChance}%
            </span>
        </div>
    );
}

export default ForecastRow;