import ForecastRow from "./ForecastRow";
import { Forecast, TemperatureUnit, WeatherError } from "../utils/weatherStructs";

type ForecastPanelProps = {
    forecasts: Forecast[];
    unit: TemperatureUnit;
    error?: WeatherError;
    loading: boolean;
    onRetry: () => void;
};

function ForecastPanel({ forecasts, unit, loading, error, onRetry }: ForecastPanelProps) {
    return (
        loading ? (
            <p className="weather-placeholder">Loading Current Forecast</p>
          ) :
        error ? (
            <div className="forecast-placeholder">
              <p>Error Loading Forecast: {error.errorType} - {error.message}</p>
              <button onClick={() => {
                onRetry();
              }}>Retry</button>
            </div>
          ) : (
        <div className="forecast-panel">
            <h2 className="ct-section-title">Forecast</h2>
            <div className="forecast-panel__list">
              {forecasts.map((forecast) => (
                <ForecastRow key={forecast.date} forecast={forecast} unit={unit} />
              ))}
            </div>
        </div>
    ))
}

export default ForecastPanel;