import { WeatherData } from "../models/WeatherData";

import { WeatherServiceError } from "./ServiceErrors";

export interface IWeatherService {
  getWeatherData(city: string): Promise<WeatherData | WeatherServiceError>;
}
