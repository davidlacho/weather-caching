# Weather Forecast Service

## Overview

This service provides real-time weather data by integrating with any weather API, in this case using the OpenWeatherMap API. Designed with scalability and efficiency in mind, it leverages a flexible caching strategy to optimize response times and reduce unnecessary external API calls.

### Service Architecture

The architecture consists of several key components:
- **OpenWeatherMapService**: Implements the `IWeatherService` interface to fetch weather data from the OpenWeatherMap API.
- **WeatherService**: Acts as an orchestrator, first attempting to retrieve weather data from the cache before falling back to the OpenWeatherMapService.
- **Caching Mechanism**: Utilizes both an in-memory cache (`InMemoryCache`) for development and a DynamoDB-based cache (`DynamoDBCache`) for production environments, abstracted behind the `ICache` interface.
- **Swappable API Sources**: The `IWeatherService` interface abstracts away the specifics of obtaining weather data, specifying only the necessary operations that any weather data fetching service must support. While currently integrated with the OpenWeatherMap API, the service could be expanded to support other weather data sources.


#### Composition
- The **WeatherService** is composed of an `ICache` implementation and the `OpenWeatherMapService`, enabling a separation of concerns where caching logic and external API interactions are managed independently but work cohesively.
- **Controllers** and **Routes** in the Express framework manage incoming HTTP requests and route them to the appropriate services.

### Caching Strategy

To ensure responsiveness and reduce load on the external API, the service employs a two-tiered caching strategy:
- **In-Memory Cache**: Provides fast access to recently requested data, suitable for development and low-traffic scenarios.
- **DynamoDB Cache**: Offers a scalable, persistent caching solution for handling higher traffic volumes in production environments.

## Setup and Running

### Prerequisites
- Node.js (LTS version recommended)
- An AWS account (for DynamoDB) and configured AWS CLI
- An API key from OpenWeatherMap

### Configuration
1. Clone the repository and navigate into the project directory.
2. Copy `.env.example` to `.env` and fill in the necessary environment variables, including your OpenWeatherMap API key (AWS Region is only needed for production).

### Installation
```bash
npm install
```

### Running the Application
```bash
npm start
```
This will start the server on the defined port (default: 3000). Access weather data at `http://localhost:3000/weather/<city>`.

## Assumptions and Technical Choices

- **DynamoDB**: Selected for production caching to benefit from AWS's scalability and reliability.
- **Singleton Pattern for InMemoryCache**: Ensures that only one instance of the cache is used, optimizing resource use.
- **Composition Pattern for WeatherService**: The WeatherService class demonstrates composition by holding references to caching and weather data fetching components. This allows it to flexibly manage the retrieval of weather data, prioritizing cache usage and seamlessly integrating new caching mechanisms or data sources without disrupting its core functionality.

## Future Optimizations and Scale

### Scalability
- Implement a more sophisticated caching mechanism with automated cache invalidation to handle data freshness more effectively.
- The use of composition in the service architecture inherently supports scalability. By structuring the `WeatherService` to interact with implementations of `ICache`, more sophisticated caching strategies can be implemented without major overhauls to our service's core logic. Likewise, new weather APIs can be swapped out with implementations of `IWeatherService`.

### Optimizations
A few thoughts on optimizations: 
- Integrate a circuit breaker for the OpenWeatherMap API calls to prevent failures in case of API downtime or rate limiting.
- Better error handling, custom error classes

### Features
- Extend the service to support additional endpoints from OpenWeatherMap, such as forecast data.
- Add user authentication to enable personalized weather dashboards.