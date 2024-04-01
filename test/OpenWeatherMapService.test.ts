jest.mock('axios');
import axios from 'axios';

import { OpenWeatherMapService } from '../src/services/OpenWeatherMapService';

describe('OpenWeatherMapService', () => {
  const mockApiKey = 'test_api_key';
  const service = new OpenWeatherMapService(mockApiKey);

  it('fetches weather data successfully from the API', async () => {
    const mockData = {
      data: {
        name: 'London',
        main: { temp: 15, humidity: 70 },
        weather: [{ main: 'Clouds' }],
        wind: { speed: 5 },
      },
    };
    jest.spyOn(axios, 'get').mockResolvedValue(mockData);

    const weatherData = await service.getWeatherData('London');

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('London'));
    expect(weatherData).toEqual({
      city: 'London',
      temperature: 15,
      condition: 'Clouds',
      humidity: 70,
      windSpeed: 5,
    });
  });
});
