export type ForecastRowProps = {
    date: string;
    highF: number;
    lowF: number;
    weather_condition: string;
    rainChance: number;
}

function ForecastRow({ date, highF, lowF, weather_condition, rainChance }: ForecastRowProps) {
    return (
        <div className="forecast-row">
            <span className="forecast-row__day">{date}</span>
            <span className="forecast-row__temps">
                {highF}°F / {lowF}°F
            </span>
            <span className="forecast-row__condition">{weather_condition}</span>
            <span className="forecast-row__rain">{rainChance}%</span>
        </div>
    );
}

export default ForecastRow;