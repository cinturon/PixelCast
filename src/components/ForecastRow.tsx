import { getWeatherIcon } from "../utils/images";
import { Forecast, TemperatureUnit } from "../utils/weatherStructs";
import { formatTemperature } from "../utils/utils";
import { PixelIcon } from "./PixelIcon";

const formatForecastDate = (date: string) => {
    const parsedDate = new Date(`${date}T00:00:00`);

    return parsedDate.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
};

function ForecastRow({ forecast, unit }: { forecast: Forecast, unit: TemperatureUnit }) {
    return (
        <div className="forecast-row">
            <span className="forecast-row__day">{formatForecastDate(forecast.date)}</span>
            <PixelIcon
                className="forecast-row__icon"
                icon={getWeatherIcon(forecast.weatherCondition)}
                condition={forecast.weatherCondition}
            />
            <span className="forecast-row__temps">
                <span className="forecast-row__temp-label">Temp</span>
                <span className="forecast-row__temp-values">
                    {formatTemperature(forecast.highF, unit)}
                    <span className="forecast-row__temp-divider">/</span>
                    {formatTemperature(forecast.lowF, unit)}
                </span>
            </span>
            <span className="forecast-row__condition">{forecast.weatherCondition}</span>
            <span className="forecast-row__rain">
                <span className="forecast-row__rain-label">Rain</span>
                {forecast.rainChance}%
            </span>
        </div>
    );
}

export default ForecastRow;