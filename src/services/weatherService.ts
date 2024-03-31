import { IWeatherService } from './IWeatherService';
import { ICache } from '../caches/ICache';
import { WeatherData } from '../models/WeatherData';

export class WeatherService {
  constructor(private cache: ICache, private weatherService: IWeatherService) {}

  fetchWeatherData = async (city: string): Promise<WeatherData> => {
    const cacheKey = `weather-${city}`;
    const cachedData = await this.cache.get(cacheKey);
    if (cachedData) {
      console.log('Returning cached data');
      return cachedData as WeatherData;
    }

    console.log('Fetching data from the weather service');

    const data = await this.weatherService.getWeatherData(city);
    await this.cache.set(cacheKey, data, 60);
    return data;
  };
}
