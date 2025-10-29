import { type NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

export async function GET(request: NextRequest) {
  if (!API_KEY) {
    console.error("Chave da API OpenWeatherMap não configurada no servidor.");
    return NextResponse.json({ error: "Configuração do servidor incompleta para API de clima." }, { status: 500 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get("location");
    const latParam = searchParams.get("lat");
    const lonParam = searchParams.get("lon");

    let lat: number;
    let lon: number;
    let locName: string | null = null;
    let country: string | null = null;

    if (latParam && lonParam) {
      lat = parseFloat(latParam);
      lon = parseFloat(lonParam);
      
      const reverseGeocodeUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
      const reverseGeocodeResponse = await fetch(reverseGeocodeUrl);
      if (!reverseGeocodeResponse.ok) throw new Error(`Reverse geocoding API error: ${reverseGeocodeResponse.status}`);
      const reverseGeocodeData = await reverseGeocodeResponse.json();
      
      if (reverseGeocodeData && reverseGeocodeData.length > 0) {
        locName = reverseGeocodeData[0].name;
        country = reverseGeocodeData[0].country;
      } else {
        locName = "Localização desconhecida";
        country = "";
      }
    } else if (location) {
      const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`;
      const geocodeResponse = await fetch(geocodeUrl);
      if (!geocodeResponse.ok) throw new Error(`Geocoding API error: ${geocodeResponse.status}`);
      const geocodeData = await geocodeResponse.json();

      if (!geocodeData || geocodeData.length === 0) {
        return NextResponse.json({ error: "Localização não encontrada" }, { status: 404 });
      }
      lat = geocodeData[0].lat;
      lon = geocodeData[0].lon;
      locName = geocodeData[0].name;
      country = geocodeData[0].country;
    } else {
      return NextResponse.json({ error: "Parâmetro 'location' ou 'lat/lon' é obrigatório" }, { status: 400 });
    }

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${API_KEY}`;
    const forecastResponse = await fetch(forecastUrl, { next: { revalidate: 1800 } });
    if (!forecastResponse.ok) throw new Error(`Forecast API error: ${forecastResponse.status}`);
    const forecastData = await forecastResponse.json();

    if (!forecastData || !forecastData.list) {
        console.error("Resposta da API OpenWeatherMap inesperada:", forecastData);
        return NextResponse.json({ error: "Erro ao obter dados meteorológicos da fonte externa" }, { status: 502 });
    }

    return NextResponse.json({
      list: forecastData.list,
      location: {
        name: locName,
        country: country,
        coordinates: { lat, lon },
      },
      lastUpdated: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error("Erro na API de clima:", error.message);
    return NextResponse.json({ error: "Erro ao processar solicitação meteorológica", details: error.message }, { status: 500 });
  }
}