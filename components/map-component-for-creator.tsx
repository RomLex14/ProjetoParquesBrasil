"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";

// Props do componente
interface MapComponentProps {
  waypoints: L.LatLng[];
  setWaypoints: React.Dispatch<React.SetStateAction<L.LatLng[]>>;
  initialPosition: { lat: number | null; lng: number | null };
}

export default function MapComponentForCreator({ waypoints, setWaypoints, initialPosition }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<L.Routing.Control | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Efeito para INICIALIZAR o mapa UMA ÚNICA VEZ
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, { attributionControl: false }).setView([-15.7942, -47.8825], 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      map.on('click', (e: L.LeafletMouseEvent) => {
        setWaypoints(prev => [...prev, e.latlng]);
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Array vazio garante que rode apenas uma vez

  // Efeito para centralizar no usuário
  useEffect(() => {
    if (initialPosition.lat && initialPosition.lng && mapRef.current) {
      mapRef.current.flyTo([initialPosition.lat, initialPosition.lng], 15);
    }
  }, [initialPosition.lat, initialPosition.lng]);

  // Efeito para SINCRONIZAR os waypoints (marcadores e rota) com o estado
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    waypoints.forEach((point, index) => {
      const marker = L.marker(point, { draggable: true }).addTo(map);
      
      marker.on('dragend', () => {
        const newWaypoints = [...waypoints];
        newWaypoints[index] = marker.getLatLng();
        setWaypoints(newWaypoints);
      });

      // ======================= CORREÇÃO AQUI =======================
      // A função de clique agora recebe o objeto de evento 'e' do Leaflet.
      marker.on('click', (e: L.LeafletMouseEvent) => {
        setWaypoints(prev => prev.filter((_, i) => i !== index));
        // Usamos 'e' para parar a propagação, em vez da variável global depreciada.
        L.DomEvent.stopPropagation(e); 
      });
      // ======================= FIM DA CORREÇÃO =======================

      markersRef.current.push(marker);
    });

    if (waypoints.length > 1) {
      if (routingControlRef.current) {
        routingControlRef.current.setWaypoints(waypoints);
      } else {
        routingControlRef.current = L.Routing.control({
          waypoints,
          routeWhileDragging: true,
          show: false,
          addWaypoints: false,
          createMarker: () => null,
          lineOptions: { styles: [{ color: '#059669', opacity: 0.8, weight: 6 }] },
        } as any).addTo(map);
      }
    } else if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

  }, [waypoints, setWaypoints]);

  return <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />;
}