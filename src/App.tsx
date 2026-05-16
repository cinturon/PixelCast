import "./App.css";
import WeatherCard from "./components/WeatherCard";
import ForecastPanel from "./components/ForecastPanel";

function App() {

  return (
    <main className="container">
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
          <WeatherCard
            city="Seattle"
            temperatureF={70}
            condition="Sunny"
            rainChance={50}
          />
        </div>
      </div>
    </main>
  );
}

export default App;
