export type WeatherDataResponse = {
  current: CurrentWeather;
  forecasts: Forecast[];
}

export type CurrentWeather = {
  temperature_2m: number;
  weather_code: number;
  precipitation: number;
}

export type Forecast = {
  date: string;
  highF: number;
  lowF: number;
  weather_code: number;
  rainChance: number;
}

export type TemperatureUnit = "Fahrenheit" | "Celsius";

export type WeatherCondition = {
  condition: string;
  icon: string;
};

export type WeatherError = {
  errorType: string;
  message: string;
}