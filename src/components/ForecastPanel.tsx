import ForecastRow from "./ForecastRow";

export type ForecastPanelProps = {
    forecasts: {
        date: string;
        highF: number;
        lowF: number;
        condition: string;
        rainChance: number;
    }[];
}


function ForecastPanel({ forecasts }: ForecastPanelProps){
    return (
        <div className="forecast-panel">
            <h2 className="ct-section-title">Forecast</h2>
            {forecasts.map((forecast) => (
                <ForecastRow key={forecast.date} {...forecast} />
            ))}
        </div>
    );
}

export default ForecastPanel;