import axios from 'axios';

import { WeatherData } from '../models/WeatherData';

import { IWeatherService } from './IWeatherService';
import { WeatherServiceError } from './ServiceErrors';

export class OpenWeatherMapService implements IWeatherService {
  constructor(private apiKey: string = process.env.OPEN_WEATHER_MAP_API_KEY!) {
    if (!this.apiKey) {
      throw new Error('OpenWeatherMap API key is required');
    }
  }

  async getWeatherData(
    city: string,
  ): Promise<WeatherData | WeatherServiceError> {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city,
    )}&appid=${this.apiKey}&units=metric`;

    try {
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
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          error: error.response?.data.message || 'An unexpected error occurred',
          statusCode: error.response?.status || 500,
        };
      } else {
        return {
          error: 'An unexpected error occurred',
          statusCode: 500,
        };
      }
    }
  }
}
