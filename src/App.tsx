import "./App.css";
import WeatherCard from "./components/WeatherCard";
import ForecastPanel from "./components/ForecastPanel";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { WeatherCondition, getWeatherCondition } from "./utils";

const ENABLE_RAIN_EFFECT = true;
const RAINY_CONDITIONS = new Set([
  "Drizzle",
  "Freezing drizzle",
  "Rain",
  "Freezing rain",
  "Rain showers",
  "Thunderstorm",
  "Thunderstorm with hail",
]);

export type WeatherDataResponse = {
  current: CurrentWeather;
  forecasts: Forecast[];
}

export type CurrentWeather = {
  temperature_2m: number;
  weather_code: number;
  precipitation: number;
  weather_condition: WeatherCondition;
}

export type Forecast = {
  date: string;
  highF: number;
  lowF: number;
  weather_code: number;
  weather_condition: WeatherCondition;
  rainChance: number;
}

export type WeatherError = {
  errorType: string;
  message: string;
}

export type TemperatureUnit = "fahrenheit" | "celsius";

function App() {

  const [data, setData] = useState<WeatherDataResponse>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<WeatherError>();

  const [unit, setUnit] = useState<TemperatureUnit>("fahrenheit");

  const [city] = useState<string>("Seattle");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await invoke<WeatherDataResponse>("get_data", { city });

      data.current.weather_condition = attachWeatherCondition(data.current.weather_code);
      data.forecasts.forEach(forecast => {
        forecast.weather_condition = attachWeatherCondition(forecast.weather_code);
      });

      setData(data);
    } catch (error) {
      setError(error as WeatherError);
    } finally {
      setLoading(false);
    }
  };

  const attachWeatherCondition = (code: number): WeatherCondition => {
    return getWeatherCondition(code);
  }

  const shouldShowRainEffect = ENABLE_RAIN_EFFECT
    && data?.current.weather_condition
    && RAINY_CONDITIONS.has(data.current.weather_condition.condition);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const unlistenPromise = listen<TemperatureUnit>(
      "temperature-unit-changed",
      (event) => {
        setUnit(event.payload);
      }
    );
    return () => {
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, []);

  return (
    <main className="container">
      {shouldShowRainEffect ? <div className="rain-effect" aria-hidden="true" /> : null}
      <header className="ct-header">
        <h1 className="ct-app-title">PixelCast</h1>
      </header>
      <div className="row">
        <div className="column">
          {loading ? (
            <p className="forecast-placeholder">Loading Forecast</p>
          ) : error ? (
            <div className="forecast-placeholder">
              <p>Error Loading Forecast: {error.errorType} - {error.message}</p>
              <button onClick={() => {
                loadData();
              }}>Retry</button>
            </div>
          ) : data?.forecasts ? (
            <ForecastPanel
              forecasts={data.forecasts}
              unit={unit}
            />
          ) : (
            <p className="forecast-placeholder">Loading Forecast</p>
          )}
        </div>

        <div className="column">{
          loading ? (
            <p className="weather-placeholder">Loading Current Weather</p>
          ) : error ? (
            <div className="weather-placeholder">
              <p>Error Loading Current Weather: {error.errorType} - {error.message}</p>
              <button onClick={() => {
                loadData();
              }}>Retry</button>
            </div>
          ) : data?.current ? (
            <WeatherCard
              currentWeather={data.current}
              unit={unit}
            />
          ) : (
            <p className="weather-placeholder">Loading Current Weather</p>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
