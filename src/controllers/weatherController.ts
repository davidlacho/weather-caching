import { Request, Response } from 'express';
import { WeatherService } from '../services/weatherService';
import { OpenWeatherMapService } from '../services/OpenWeatherMapService';
import { DynamoDBCache } from '../caches/DynamoDBCache';

import { WeatherData } from '../models/WeatherData';
import { InMemoryCache } from '../caches/InMemoryCache';
import { ICache } from '../caches/ICache';

export const getWeatherByCity = async (
  { params }: Request,
  res: Response
): Promise<Response<WeatherData | { message: string }>> => {
  const { city } = params;

  if (!city) {
    return res.status(400).json({ message: 'City is required' });
  }

  let cache: ICache;

  if (process.env.ENVIROMENT === 'PROD') {
    // Use DynamoDBCache in production
    cache = new DynamoDBCache('weather');
  } else {
    // Use InMemoryCache in development
    cache = InMemoryCache.getInstance();
  }

  try {
    const weatherService = new WeatherService(
      cache,
      new OpenWeatherMapService()
    );

    const data: WeatherData = await weatherService.fetchWeatherData(city);
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching weather data' });
  }
};
