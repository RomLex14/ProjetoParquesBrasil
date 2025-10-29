// components/weather-forecast.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";

// Interface EXATA para as props
interface WeatherForecastProps {
  lat: number;
  lon: number;
}

// Tipos internos para os dados do clima (simplificado)
type WeatherCondition = "sunny" | "cloudy" | "rainy" | "snowy" | "stormy" | "foggy" | "partlyCloudy";
interface WeatherData {
  temperature: number;
  condition: WeatherCondition;
  description: string;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ lat, lon }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Extrai o primeiro forecast (ou o mais relevante, dependendo da API)
        const currentForecast = data?.list?.[0];

        if (!currentForecast || !currentForecast.main || !currentForecast.weather?.[0]) {
             console.warn("Formato inesperado da API de clima:", data);
             throw new Error("Dados de clima inválidos recebidos.");
        }

        const conditionCode = currentForecast.weather[0].id;
        let condition: WeatherCondition = "cloudy"; // Default

        if (conditionCode >= 200 && conditionCode < 300) condition = "stormy";
        else if (conditionCode >= 300 && conditionCode < 600) condition = "rainy";
        else if (conditionCode >= 600 && conditionCode < 700) condition = "snowy";
        else if (conditionCode >= 701 && conditionCode <= 781) condition = "foggy";
        else if (conditionCode === 800) condition = "sunny";
        else if (conditionCode === 801 || conditionCode === 802) condition = "partlyCloudy";
        else if (conditionCode === 803 || conditionCode === 804) condition = "cloudy";


        setWeather({
          temperature: Math.round(currentForecast.main.temp),
          condition: condition,
          description: currentForecast.weather[0].description,
        });

      } catch (err: any) {
        console.error("Falha ao buscar previsão do tempo:", err);
        setError(err.message || "Erro ao buscar clima.");
        setWeather(null); // Limpa dados antigos em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon]); // Refaz a busca se lat/lon mudarem

  const getWeatherIcon = (condition: WeatherCondition, size = "h-6 w-6") => {
    switch (condition) {
      case "sunny": return <Sun className={cn(size, "text-yellow-500")} />;
      case "cloudy": return <Cloud className={cn(size, "text-gray-400")} />;
      case "rainy": return <CloudRain className={cn(size, "text-blue-400")} />;
      case "snowy": return <CloudSnow className={cn(size, "text-blue-200")} />;
      case "stormy": return <CloudLightning className={cn(size, "text-purple-500")} />;
      case "foggy": return <CloudFog className={cn(size, "text-gray-300")} />;
      case "partlyCloudy": return <Sun className={cn(size, "text-yellow-500 opacity-70")} />; // Ícone temporário
      default: return <Thermometer className={cn(size, "text-muted-foreground")} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Previsão do Tempo</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        )}
        {error && !loading && (
          <p className="text-sm text-destructive">Falha ao carregar previsão: {error}</p>
        )}
        {weather && !loading && !error && (
          <div className="flex items-center space-x-4">
            {getWeatherIcon(weather.condition, "h-10 w-10")}
            <div>
              <p className="text-2xl font-bold">{weather.temperature}°C</p>
              <p className="text-sm text-muted-foreground capitalize">{weather.description}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;