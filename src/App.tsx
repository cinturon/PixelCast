import "./App.css";
import WeatherCard from "./components/WeatherCard";
import ForecastPanel from "./components/ForecastPanel";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export type FullCurrentWeather = {
  temperature_2m: number;
  weather_condition: string;
  weather_flavor: string;
  weather_code: number;
  weather_icon: string;
  precipitation: number;
}

type CurrentWeatherResponse = {
  temperature_2m: number;
  weather_code: number;
  precipitation: number;
}

type WeatherConditionResponse = {
  condition: string;
  iconKey: string;
}

export type Forecast = {
  date: string;
  highF: number;
  lowF: number;
  weather_condition: string;
  rainChance: number;
}

export type WeatherError = {
  errorType: string;
  message: string;
}

function App() {

  const [loadingWeather, setLoadingWeather] = useState<boolean>(false);
  const [errorWeather, setErrorWeather] = useState<WeatherError>();
  const [weather, setWeather] = useState<FullCurrentWeather>();
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [city] = useState<string>("Seattle");

  const weatherIconByKey: Record<string, string> = {
    clear: "/icons/sun.png",
    cloudy: "/icons/cloudy.png",
    light_snow: "/icons/light_snow.png",
    heavy_snow: "/icons/heavy_snow.png",
    heavy_rain: "/icons/heavy_rain.png",
    light_rain: "/icons/light_rain.png",
    thunderstorm: "/icons/thunder_storm.png",
    unknown: "/icons/sun.png",
  };

  const weatherFlavorByCondition: Record<string, string> = {
    "Clear sky": "The sky glows like a freshly opened treasure chest.",
    "Mainly clear": "A bright day. Perfect weather for crossing the overworld.",
    "Partly cloudy": "The sun hides behind a veil. Something stirs in the distance.",
    "Overcast": "A muted sky hangs over the town square.",
    "Fog": "The path ahead fades into silver mist.",
    "Drizzle": "The roads are slick. Equip sturdy boots.",
    "Freezing drizzle": "A cold rain falls across the kingdom.",
    "Rain": "Rain taps the rooftops like a thousand tiny drummers.",
    "Freezing rain": "Travelers may wish to seek shelter at the nearest inn.",
    "Snow fall": "A cold enchantment settles over the land.",
    "Snow grains": "Snow falls softly, quieting the overworld.",
    "Rain showers": "A cleansing rain sweeps across the kingdom.",
    "Snow showers": "Footprints vanish almost as soon as they are made.",
    "Thunderstorm": "Storm clouds gather. The air hums with danger.",
    "Thunderstorm with hail": "The heavens charge their ultimate spell.",
    "Unknown": "The sky keeps its secrets for now.",
  };

  const getWeatherCondition = async (weather_code: number) => {
    try {
      const condition = await invoke<WeatherConditionResponse>("get_weather_condition", { code: weather_code });
      return condition;
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentWeather = async (city: string) => {
    setLoadingWeather(true);

    try {
      return await invoke<CurrentWeatherResponse>("get_current_weather", { city });
    } catch (error) {
      setErrorWeather(error as WeatherError);
    } finally {
      setLoadingWeather(false);
    }
  };

  const loadWeather = async () => {
    const currentWeather = await getCurrentWeather(city);

    if (!currentWeather) {
      return;
    }

    const weatherCondition = await getWeatherCondition(currentWeather.weather_code);
    const iconKey = weatherCondition?.iconKey ?? "unknown";
    const condition = weatherCondition?.condition ?? "Unknown";

    setWeather({
      ...currentWeather,
      weather_condition: condition,
      weather_flavor: weatherFlavorByCondition[condition] ?? weatherFlavorByCondition.Unknown,
      weather_icon: weatherIconByKey[iconKey] ?? weatherIconByKey.unknown,
    });
  };

  useEffect(() => {
    loadWeather();
    setForecasts([
      { date: "Monday", highF: 70, lowF: 50, weather_condition: "Sunny", rainChance: 50 },
      { date: "Tuesday", highF: 60, lowF: 40, weather_condition: "Cloudy", rainChance: 30 },
      { date: "Wednesday", highF: 50, lowF: 30, weather_condition: "Rainy", rainChance: 70 },
    ]);
  }, []);

  return (
    <main className="container">
      <header className="ct-header">
        <h1 className="ct-app-title">PixelCast</h1>
      </header>
      <div className="row">
        <div className="column">
          {forecasts.length > 0 ? (
            <ForecastPanel
              forecasts={forecasts}
            />
          ) : (
            <p className="forecast-placeholder">Loading Forecast</p>
          )}
        </div>

        <div className="column">
          {loadingWeather ? (
            <p className="weather-placeholder">Loading Current Weather</p>
          ) : errorWeather ? (
            <div className="weather-placeholder">
              <p>Error Loading Current Weather: {errorWeather.errorType} - {errorWeather.message}</p>
              <button onClick={() => {
                loadWeather();
              }}>Retry</button>
            </div>
          ) : weather ? (
            <WeatherCard
              city={city}
              fullCurrentWeather={weather}
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
