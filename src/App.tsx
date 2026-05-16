import "./App.css";
import WeatherCard from "./components/WeatherCard";
import ForecastPanel from "./components/ForecastPanel";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export type WeatherData = {
  temperature_2m: number;
  weather_condition: string;
  precipitation: number;
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
  const [weather, setWeather] = useState<WeatherData>();
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [city] = useState<string>("Seattle");

  const getCurrentWeather = async (city: string) => {
    setLoadingWeather(true);

    try {
      const weather = await invoke("get_current_weather", { city });
      setWeather(weather as WeatherData);
    } catch (error) {
      setErrorWeather(error as WeatherError);
    } finally {
      setLoadingWeather(false);
    }
  };

  useEffect(() => {
    getCurrentWeather(city);
  
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
                getCurrentWeather(city);
              }}>Retry</button>
            </div>
          ) : weather ? (
            <WeatherCard
              city={city}
              temperature={weather.temperature_2m}
              weather_condition={weather.weather_condition}
              precipitation={weather.precipitation}
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
