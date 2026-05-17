import ForecastRow from "./ForecastRow";
import { Forecast, TemperatureUnit } from "../App";

type ForecastPanelProps = {
    forecasts: Forecast[];
    unit: TemperatureUnit;
};

function ForecastPanel({ forecasts, unit }: ForecastPanelProps) {
    return (
        <div className="forecast-panel">
            <h2 className="ct-section-title">Forecast</h2>
            {forecasts.map((forecast) => (
                <ForecastRow key={forecast.date} {...forecast} unit={unit} />
            ))}
        </div>
    );
}

export default ForecastPanel;