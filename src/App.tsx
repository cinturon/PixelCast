import "./App.css";
import WeatherCard from "./components/WeatherCard";
import ForecastPanel from "./components/ForecastPanel";
import SettingsPanel from "./components/SettingsPanel";
import { SplashScreen } from "./components/SplashScreen";
import { RetroPanel } from "./components/RetroPanel";
import { useState, useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { RAINY_CONDITIONS } from "./conditions";
import { loadSettings, saveSettings } from "./utils/settings";
import { WeatherData, WeatherError, TemperatureUnit } from "./utils/weatherStructs";
import { loadDataFromCache, saveWeatherCache, isCacheExpired } from "./utils/cache";
import { callAPI } from "./api/http";
import { useKeyboardShortcuts, isModPlusKey, isTypingTarget } from "./hooks/useKeyboardShortcuts";
import { StatusBar } from "./components/StatusBar";


function App() {

  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(true);
  const [isSplashExiting, setIsSplashExiting] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<WeatherError>();

  const [data, setData] = useState<WeatherData>();

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const [unit, setUnit] = useState<TemperatureUnit>("Fahrenheit");
  const [city, setCity] = useState<string>("Seattle");
  const [latitude, setLatitude] = useState<number>(47.6062);
  const [longitude, setLongitude] = useState<number>(-122.3321);
  const [enableRainEffect, setEnableRainEffect] = useState<boolean>(true);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>();

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

  const refreshData = async () => {
    setLoading(true);
    try {
      await handleApiCall();
    } catch (error) {
      setError(error as WeatherError);
    } finally {
      setLoading(false);
    }
  };

  const shouldShowRainEffect = enableRainEffect
    && data?.current?.weatherCondition
    && RAINY_CONDITIONS.has(data?.current.weatherCondition);

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
    setLastRefreshTime(new Date());
    try {
      await saveWeatherCache(data);
    } catch (error) {
      console.warn("Failed to save weather cache", error);
    }
  };

  const handleLoadFromCache = async () => {
    const cache = await loadDataFromCache();
    setData(cache.data);

    if (isCacheExpired(cache.cachedAt)) {
      await handleApiCall();
    } else {
      setLastRefreshTime(new Date(cache.cachedAt));
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

  const handleRetry = async () => {
    await getSettings();
    await loadData();
  };

  const handleSplashScreenExit = () => {
    setTimeout(() => {
      setIsSplashExiting(true);
      setTimeout(() => {
        setShowSplashScreen(false);
      }, 600);
    }, 3000);
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await getSettings();
        await loadData();
      } finally {
        handleSplashScreenExit();
      }
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

  useKeyboardShortcuts((event: KeyboardEvent) => {

    // Ignore typing targets
    if (isTypingTarget(event)) {
      return;
    }

    // Refresh data
    if (isModPlusKey(event, "r")) {
      event.preventDefault();
      void refreshData();
      return;
    }

    // Open settings panel
    if (isModPlusKey(event, ",")) {
      event.preventDefault();
      setSettingsOpen(true);
      return;
    }

    // Close settings panel
    if (event.key === "Escape" && settingsOpen) {
      event.preventDefault();
      void handleCloseSettings();
      return;
    }

  }, [settingsOpen]);

  return (
    <main className="container">
      {showSplashScreen ? (
        <SplashScreen isExiting={isSplashExiting} />
      ) : null}
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
          <RetroPanel>
            <ForecastPanel forecasts={data?.forecasts ?? []} unit={unit} loading={loading} error={error} onRetry={handleRetry} />
          </RetroPanel>
        </div>

        <div className="column">
          <RetroPanel>
            <WeatherCard currentWeather={data?.current} unit={unit} loading={loading} error={error} onRetry={handleRetry} />
          </RetroPanel>
        </div>

      </div>
      <StatusBar loading={loading} refreshTime={lastRefreshTime} />
    </main>
  );
}

export default App;
