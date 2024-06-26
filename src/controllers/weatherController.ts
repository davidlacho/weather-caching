import { Request, Response } from 'express';

import { WeatherService } from '../services/weatherService';
import { OpenWeatherMapService } from '../services/OpenWeatherMapService';
import { WeatherData } from '../models/WeatherData';
import { InMemoryCache } from '../caches/InMemoryCache';
import { ICache } from '../caches/ICache';
import { RedisCache } from '../caches/RedisCache';
import { WeatherServiceError } from '../services/ServiceErrors';

import { WeatherControllerError } from './ControllerErrors';

export const getWeatherByCity = async (
  { params, query }: Request,
  res: Response
): Promise<Response<WeatherData | WeatherControllerError>> => {
  const { city } = params;
  const { forceUpdate = 'false' } = query;

  if (!city) {
    return res.status(400).json({ message: 'City is required' });
  }

  const cache: ICache =
    process.env.ENVIRONMENT === 'PROD'
      ? RedisCache.getInstance()
      : InMemoryCache.getInstance();

  try {
    const weatherService = new WeatherService(
      cache,
      new OpenWeatherMapService()
    );

    const data: WeatherData | WeatherServiceError =
      await weatherService.fetchWeatherData(city, forceUpdate === 'true');

    if ('error' in data) {
      return res.status(data.statusCode).json(data);
    }

    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching weather data' });
  }
};
