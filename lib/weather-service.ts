export interface WeatherData {
  date: string;
  temperature: number;
  feelsLike?: number;
  condition: "sunny" | "cloudy" | "rainy" | "stormy" | "snowy" | "partlyCloudy" | "foggy";
  humidity: number;
  windSpeed: number;
  weatherId?: number;
  weatherDescription?: string;
  weatherIcon?: string;
  precipitation?: number;
}

export interface ApiForecastEntry {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

export interface WeatherApiResponse {
  list: ApiForecastEntry[];
  location: {
    name: string;
    country: string;
    coordinates: { lat: number; lon: number };
  };
  lastUpdated: string;
}

export async function getWeatherForecast(locationOrCoords: string | { lat: number; lon: number }): Promise<WeatherApiResponse> {
  try {
    let url: string;
    if (typeof locationOrCoords === 'string') {
      url = `/api/weather?location=${encodeURIComponent(locationOrCoords)}`;
    } else {
      url = `/api/weather?lat=${locationOrCoords.lat}&lon=${locationOrCoords.lon}`;
    }

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro ao buscar dados meteorológicos: ${response.status} - ${errorText}`);
      throw new Error(`Erro da API de clima: ${response.status}`);
    }

    const responseData: WeatherApiResponse = await response.json();

    if (responseData && Array.isArray(responseData.list) && responseData.location) {
      return responseData;
    } else {
      console.error("Resposta da API de clima interna malformada (faltando 'list' ou 'location').");
      throw new Error("Resposta da API de clima interna malformada.");
    }

  } catch (error) {
    console.error("Erro na função getWeatherForecast:", error);
    throw error;
  }
}

export function generateFallbackWeatherData(location: string): WeatherData[] {
  const locationHash = location.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const forecast: WeatherData[] = [];
  const conditions: WeatherData["condition"][] = [
    "sunny", "cloudy", "rainy", "stormy", "partlyCloudy", "foggy", "snowy",
  ];

  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const conditionIndex = (locationHash + i) % conditions.length;
    const condition = conditions[conditionIndex];
    const baseTemp = 15 + (locationHash % 15);
    const tempVariation = Math.sin((i * Math.PI) / 2) * 5;
    const temperature = Math.round(baseTemp + tempVariation);

    forecast.push({
      date: date.toLocaleString("pt-BR", { weekday: "short" }),
      temperature: temperature,
      feelsLike: temperature - Math.round(2 + (locationHash % 3)),
      condition,
      humidity: 40 + ((locationHash + i * 7) % 40),
      windSpeed: Math.round(5 + ((locationHash + i * 3) % 20)),
      precipitation: condition === 'rainy' || condition === 'stormy' ? Math.round(30 + (locationHash + i) % 50) : 0,
      weatherDescription: condition,
    });
  }
  return forecast;
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10;
}