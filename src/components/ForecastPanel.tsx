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
        <div>
            <h1>Forecast</h1>
            {forecasts.map((forecast) => (
                <ForecastRow key={forecast.date} {...forecast} />
            ))}
        </div>
    );
}

export default ForecastPanel;