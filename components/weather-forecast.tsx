"use client"

import { useState, useEffect } from "react"
import { Cloud, CloudRain, CloudSnow, Sun, CloudLightning, CloudFog, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getWeatherForecast, type WeatherData } from "@/lib/weather-service" // IMPORTADO

interface WeatherForecastProps {
  location: string
  refreshInterval?: number // em milissegundos
}

// A interface WeatherData local foi removida, usamos a importada.

export default function WeatherForecast({ location, refreshInterval = 3600000 /* 1 hora */ }: WeatherForecastProps) {
  const [forecast, setForecast] = useState<WeatherData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getWeatherForecast(location)
        setForecast(data)
      } catch (err: any) {
        console.error("Erro ao buscar previsão do tempo no componente:", err)
        setError(err.message || "Não foi possível carregar a previsão do tempo.")
        // Você pode optar por limpar o forecast ou manter dados antigos/fallback
        // setForecast(generateFallbackWeatherData(location)); // Se quiser usar o fallback do service
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData() // Fetch inicial

    // Configurar intervalo para refresh se refreshInterval for fornecido e maior que 0
    let intervalId: NodeJS.Timeout | undefined;
    if (refreshInterval && refreshInterval > 0) {
      intervalId = setInterval(fetchWeatherData, refreshInterval);
    }

    // Limpar intervalo ao desmontar o componente
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
  }, [location, refreshInterval])

  const getWeatherIcon = (condition: WeatherData["condition"]) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-8 w-8 text-gray-400" />
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-400" />
      case "snowy":
        return <CloudSnow className="h-8 w-8 text-blue-200" />
      case "stormy":
        return <CloudLightning className="h-8 w-8 text-purple-500" />
      case "foggy":
        return <CloudFog className="h-8 w-8 text-gray-300" />
      case "partlyCloudy": // Adicionado para cobrir todas as condições do tipo
        return <Sun className="h-8 w-8 text-yellow-500 opacity-70" /> // Exemplo, pode ser um ícone específico
      default:
        return <Cloud className="h-8 w-8 text-gray-400" /> // Fallback
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        <p>Erro ao carregar previsão:</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  if (forecast.length === 0) {
    return <div className="text-center p-4 text-muted-foreground">Nenhuma previsão disponível.</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2"> {/* Ajustado para melhor responsividade */}
      {forecast.map((day, i) => (
        <Card key={i} className={i === 0 ? "bg-primary/5 border-primary/20" : ""}> {/* Destaque melhorado */}
          <CardContent className="p-3 text-center">
            <div className="font-medium text-sm mb-1">{day.date}</div>
            <div className="flex justify-center mb-1 h-8 w-8 mx-auto">{getWeatherIcon(day.condition)}</div>
            <div className="text-lg font-bold">{day.temperature}°C</div> {/* Usando temperature */}
            {day.precipitation !== undefined && ( // Mostrar precipitação apenas se disponível
              <div className="text-xs text-muted-foreground">{day.precipitation}% chuva</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}