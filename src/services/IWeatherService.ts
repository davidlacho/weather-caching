import { WeatherData } from '../models/WeatherData';

export interface IWeatherService {
  getWeatherData(city: string): Promise<WeatherData>;
}
