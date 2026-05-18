export type WeatherData = {
  current: CurrentWeatherData;
  forecasts: Forecast[];
}

export type CurrentWeatherData = {
  temperature2m: number;
  weatherCode: number;
  precipitation: number;
  weatherCondition: string;
  weatherFlavor: string;
}

export type Forecast = {
  date: string;
  highF: number;
  lowF: number;
  weatherCode: number;
  rainChance: number;
  weatherCondition: string;
}

export type TemperatureUnit = "Fahrenheit" | "Celsius";



export type WeatherError = {
  errorType: string;
  message: string;
}