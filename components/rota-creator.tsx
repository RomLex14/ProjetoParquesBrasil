// components/rota-creator.tsx
"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import 'leaflet/dist/leaflet.css';

// Importamos apenas a tipagem, o componente carrega via dynamic
interface MapComponentProps {
  onRouteChanged: (geojson: any, distance: number) => void;
}

const MapComponentForCreator = dynamic<MapComponentProps>(
  () => import('@/components/map-component-for-creator'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Carregando ferramentas de desenho...</span>
      </div>
    ),
  }
);

const RotaCreator = () => {
  const router = useRouter();
  
  // Estado agora guarda o GeoJSON completo e a distância calculada pelo mapa
  const [routeData, setRouteData] = useState<{ geojson: any; distance: number } | null>(null);

  // Função chamada automaticamente pelo mapa sempre que o usuário desenha ou edita
  const handleRouteChanged = (geojson: any, distance: number) => {
    // Verifica se há features (desenhos) válidos
    if (geojson && geojson.features && geojson.features.length > 0) {
      setRouteData({ geojson, distance });
    } else {
      setRouteData(null);
    }
  };

  const handleFinalizeRoute = () => {
    if (!routeData) return;

    // Salva no formato esperado pela próxima página
    const dataToSave = {
      geojson: routeData.geojson,
      distance: routeData.distance * 1000, // Convertendo km para metros para manter padrão
      waypoints: [], // Mantemos vazio para compatibilidade, pois agora usamos geojson
    };
    
    sessionStorage.setItem('finalizingRoute', JSON.stringify(dataToSave));
    router.push('/rotas/finalizar?type=planejada');
  };

  return (
    <div className="flex flex-col flex-grow h-full relative">
      <div className="flex-grow relative w-full h-full z-0">
        <MapComponentForCreator onRouteChanged={handleRouteChanged} />
      </div>

      {/* Barra de Ação Flutuante */}
      <div className="absolute bottom-8 left-0 right-0 z-[1000] flex justify-center pointer-events-none">
        <div className="bg-background/90 backdrop-blur-md p-2 rounded-full shadow-xl border flex items-center gap-4 pointer-events-auto transition-all transform">
          
          {/* Feedback de Distância */}
          <div className="px-4 flex flex-col">
            <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Distância Estimada</span>
            <span className="text-lg font-mono font-bold text-primary">
              {routeData ? routeData.distance.toFixed(2) : "0.00"} <span className="text-sm text-foreground">km</span>
            </span>
          </div>

          {/* Botão de Ação */}
          <Button 
            size="lg" 
            className="rounded-full px-6 shadow-lg" 
            onClick={handleFinalizeRoute} 
            disabled={!routeData || routeData.distance === 0}
          >
            Avançar <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RotaCreator;