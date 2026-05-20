import { createPortal } from "react-dom";
import "../App.css";
import WeatherCard from "../components/WeatherCard";
import ForecastPanel from "../components/ForecastPanel";
import SettingsPanel from "../components/SettingsPanel";
import { RetroPanel } from "../components/RetroPanel";
import { About } from "../components/About";
import { StatusBar } from "../components/StatusBar";
import { mockWeatherData, screenshotRefreshTime } from "./mockWeatherData";

type ScreenshotView = "main" | "settings" | "about";

const noop = () => undefined;

const getView = (): ScreenshotView => {
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  if (view === "settings" || view === "about") {
    return view;
  }
  return "main";
};

export default function ScreenshotPage() {
  const view = getView();
  const settingsOpen = view === "settings";
  const aboutOpen = view === "about";

  return (
    <>
      <main className="container screenshot-page">
        <header className="ct-header">
          <h1 className="ct-app-title">PixelCast</h1>
          <h2 className="ct-city-title">Seattle</h2>
        </header>
        <div className="row">
          <div className="column">
            <RetroPanel>
              <ForecastPanel
                forecasts={mockWeatherData.forecasts}
                unit="Fahrenheit"
                loading={false}
                onRetry={noop}
              />
            </RetroPanel>
          </div>
          <div className="column">
            <RetroPanel>
              <WeatherCard
                currentWeather={mockWeatherData.current}
                unit="Fahrenheit"
                loading={false}
                onRetry={noop}
              />
            </RetroPanel>
          </div>
        </div>
        <StatusBar loading={false} refreshTime={screenshotRefreshTime} />
      </main>
      {settingsOpen
        ? createPortal(
            <>
              <div className="screenshot-backdrop" aria-hidden="true" />
              <SettingsPanel
                city="Seattle"
                unit="Fahrenheit"
                latitude={47.6062}
                longitude={-122.3321}
                enableRainEffect
                launchAtStartup={false}
                onCityChange={noop}
                onUnitChange={noop}
                onEnableRainEffectChange={noop}
                onLaunchAtStartupChange={noop}
                onSave={noop}
                onClose={noop}
              />
            </>,
            document.body,
          )
        : null}
      {aboutOpen ? createPortal(<About onClose={noop} />, document.body) : null}
    </>
  );
}
