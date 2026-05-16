import "./App.css";
import WeatherCard from "./components/WeatherCard";
import ForecastPanel from "./components/ForecastPanel";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export type WeatherData = {
  temperature: number;
  condition: string;
  rainChance: number;
}


function App() {

  const [weather, setWeather] = useState<WeatherData>();
  const [city] = useState<string>("Seattle");

  const getCurrentWeather = async (city: string) => {
    const weather = await invoke("get_current_weather", { city });
    setWeather(weather as WeatherData);
  };

  useEffect(() => {
    getCurrentWeather("Seattle");
  }, []);

  return (
    <main className="container">
      <header className="ct-header">
        <h1 className="ct-app-title">PixelCast</h1>
      </header>
      <div className="row">
        <div className="column">
          <ForecastPanel
            forecasts={[
              { date: "Monday", highF: 70, lowF: 50, condition: "Sunny", rainChance: 50 },
              { date: "Tuesday", highF: 60, lowF: 40, condition: "Cloudy", rainChance: 30 },
              { date: "Wednesday", highF: 50, lowF: 30, condition: "Rainy", rainChance: 70 },
            ]}
          />
        </div>
        <div className="column">
          {weather ? (
            <WeatherCard
              city={city}
              temperatureF={weather.temperature}
              condition={weather.condition}
              rainChance={weather.rainChance}
            />
          ) : (
            <p className="weather-placeholder">Loading current weather…</p>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
