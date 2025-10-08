// app/api/weather/route.ts
import { type NextRequest, NextResponse } from "next/server";
import type { WeatherData } from "@/lib/weather-service"; // Importa o tipo atualizado

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

export async function GET(request: NextRequest) {
  if (!API_KEY) {
    console.error("Chave da API OpenWeatherMap não configurada no servidor.");
    return NextResponse.json({ error: "Configuração do servidor incompleta para API de clima." }, { status: 500 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get("location");

    if (!location) {
      return NextResponse.json({ error: "Parâmetro de localização é obrigatório" }, { status: 400 });
    }

    const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`;
    const geocodeResponse = await fetch(geocodeUrl);
    if (!geocodeResponse.ok) throw new Error(`Geocoding API error: ${geocodeResponse.status}`);
    const geocodeData = await geocodeResponse.json();

    if (!geocodeData || geocodeData.length === 0) {
      return NextResponse.json({ error: "Localização não encontrada" }, { status: 404 });
    }

    const { lat, lon } = geocodeData[0];

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${API_KEY}`;
    const forecastResponse = await fetch(forecastUrl, { next: { revalidate: 1800 } });
    if (!forecastResponse.ok) throw new Error(`Forecast API error: ${forecastResponse.status}`);
    const forecastData = await forecastResponse.json();

    if (!forecastData || !forecastData.list) {
      return NextResponse.json({ error: "Erro ao obter dados meteorológicos" }, { status: 500 });
    }

    const processedData: WeatherData[] = processForecastData(forecastData);

    return NextResponse.json({
      data: processedData,
      location: {
        name: geocodeData[0].name,
        country: geocodeData[0].country,
        coordinates: { lat, lon },
      },
      lastUpdated: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Erro na API de clima:", error.message);
    return NextResponse.json({ error: "Erro ao processar solicitação meteorológica", details: error.message }, { status: 500 });
  }
}

function processForecastData(forecastData: any): WeatherData[] {
  const dailyForecasts = new Map<string, any>();

  forecastData.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split("T")[0];
    if (
      !dailyForecasts.has(dateKey) ||
      Math.abs(date.getHours() - 12) < Math.abs(new Date(dailyForecasts.get(dateKey).dt * 1000).getHours() - 12)
    ) {
      dailyForecasts.set(dateKey, item);
    }
  });

  return Array.from(dailyForecasts.values())
    .slice(0, 5)
    .map((item) => {
      const date = new Date(item.dt * 1000);
      const weatherId = item.weather[0].id;
      const weatherMain = item.weather[0].main.toLowerCase();
      let condition: WeatherData["condition"] = "cloudy"; // Default mais seguro

      if (weatherId >= 200 && weatherId < 300) condition = "stormy";
      else if (weatherId >= 300 && weatherId < 600) condition = "rainy";
      else if (weatherId >= 600 && weatherId < 700) condition = "snowy";
      else if (weatherId >= 701 && weatherId <= 781) condition = "foggy"; // Condições atmosféricas (névoa, etc.)
      else if (weatherId === 800) condition = "sunny";
      else if (weatherId === 801 || weatherId === 802) condition = "partlyCloudy"; // Poucas nuvens, nuvens dispersas
      else if (weatherId === 803 || weatherId === 804) condition = "cloudy"; // Nuvens quebradas, nublado

      return {
        date: date.toLocaleDateString("pt-BR", { weekday: "short" }),
        temperature: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        condition,
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 3.6), // m/s para km/h
        weatherId: item.weather[0].id,
        weatherDescription: item.weather[0].description,
        weatherIcon: item.weather[0].icon,
        precipitation: typeof item.pop === 'number' ? Math.round(item.pop * 100) : 0,
      };
    });
}