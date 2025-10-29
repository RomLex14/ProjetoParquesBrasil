// components/rota-creator.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { LocateFixed, Trash2, CheckCircle, Loader2, RotateCcw } from "lucide-react";
import L from 'leaflet';
import { useRouter } from 'next/navigation';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  waypoints: L.LatLng[];
  setWaypoints: React.Dispatch<React.SetStateAction<L.LatLng[]>>;
  initialPosition: { lat: number | null; lng: number | null };
  onMapReady?: (map: L.Map) => void;
}

const MapComponentForCreator = dynamic<MapComponentProps>(
  () => import('@/components/map-component-for-creator'),
  {
    ssr: false,
    loading: () => <div className="flex h-full w-full items-center justify-center bg-muted"><Loader2 className="h-10 w-10 animate-spin" /></div>,
  }
);

const RotaCreator = () => {
  const router = useRouter();
  const [waypoints, setWaypoints] = useState<L.LatLng[]>([]);
  const [userInitialPosition, setUserInitialPosition] = useState<{ lat: number | null; lng: number | null }>({ lat: -15.7942, lng: -47.8825 });
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };
        setUserInitialPosition(userPos);
        if (mapRef.current && waypoints.length === 0) {
             mapRef.current.setView([userPos.lat, userPos.lng], 13);
        }
      },
      () => { console.warn("Não foi possível obter geolocalização."); }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLocateUser = () => {
     if (userInitialPosition.lat && userInitialPosition.lng) {
         const userLatLng = new L.LatLng(userInitialPosition.lat, userInitialPosition.lng);
         setWaypoints(prev => [...prev, userLatLng]);
         mapRef.current?.setView(userLatLng, mapRef.current.getZoom() < 15 ? 15 : mapRef.current.getZoom());
     } else {
       console.warn("Posição inicial não disponível.");
     }
  };

  const handleClearRoute = () => {
    setWaypoints([]);
  };

  const handleUndoLastWaypoint = () => {
      setWaypoints(prev => prev.slice(0, -1));
  };

  const handleFinalizeRoute = () => {
    const routeData = {
      waypoints: waypoints.map(wp => ({ lat: wp.lat, lng: wp.lng })),
    };
    sessionStorage.setItem('finalizingRoute', JSON.stringify(routeData));
    router.push('/rotas/finalizar?type=planejada');
  };

  return (
    <div className="flex flex-col flex-grow h-full">
      <div className="flex-grow relative">
        <MapComponentForCreator
          waypoints={waypoints}
          setWaypoints={setWaypoints}
          initialPosition={userInitialPosition}
          onMapReady={(mapInstance) => { mapRef.current = mapInstance; }}
        />
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
           <Button variant="secondary" size="icon" onClick={handleLocateUser} title="Adicionar minha localização atual">
             <LocateFixed className="h-5 w-5" />
           </Button>
           <Button variant="secondary" size="icon" onClick={handleUndoLastWaypoint} title="Desfazer último ponto" disabled={waypoints.length === 0}>
             <RotateCcw className="h-5 w-5" />
           </Button>
           <Button variant="destructive" size="icon" onClick={handleClearRoute} title="Limpar rota" disabled={waypoints.length === 0}>
             <Trash2 className="h-5 w-5" />
           </Button>
           <Button variant="default" size="icon" onClick={handleFinalizeRoute} title="Finalizar e adicionar detalhes" disabled={waypoints.length < 2}>
             <CheckCircle className="h-5 w-5" />
           </Button>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-lg pointer-events-none">
          <p className="text-sm text-center text-foreground">
            {waypoints.length === 0 ? "Clique no mapa para adicionar pontos." : waypoints.length === 1 ? "Adicione mais pontos." : `Rota com ${waypoints.length} pontos.`}
          </p>
       </div>
      </div>
    </div>
  );
};

export default RotaCreator;