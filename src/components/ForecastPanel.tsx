import ForecastRow from "./ForecastRow";
import { Forecast } from "../App";


function ForecastPanel({ forecasts }: { forecasts: Forecast[] }){
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