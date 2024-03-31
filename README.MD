# Weather Forecast Service

## Overview

This service provides real-time weather information by integrating with the OpenWeatherMap API. It is designed for efficiency and scalability, utilizing a caching strategy to enhance response times and minimize external API requests.

### Service Architecture

Key components of the architecture include:
- **Swappable API Sources**: The architecture is designed for flexibility, allowing for the integration of additional weather data sources via the `IWeatherService` interface.
- **Swappable Caching Mechanisms**: Features an in-memory cache for development (`InMemoryCache`) and a Redis cache for production (`RedisCache`), through the `ICache` interface.
- **WeatherService**: Orchestrates the retrieval of weather data, preferring cached data when available. It implements composition by combining caching (`ICache`) and weather data fetching (`OpenWeatherMapService`) for effective data management.
- The application uses **Controllers** and **Routes** within Express to manage HTTP requests.

### Docker-Based Setup

This setup uses Docker to containerize the application and its dependencies, including Redis for caching.

## Local Setup Using Docker

### Prerequisites
- Docker and Docker Compose installed on your machine.
- An API key from OpenWeatherMap.

### Configuration
1. Clone the repository and navigate to the project directory.
2. Create a `.env` file in the root directory based on the provided `.env.example`. Fill in the necessary environment variables, including your OpenWeatherMap API key and preferred port for the application. The Redis configuration will be handled by Docker Compose. Note that setting an `ENV=PROD` will use Redis as a caching mechanism, whereas all other value for this setting will use an in-memory caching mechanism. 

### Running with Docker Compose
To run the application, execute the following command in the terminal at the root of the project directory:

```bash
docker-compose up --build
```

This command builds the Docker image for the application and starts the containers defined in docker-compose.yml, including the Redis service.
The application will be accessible on the port specified in your .env file at `http://localhost:<port>/weather/<city>`.

### Getting Weather Data
To retrieve weather data for a specific city, use the following curl command. Replace YourCityName with the name of the city you're interested in:

```bash
curl -X GET "http://localhost:3000/weather/YourCityName"
```
This command sends a GET request to the server, which responds with the weather data for the specified city. If the city's weather data is cached and not yet expired, the server will return the cached data. Otherwise, it will fetch new data from the OpenWeatherMap API, cache it, and then return it.

#### Forcing a Recache of Weather Data
If you want to force the server to fetch fresh weather data from the OpenWeatherMap API regardless of whether it's already cached, add a `forceUpdate` query parameter set to `true`:

```bash
curl -X GET "http://localhost:3000/weather/YourCityName?forceUpdate=true"
```
By including `?forceUpdate=true` in the request URL, you instruct the server to bypass any existing cache for the specified city and retrieve new data from the OpenWeatherMap API, which in turn gets cached. 

#### Verifying Data Source

For the sake of this assignment, the source of the data (whether fetched from API or from cache) is logged to the console. 

## Testing
The project includes a suite of automated tests using Jest. To run these tests, you do not need to have the application running via Docker. Instead, follow these steps:

Ensure all dependencies are installed by running `npm install` if you haven't already. Execute the test suite with:
```bash
npm run test
```

## Assumptions and Technical Choices

- **Redis**:  Selected for production-level caching for its speed and reliability.
- **Singleton Patterns**: Used for caching instances to optimize resource use.
- **Composition**: Facilitates flexibility in managing weather data retrieval and caching.

## Future Optimizations and Scale

### Scalability
- The use of composition in the service architecture inherently supports scalability. By structuring the `WeatherService` to interact with implementations of `ICache`, more sophisticated caching strategies can be implemented without major overhauls to our service's core logic. Likewise, new weather APIs can be swapped out with implementations of `IWeatherService`.

### Optimizations
A few thoughts on optimizations: 
- Integrate a circuit breaker for the OpenWeatherMap API calls to prevent failures in case of API downtime or rate limiting.
- Better error handling, custom error classes

### Features
- Extend the service to support additional endpoints from OpenWeatherMap, such as forecast data.
- Add user authentication to enable personalized weather dashboards.