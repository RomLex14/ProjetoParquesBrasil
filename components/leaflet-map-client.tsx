"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Navigation, AlertTriangle, Loader2 } from "lucide-react";
import L from "leaflet"; // Importação direta
import "leaflet/dist/leaflet.css";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGeolocation } from "@/hooks/use-geolocation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Trilhas } from "@/lib/types";
import { featuredTrails, getTrailById } from "@/lib/data"; // Usando dados mocados

// Fix para ícones do Leaflet (importante!)
const fixLeafletIcons = () => {
  if (typeof window !== "undefined") { // Garantir que só roda no cliente
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }
};
fixLeafletIcons(); // Chamar uma vez no escopo do módulo

interface LeafletMapClientProps {
  trailId?: string;       // ID da trilha específica a ser exibida e centralizada
  showAllTrails?: boolean;// Se true, mostra todas as featuredTrails
  fullscreen?: boolean;
  recording?: boolean;    // Para a página de gravação de trilha
  selectedTrailId?: string; // Para destacar uma trilha na visualização de múltiplas trilhas (ex: /map)
}

export default function LeafletMapClient({
  trailId,
  showAllTrails = false,
  fullscreen = false,
  recording = false,
  selectedTrailId,
}: LeafletMapClientProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const trailLayersRef = useRef<L.LayerGroup | null>(null); // Para agrupar camadas de trilhas

  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const { latitude, longitude, loading: loadingLocation, error: locationError } = useGeolocation({
    enableHighAccuracy: true,
    maximumAge: 15000,
    timeout: 12000,
  });
  const router = useRouter();

  // Função para obter a cor da trilha baseada na dificuldade
  const getTrailColor = (difficulty: Trilhas["difficulty"]): string => {
    switch (difficulty) {
      case "Fácil": return "#22c55e"; // green-500
      case "Moderado": return "#eab308"; // yellow-500
      case "Difícil": return "#ef4444"; // red-500
      default: return "#3b82f6"; // blue-500
    }
  };

  // Inicialização do Mapa
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return; // Inicializa apenas uma vez

    const defaultCenter: L.LatLngTuple = [-15.7801, -47.9292]; // Brasília
    leafletMapRef.current = L.map(mapRef.current, {
        attributionControl: false // Desabilitar o default para adicionar um customizado mais simples
    }).setView(defaultCenter, 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    }).addTo(leafletMapRef.current);
    L.control.attribution({prefix: '<a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors', position: 'bottomright'}).addTo(leafletMapRef.current);


    trailLayersRef.current = L.layerGroup().addTo(leafletMapRef.current);

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Atualizar Marcador do Usuário e Centralização
  useEffect(() => {
    if (!leafletMapRef.current || !latitude || !longitude) return;

    const userLatLng: L.LatLngTuple = [latitude, longitude];

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.circleMarker(userLatLng, {
        radius: 8, fillColor: "#3b82f6", color: "#2563eb", weight: 2, opacity: 1, fillOpacity: 0.8,
      }).addTo(leafletMapRef.current).bindPopup("Sua localização");
    } else {
      userMarkerRef.current.setLatLng(userLatLng);
    }

    if (isFollowingUser && !trailId && !showAllTrails) { // Só centraliza se não estiver mostrando uma trilha específica
      leafletMapRef.current.setView(userLatLng, 13);
    }
  }, [latitude, longitude, isFollowingUser, trailId, showAllTrails]);

  // Desenhar Trilhas
  useEffect(() => {
    if (!leafletMapRef.current || !trailLayersRef.current) return;

    trailLayersRef.current.clearLayers(); // Limpa trilhas anteriores

    const trailsToDisplay: Trilhas[] = [];
    if (showAllTrails) {
      trailsToDisplay.push(...featuredTrails);
    } else if (trailId) {
      const specificTrail = getTrailById(trailId); // Usando dados mocados
      if (specificTrail) {
        trailsToDisplay.push(specificTrail);
      }
    }

    if (trailsToDisplay.length === 0) return;

    let boundsToFit: L.LatLngBounds | null = null;

    trailsToDisplay.forEach((trail) => {
      if (!trail.path || trail.path.length < 2) return;

      const pathLatLngs: L.LatLngTuple[] = trail.path.map(p => [p.lat, p.lng]);
      const trailColor = getTrailColor(trail.difficulty);
      
      const isSelected = trail.id === selectedTrailId && showAllTrails; // Só aplica estilo de selecionado se showAllTrails

      const pathLine = L.polyline(pathLatLngs, {
        color: trailColor,
        weight: isSelected ? 6 : 4,
        opacity: isSelected ? 1 : 0.7,
        dashArray: isSelected ? "6, 6" : "10, 10",
      }).addTo(trailLayersRef.current!);

      // Marcador no final da trilha com popup
      const endPoint = pathLatLngs[pathLatLngs.length - 1];
      const endIcon = L.divIcon({
        className: "custom-div-icon-end",
        html: `<div style="background-color: ${trailColor}; border-radius: 50%; width: 14px; height: 14px; border: 2px solid white; box-shadow: 0 0 0 2px ${trailColor};"></div>`,
        iconSize: [14, 14], iconAnchor: [7, 7],
      });
      const endMarker = L.marker(endPoint, { icon: endIcon })
        .addTo(trailLayersRef.current!)
        .bindPopup(`
          <div style="width: 200px; font-family: sans-serif;">
            <h3 style="font-weight: bold; margin-bottom: 5px; font-size: 14px;">${trail.name}</h3>
            <p style="font-size: 12px; margin-bottom: 3px; color: #555;">${trail.location}</p>
            <p style="font-size: 12px; margin-bottom: 8px;">
              <span style="font-weight:bold;">Dificuldade:</span> ${trail.difficulty}
            </p>
            <button id="view-trail-${trail.id}" 
                    class="leaflet-popup-button"
                    style="background-color: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; width: 100%; font-size: 13px;">
              Ver Detalhes
            </button>
          </div>
        `);
        
      endMarker.on('popupopen', () => {
        const button = document.getElementById(`view-trail-${trail.id}`);
        if (button) {
          button.onclick = () => router.push(`/trilhas/${trail.id}`);
        }
      });
      
      pathLine.on('click', () => endMarker.openPopup());

      if (trail.id === selectedTrailId && showAllTrails) { // Destaca e abre popup se selecionado em modo "todas as trilhas"
         endMarker.openPopup();
      }

      // Acumular bounds para centralização
      const currentBounds = L.latLngBounds(pathLatLngs);
      if (!boundsToFit) {
        boundsToFit = currentBounds;
      } else {
        boundsToFit.extend(currentBounds);
      }
    });

    // Centralizar no mapa
    if (boundsToFit && leafletMapRef.current) {
      if (trailsToDisplay.length === 1 && trailId) { // Se é uma trilha específica (página de detalhes)
        leafletMapRef.current.fitBounds(boundsToFit, { padding: [40, 40], maxZoom: 15 });
      } else if (showAllTrails && trailsToDisplay.length > 0) { // Se mostrando todas as trilhas
         leafletMapRef.current.fitBounds(boundsToFit, { padding: [50, 50] });
      }
    }

  }, [trailId, showAllTrails, selectedTrailId, router]); // Dependência de selectedTrailId adicionada

  return (
    <div className={cn("relative w-full h-full bg-muted", fullscreen ? "absolute inset-0" : "")}>
      <div ref={mapRef} className="w-full h-full outline-none" tabIndex={0} aria-label="Mapa interativo de trilhas"></div>

      {locationError && !loadingLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-auto max-w-[calc(100%-2rem)]">
          <Alert variant="destructive" className="shadow-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Erro ao obter localização: {locationError}. Funcionalidades de mapa podem ser limitadas.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
        <Button
          variant="outline"
          size="icon"
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full h-10 w-10 shadow-md hover:bg-white dark:hover:bg-slate-700"
          title="Centralizar na sua localização"
          disabled={!latitude || !longitude || loadingLocation}
          onClick={() => {
            if (leafletMapRef.current && latitude && longitude) {
              leafletMapRef.current.setView([latitude, longitude], 14);
              setIsFollowingUser(true); // Ativa o seguimento ao centralizar manualmente
            }
          }}
        >
          {loadingLocation ? <Loader2 className="h-5 w-5 animate-spin" /> : <MapPin className="h-5 w-5" />}
        </Button>
        <Button
          variant={isFollowingUser ? "default" : "outline"}
          size="icon"
          className={cn(
            "rounded-full h-10 w-10 shadow-md",
            isFollowingUser ? "bg-primary hover:bg-primary/90" : "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-700"
          )}
          title={isFollowingUser ? "Parar de seguir localização" : "Seguir sua localização"}
          onClick={() => setIsFollowingUser(!isFollowingUser)}
          disabled={!latitude || !longitude}
        >
          <Navigation className={cn("h-5 w-5", isFollowingUser && "fill-current")} />
        </Button>
      </div>

      {showAllTrails && (
         <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-md p-3 shadow-md z-[1000] text-xs">
          <h4 className="text-sm font-semibold mb-2 text-foreground dark:text-slate-200">Legenda de Dificuldade</h4>
          <div className="space-y-1">
            {[
              { label: "Fácil", color: getTrailColor("Fácil") },
              { label: "Moderada", color: getTrailColor("Moderado") },
              { label: "Difícil", color: getTrailColor("Difícil") },
            ].map(item => (
              <div key={item.label} className="flex items-center">
                <div style={{ backgroundColor: item.color }} className="w-3 h-3 rounded-full mr-2 border border-slate-300 dark:border-slate-600"></div>
                <span className="text-muted-foreground dark:text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
