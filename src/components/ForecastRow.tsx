export type ForecastRowProps = {
    date: string;
    highF: number;
    lowF: number;
    condition: string;
    rainChance: number;
}

function ForecastRow({ date, highF, lowF, condition, rainChance }: ForecastRowProps) {
    return (
        <div className="forecast-row">
            <span className="forecast-row__day">{date}</span>
            <span className="forecast-row__temps">
                {highF}°F / {lowF}°F
            </span>
            <span className="forecast-row__condition">{condition}</span>
            <span className="forecast-row__rain">{rainChance}%</span>
        </div>
    );
}

export default ForecastRow;