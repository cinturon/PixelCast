import "./App.css";
import WeatherCard from "./components/WeatherCard";
import ForecastPanel from "./components/ForecastPanel";
import SettingsPanel from "./components/SettingsPanel";
import { useState, useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { RAINY_CONDITIONS } from "./conditions";
import { loadSettings, saveSettings } from "./utils/settings";
import { getWeatherCondition } from "./api/data";
import { WeatherDataResponse, WeatherError, TemperatureUnit } from "./utils/weatherStructs";
import { loadDataFromCache, saveWeatherCache } from "./utils/cache";
import { callAPI } from "./api/http";


function App() {

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<WeatherError>();

  const [data, setData] = useState<WeatherDataResponse>();

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const [unit, setUnit] = useState<TemperatureUnit>("Fahrenheit");
  const [city, setCity] = useState<string>("Seattle");
  const [latitude, setLatitude] = useState<number>(47.6062);
  const [longitude, setLongitude] = useState<number>(-122.3321);
  const [enableRainEffect, setEnableRainEffect] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);

    try {
      await handleLoadFromCache();
    } catch (error) {
      try {
        await handleApiCall();
      } catch (error) {
        setError(error as WeatherError);
      } finally {
        setLoading(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const shouldShowRainEffect = enableRainEffect
    && data?.current.weather_code
    && RAINY_CONDITIONS.has(getWeatherCondition(data?.current.weather_code).condition);

  const getSettings = async () => {
    const settings = await loadSettings();
    setCity(settings.city);
    setUnit(settings.temperatureUnit);
    setLatitude(settings.latitude);
    setLongitude(settings.longitude);
    setEnableRainEffect(settings.enableRainEffect);
  };

  const handleApiCall = async () => {
    const data = await callAPI();
    setData(data);
    try {
      await saveWeatherCache(data);
    } catch (error) {
      console.warn("Failed to save weather cache", error);
    }
  };

  const handleLoadFromCache = async () => {
    const cache = await loadDataFromCache();
    setData(cache.data);

    if (cache.cachedAt && new Date(cache.cachedAt) < new Date(Date.now() - 1000 * 60 * 60 * 24)) {
      await handleApiCall();
    }
  };

  const handleSaveSettings = async () => {
    await saveSettings({
      city,
      temperatureUnit: unit,
      latitude,
      longitude,
      enableRainEffect,
    });

    setSettingsOpen(false);
    await loadData();
  };

  const handleCloseSettings = async () => {
    await getSettings();
    setSettingsOpen(false);
  };

  useEffect(() => {
    const initializeApp = async () => {

      await getSettings();
      await loadData();
    };

    initializeApp();
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
          latitude={latitude}
          longitude={longitude}
          onCityChange={setCity}
          onUnitChange={setUnit}
          enableRainEffect={enableRainEffect}
          onEnableRainEffectChange={setEnableRainEffect}
          onSave={handleSaveSettings}
          onClose={handleCloseSettings}
        />
      ) : null}
      <div className="row">
        <div className="column">
          {loading ? (
            <p className="forecast-placeholder">Loading Forecast</p>
          ) : error ? (
            <div className="forecast-placeholder">
              <p>Error Loading Forecast: {error.errorType} - {error.message}</p>
              <button onClick={() => {
                getSettings();
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
