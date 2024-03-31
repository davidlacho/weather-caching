import axios from 'axios';
import { IWeatherService } from './IWeatherService';
import { WeatherData } from '../models/WeatherData';

export class OpenWeatherMapService implements IWeatherService {
  constructor(private apiKey: string = process.env.OPEN_WEATHER_MAP_API_KEY!) {
    if (!this.apiKey) {
      throw new Error('OpenWeatherMap API key is required');
    }
  }

  async getWeatherData(city: string): Promise<WeatherData> {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${this.apiKey}&units=metric`;

    const response = await axios.get(url);
    const data = response.data;

    const weatherData: WeatherData = {
      city: data.name,
      temperature: data.main.temp,
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    };

    return weatherData;
  }
}
