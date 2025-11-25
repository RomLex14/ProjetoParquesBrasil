"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ CORREÇÃO CRUCIAL: Definir a interface aqui sem usar tipos do Leaflet (L.LatLng)
// Isso permite que o componente pai importe este arquivo sem carregar o Leaflet imediatamente.
export interface MapComponentProps {
  userPath: { lat: number; lng: number }[]; 
}

export default function MapComponentForRecorder({ userPath }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const userPathLayerRef = useRef<L.LayerGroup | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Fix para ícones do Leaflet
  useEffect(() => {
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
  }, []);

  useEffect(() => {
    // Inicializa o mapa apenas se a div existir e o mapa ainda não
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current).setView([-15.7942, -47.8825], 5);
      
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      userPathLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
    }

    // Cleanup para evitar vazamento de memória e erros de re-renderização
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Atualiza o desenho da rota quando userPath muda
  useEffect(() => {
    const map = mapRef.current;
    const userLayer = userPathLayerRef.current;
    if (!map || !userLayer) return;

    userLayer.clearLayers();

    if (userPath.length > 1) {
      // Leaflet aceita arrays de objetos {lat, lng} nativamente
      L.polyline(userPath, {
        color: '#3b82f6',
        weight: 5,
        opacity: 0.9,
      }).addTo(userLayer);
    }

    if (userPath.length > 0) {
      const currentPosition = userPath[userPath.length - 1];
      L.circleMarker(currentPosition, {
        radius: 8,
        color: 'white',
        weight: 2,
        fillColor: '#3b82f6',
        fillOpacity: 1,
      }).addTo(userLayer);

      // Auto-pan suave
      map.panTo(currentPosition);
      if (map.getZoom() < 15) {
          map.setZoom(16);
      }
    }
  }, [userPath]);

  return <div ref={mapContainerRef} className="h-full w-full z-0" />;
}