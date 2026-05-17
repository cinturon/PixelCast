import "./App.css";
import WeatherCard from "./components/WeatherCard";
import ForecastPanel from "./components/ForecastPanel";
import SettingsPanel from "./components/SettingsPanel";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { WeatherCondition, getWeatherCondition } from "./utils";
import { RAINY_CONDITIONS } from "./conditions";



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
  const [city, setCity] = useState<string>("Seattle");

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [enableRainEffect, setEnableRainEffect] = useState<boolean>(true);

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

  const shouldShowRainEffect = enableRainEffect
    && data?.current.weather_condition
    && RAINY_CONDITIONS.has(data.current.weather_condition.condition);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const unlistenPromise = listen<string>(
      "settings_clicked",
      () => {
        setSettingsOpen(true);
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
        <h2 className="ct-city-title">{city}</h2>
      </header>
      {settingsOpen ? (
        <SettingsPanel 
        city={city}
        unit={unit}
        onCityChange={setCity}
        onUnitChange={setUnit}
        enableRainEffect={enableRainEffect}
        onEnableRainEffectChange={setEnableRainEffect}
        onSave={() => {
          loadData();
          setSettingsOpen(false);
        }}  
        onClose={() => setSettingsOpen(false)} />
      ) : null}
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
