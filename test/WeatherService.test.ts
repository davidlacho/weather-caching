import { IWeatherService } from "../src/services/IWeatherService";
import { ICache } from "../src/caches/ICache";
import { WeatherService } from "../src/services/weatherService";

describe("WeatherService", () => {
  let weatherService: WeatherService;
  let mockWeatherService: IWeatherService;
  let mockCache: ICache;

  beforeEach(() => {
    mockWeatherService = {
      getWeatherData: jest.fn(),
    };
    mockCache = {
      get: jest.fn(),
      set: jest.fn(),
    };

    weatherService = new WeatherService(mockCache, mockWeatherService);
  });

  it("fetches weather data from the cache if available", async () => {
    const city = "TestCity";
    const cachedData = { city: "TestCity", temperature: 20 };

    (mockCache.get as jest.Mock).mockResolvedValue(cachedData);

    const data = await weatherService.fetchWeatherData(city);
    expect(data).toEqual(cachedData);
    expect(mockCache.get).toHaveBeenCalledWith(`weather-${city}`);
    expect(mockWeatherService.getWeatherData).not.toHaveBeenCalled();
  });

  it("fetches weather data from the weather service and caches it if not in cache", async () => {
    const city = "TestCity";
    const weatherData = { city: "TestCity", temperature: 25 };

    (mockCache.get as jest.Mock).mockResolvedValue(null);
    (mockWeatherService.getWeatherData as jest.Mock).mockResolvedValue(
      weatherData,
    );

    const data = await weatherService.fetchWeatherData(city);
    expect(data).toEqual(weatherData);
    expect(mockCache.set).toHaveBeenCalledWith(
      `weather-${city}`,
      weatherData,
      60,
    );
    expect(mockWeatherService.getWeatherData).toHaveBeenCalledWith(city);
  });
});
