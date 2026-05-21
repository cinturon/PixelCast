import "./App.css";
import WeatherCard from "./components/WeatherCard";
import ForecastPanel from "./components/ForecastPanel";
import SettingsPanel from "./components/SettingsPanel";
import { SplashScreen } from "./components/SplashScreen";
import { RetroPanel } from "./components/RetroPanel";
import { About } from "./components/About";
import { useState, useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { RAINY_CONDITIONS } from "./conditions";
import { loadSettings, saveSettings } from "./utils/settings";
import { WeatherData, WeatherError, TemperatureUnit } from "./utils/weatherStructs";
import { toWeatherError } from "./utils/errors";
import { loadDataFromCache, saveWeatherCache, isCacheExpired, WEATHER_REFRESH_INTERVAL_MS } from "./utils/cache";
import { callAPI, getGeolocationResponseLatandLong } from "./api/http";
import { useKeyboardShortcuts, isModPlusKey, isTypingTarget } from "./hooks/useKeyboardShortcuts";
import { StatusBar } from "./components/StatusBar";
import { applyTheme, DEFAULT_THEME, isTheme, type Theme } from "./utils/themes";
import { getAmbientAudioFileForCondition } from "./utils/audio";
import { useAmbientAudio } from "./hooks/useAmbientAudio";

const DEFAULT_AMBIENT_VOLUME = 0.10;

function App() {

  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(true);
  const [isSplashExiting, setIsSplashExiting] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<WeatherError>();

  const [data, setData] = useState<WeatherData>();

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);

  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [unit, setUnit] = useState<TemperatureUnit>("Fahrenheit");
  const [city, setCity] = useState<string>("Seattle");
  const [latitude, setLatitude] = useState<number>(47.6062);
  const [longitude, setLongitude] = useState<number>(-122.3321);
  const [enableRainEffect, setEnableRainEffect] = useState<boolean>(true);
  const [enableAmbientAudio, setEnableAmbientAudio] = useState<boolean>(false);
  const [ambientAudioVolume, setAmbientAudioVolume] = useState<number>(DEFAULT_AMBIENT_VOLUME);
  const [launchAtStartup, setLaunchAtStartup] = useState<boolean>(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>();

  const loadData = async () => {
    setLoading(true);
    setError(undefined);

    try {
      await handleLoadFromCache();
    } catch {
      try {
        await handleApiCall();
      } catch (error) {
        setError(toWeatherError(error));
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    setError(undefined);
    try {
      await handleApiCall();
    } catch (error) {
      setError(toWeatherError(error));
    } finally {
      setLoading(false);
    }
  };

  const silentRefreshData = async () => {
    setError(undefined);
    try {
      await handleApiCall();
    } catch (error) {
      setError(toWeatherError(error));
    }
  };

  const weatherCondition = data?.current?.weatherCondition;

  const shouldShowRainEffect = enableRainEffect
    && weatherCondition
    && RAINY_CONDITIONS.has(weatherCondition);

  const ambientAudioFile = getAmbientAudioFileForCondition(weatherCondition);

  useAmbientAudio({
    enabled: enableAmbientAudio,
    volume: ambientAudioVolume,
    audioFile: ambientAudioFile,
  });

  const getSettings = async () => {
    const settings = await loadSettings();
    const nextTheme = isTheme(settings.theme) ? settings.theme : DEFAULT_THEME;
    setTheme(nextTheme);
    setCity(settings.city);
    setUnit(settings.temperatureUnit);
    setLatitude(settings.latitude);
    setLongitude(settings.longitude);
    setEnableRainEffect(settings.enableRainEffect);
    setLaunchAtStartup(settings.launchAtStartup);
  };

  const handleApiCall = async () => {
    const data = await callAPI();
    setData(data);
    setError(undefined);
    setLastRefreshTime(new Date());
    try {
      await saveWeatherCache(data);
    } catch (error) {
      setError(toWeatherError(error));
    }
  };

  const handleLoadFromCache = async () => {
    const cache = await loadDataFromCache();
    setData(cache.data);

    if (isCacheExpired(cache.cachedAt)) {
      try {
        await handleApiCall();
      } catch (error) {
        setError(toWeatherError(error));
      }
    } else {
      setLastRefreshTime(new Date(cache.cachedAt));
    }
  };

  const handleSaveSettings = async () => {

    try {
      const { latitude, longitude } = await getGeolocationResponseLatandLong(city);
      setLatitude(latitude);
      setLongitude(longitude);

      await saveSettings({
        theme,
        city,
        temperatureUnit: unit,
        latitude,
        longitude,
        enableRainEffect,
        enableAmbientAudio,
        ambientAudioVolume,
        launchAtStartup,
      });

      setSettingsOpen(false);
      await refreshData();
    } catch (error) {
      setError(toWeatherError(error));
    }
  };

  const handleCloseSettings = async () => {
    try {
      await getSettings();
      setSettingsOpen(false);
    } catch (error) {
      setError(toWeatherError(error));
      setSettingsOpen(false);
    }
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
    applyTheme(theme);
  }, [theme]);

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
    const unlistenAbout = listen("about_clicked", () => {
      setAboutOpen(true);
    });
    return () => {
      unlistenAbout.then((unlisten) => unlisten());
    };
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

  useEffect(() => {
    const unlistenRefresh = listen("refresh_weather", () => {
      void refreshData();
    });
    return () => {
      unlistenRefresh.then((unlisten) => unlisten());
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      void silentRefreshData();
    }, WEATHER_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);


  useKeyboardShortcuts((event: KeyboardEvent) => {

    // Enter saves settings; inputs use form submit (do not preventDefault there)
    if (event.key === "Enter" && settingsOpen) {
      if (!isTypingTarget(event)) {
        event.preventDefault();
        void handleSaveSettings();
      }
      return;
    }

    // Ignore typing targets for global shortcuts
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

    // Open about panel
    if (isModPlusKey(event, ".")) {
      event.preventDefault();
      setAboutOpen(true);
      return;
    }

    // Close open overlays
    if (event.key === "Escape") {
      if (aboutOpen) {
        event.preventDefault();
        setAboutOpen(false);
        return;
      }
      if (settingsOpen) {
        event.preventDefault();
        void handleCloseSettings();
        return;
      }
    }

  }, [settingsOpen, aboutOpen]);

  return (
    <main className="container">
      {aboutOpen ? (
        <About onClose={() => setAboutOpen(false)} />
      ) : null}
      {showSplashScreen ? (
        <SplashScreen isExiting={isSplashExiting} />
      ) : null}
      {shouldShowRainEffect ? <div className="rain-effect" aria-hidden="true" /> : null}
      <header className="ct-header">
        <h1 className="ct-app-title">PixelCast</h1>
        <button
          type="button"
          className="ct-city-title"
          onClick={() => setSettingsOpen(true)}
          aria-label={`Change city: ${city}`}
        >
          {city}
        </button>
      </header>
      {settingsOpen ? (
        <SettingsPanel
          theme={theme}
          city={city}
          unit={unit}
          latitude={latitude}
          longitude={longitude}
          onThemeChange={setTheme}
          onCityChange={setCity}
          onUnitChange={setUnit}
          enableRainEffect={enableRainEffect}
          enableAmbientAudio={enableAmbientAudio}
          ambientAudioVolume={ambientAudioVolume}
          launchAtStartup={launchAtStartup}
          onEnableRainEffectChange={setEnableRainEffect}
          onEnableAmbientAudioChange={setEnableAmbientAudio}
          onAmbientAudioVolumeChange={setAmbientAudioVolume}
          onLaunchAtStartupChange={setLaunchAtStartup}
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
      <StatusBar
        loading={loading}
        refreshTime={lastRefreshTime}
        refresh={() => void refreshData()}
      />
    </main>
  );
}

export default App;
