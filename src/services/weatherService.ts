import { ICache } from '../caches/ICache';
import { WeatherData } from '../models/WeatherData';

import { IWeatherService } from './IWeatherService';
import { WeatherServiceError } from './ServiceErrors';

export class WeatherService {
  constructor(
    private cache: ICache,
    private weatherService: IWeatherService,
  ) {}

  fetchWeatherData = async (
    city: string,
    forceUpdateCache: boolean = false,
  ): Promise<WeatherData | WeatherServiceError> => {
    const cacheKey = `weather-${city}`;

    if (!forceUpdateCache) {
      const cachedData = await this.cache.get(cacheKey);

      if (cachedData) {
        console.log('Returning cached data');
        return cachedData as WeatherData;
      }
    }

    console.log('Fetching data from the weather service and updating cache');

    const data = await this.weatherService.getWeatherData(city);
    await this.cache.set(cacheKey, data, 60);
    return data;
  };
}
