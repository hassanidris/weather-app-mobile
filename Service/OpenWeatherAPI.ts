export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  windSpeed: number;
  humidity: number;
  icon: string;
}

export interface ForecastItem {
  hour: string;
  temperature: number;
  condition: string;
  icon: string;
}

export interface DetailedWeather extends WeatherData {
  todayForecast: ForecastItem[];
  tomorrowForecast: ForecastItem[];
}
// Default list: 10 European cities (4 Swedish)
const DEFAULT_CITIES = [
  "Stockholm",
  "Gothenburg",
  "Malmö",
  "Umeå",
  "London",
  "Paris",
  "Berlin",
  "Madrid",
  "Rome",
  "Amsterdam",
];

export class WeatherService {
  // Simulate API delay
  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Get current location (mock)
  static async getCurrentLocation(): Promise<string> {
    console.log("WeatherService: Getting current location...");
    await this.delay(500);
    return "Stockholm"; // Mock current location (default)
  }

  private static getApiKey(): string | null {
    const apiKey =
      process.env.EXPO_PUBLIC_API_KEY ||
      (global as any).EXPO_PUBLIC_API_KEY ||
      null;
    if (!apiKey) {
      console.warn(
        "WeatherService: EXPO_PUBLIC_API_KEY not found in environment"
      );
    }
    return apiKey;
  }

  private static async fetchOpenWeather(city: string): Promise<any | null> {
    const apiKey = this.getApiKey();
    if (!apiKey) return null;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${apiKey}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(
          `WeatherService: OpenWeather responded with ${res.status} for ${city}`
        );
        return null;
      }
      const json = await res.json();
      return json;
    } catch (err) {
      console.warn(
        "WeatherService: Network error when calling OpenWeather",
        err
      );
      return null;
    }
  }

  // Fetch 5-day / 3-hour forecast
  private static async fetchForecast(city: string): Promise<any | null> {
    const apiKey = this.getApiKey();
    if (!apiKey) return null;

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${apiKey}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(
          `WeatherService: Forecast responded with ${res.status} for ${city}`
        );
        return null;
      }
      return await res.json();
    } catch (err) {
      console.warn(
        "WeatherService: Network error when calling forecast endpoint",
        err
      );
      return null;
    }
  }

  // Map OpenWeather response to our WeatherData
  private static mapToWeatherData(json: any, city: string): WeatherData {
    try {
      const temperature =
        typeof json.main?.temp === "number" ? Math.round(json.main.temp) : 20;
      const condition =
        json.weather && json.weather[0] && json.weather[0].main
          ? json.weather[0].main
          : "Unknown";
      const icon = json.weather && json.weather[0] && json.weather[0].icon;
      const windSpeed =
        typeof json.wind?.speed === "number" ? json.wind.speed : 0;
      const humidity =
        typeof json.main?.humidity === "number" ? json.main.humidity : 50;

      return {
        city,
        temperature,
        condition,
        windSpeed,
        humidity,
        icon,
      };
    } catch (e) {
      console.warn("WeatherService: Failed to map OpenWeather response", e);
      return {
        city,
        temperature: 20,
        condition: "Unknown",
        windSpeed: 0,
        humidity: 50,
        icon: "circle",
      };
    }
  }

  // Get weather for multiple cities. If `cities` is empty, use DEFAULT_CITIES.
  static async getCitiesWeather(cities: string[] = []): Promise<WeatherData[]> {
    const target = cities && cities.length > 0 ? cities : DEFAULT_CITIES;
    console.log("WeatherService: Getting weather for cities:", target);

    const promises = target.map(async (city) => {
      const json = await this.fetchOpenWeather(city);
      if (json) return this.mapToWeatherData(json, city);

      // If API failed or key missing, return a minimal placeholder with unknowns
      return {
        city,
        temperature: 0,
        condition: "Unknown",
        windSpeed: 0,
        humidity: 0,
        icon: "help-circle",
      };
    });

    return Promise.all(promises);
  }

  // Get detailed weather for a specific city (current + forecast).
  static async getDetailedWeather(city: string): Promise<DetailedWeather> {
    console.log("WeatherService: Getting detailed weather for:", city);

    const [currentJson, forecastJson] = await Promise.all([
      this.fetchOpenWeather(city),
      this.fetchForecast(city),
    ]);

    const basic = currentJson
      ? this.mapToWeatherData(currentJson, city)
      : {
          city,
          temperature: 0,
          condition: "Unknown",
          windSpeed: 0,
          humidity: 0,
          icon: "help-circle",
        };

    const todayForecast: ForecastItem[] = [];
    const tomorrowForecast: ForecastItem[] = [];

    if (forecastJson && Array.isArray(forecastJson.list)) {
      // Use city timezone (seconds) with each item.dt (unix seconds) to compute local date/time
      const timezoneOffset =
        typeof forecastJson.city?.timezone === "number"
          ? forecastJson.city.timezone
          : 0;

      for (const item of forecastJson.list) {
        if (typeof item.dt !== "number") continue;

        const localEpoch = (item.dt + timezoneOffset) * 1000;
        const local = new Date(localEpoch);

        const year = local.getUTCFullYear();
        const month = String(local.getUTCMonth() + 1).padStart(2, "0");
        const day = String(local.getUTCDate()).padStart(2, "0");
        const datePart = `${year}-${month}-${day}`;

        const hours = String(local.getUTCHours()).padStart(2, "0");
        const minutes = String(local.getUTCMinutes()).padStart(2, "0");
        const timePart = `${hours}:${minutes}`;

        const temp =
          typeof item.main?.temp === "number" ? Math.round(item.main.temp) : 0;
        const cond =
          item.weather && item.weather[0] && item.weather[0].main
            ? item.weather[0].main
            : "Unknown";
        const icon =
          item.weather && item.weather[0] && item.weather[0].icon
            ? item.weather[0].icon
            : "help-circle";

        const forecastItem: ForecastItem = {
          hour: timePart,
          temperature: temp,
          condition: cond,
          icon,
        };

        // compute today's/tomorrow's dates according to local time
        const nowLocal = new Date(Date.now() + timezoneOffset * 1000);
        const todayStr = nowLocal.toISOString().slice(0, 10);
        const tomorrow = new Date(nowLocal);
        tomorrow.setDate(nowLocal.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().slice(0, 10);

        if (datePart === todayStr) {
          if (todayForecast.length < 6) todayForecast.push(forecastItem);
        } else if (datePart === tomorrowStr) {
          if (tomorrowForecast.length < 6) tomorrowForecast.push(forecastItem);
        }
      }
    }

    return {
      city: basic.city,
      temperature: basic.temperature,
      condition: basic.condition,
      windSpeed: basic.windSpeed,
      humidity: basic.humidity,
      icon: basic.icon,
      todayForecast,
      tomorrowForecast,
    };
  }
}
