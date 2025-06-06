// lib/weather-service.ts

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

// WeatherResponse não é usado neste arquivo, mas pode ser útil em outros lugares.
// export interface WeatherResponse { 
//   data: WeatherData[];
//   location: { /* ... */ };
//   lastUpdated: string;
// }

export async function getWeatherForecast(location: string): Promise<WeatherData[]> {
  try {
    const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro ao buscar dados meteorológicos: ${response.status} - ${errorText}`);
      // Lançar erro para ser pego pelo catch e retornar dados de fallback
      throw new Error(`Erro da API de clima: ${response.status}`);
    }

    // A API route /api/weather deve retornar um objeto com uma propriedade 'data' que é WeatherData[]
    const responseData: { data: WeatherData[] } = await response.json();

    if (responseData && Array.isArray(responseData.data)) {
      return responseData.data; // <<< RETORNO ADICIONADO AQUI
    } else {
      console.error("Resposta da API de clima interna não contém o campo 'data' esperado ou não é um array.");
      throw new Error("Resposta da API de clima interna malformada."); // Será pego pelo catch
    }

  } catch (error) {
    console.error("Erro na função getWeatherForecast:", error);
    return generateFallbackWeatherData(location); // Retorna dados de fallback
  }
}

export function generateFallbackWeatherData(location: string): WeatherData[] {
  const locationHash = location.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const forecast: WeatherData[] = [];
  // Usar o tipo completo para consistência, incluindo 'snowy' e 'foggy'
  const conditions: WeatherData["condition"][] = [
    "sunny",
    "cloudy",
    "rainy",
    "stormy",
    "partlyCloudy",
    "foggy",
    "snowy",
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
      date: date.toLocaleDateString("pt-BR", { weekday: "short" }),
      temperature: temperature, // Nome correto da propriedade
      feelsLike: temperature - Math.round(2 + (locationHash % 3)), // Pequena variação no feelsLike
      condition,
      humidity: 40 + ((locationHash + i * 7) % 40),
      windSpeed: Math.round(5 + ((locationHash + i * 3) % 20)), // Nome correto da propriedade
      precipitation: Math.round(10 + ((locationHash + i * 5) % 30)),
      // Campos opcionais podem ser omitidos ou definidos como undefined
      weatherId: undefined,
      weatherDescription: condition, // Descrição simples
      weatherIcon: undefined,
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