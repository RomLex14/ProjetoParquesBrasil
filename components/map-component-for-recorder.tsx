"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Polyline, Marker, Popup, LayersControl, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// --- Correção de ícones do Leaflet no Next.js ---
if (typeof window !== 'undefined') {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// ✅ DEFINIÇÃO DA INTERFACE CORRETA
export interface MapRecorderProps {
  positions: { lat: number; lng: number }[];
  currentPosition: { lat: number; lng: number } | null;
}

function RecenterMap({ position }: { position: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], map.getZoom(), { animate: true });
    }
  }, [position, map]);
  return null;
}

export default function MapComponentForRecorder({ positions, currentPosition }: MapRecorderProps) {
  const defaultCenter = [-15.7942, -47.8822];
  const center = currentPosition ? [currentPosition.lat, currentPosition.lng] : defaultCenter;

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer
        center={center as [number, number]}
        zoom={16}
        scrollWheelZoom={true}
        className="h-full w-full rounded-lg"
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Mapa (Ruas)">
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satélite (Detalhado)">
            <TileLayer
              attribution='Tiles &copy; Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Topográfico">
            <TileLayer
              attribution='&copy; OpenTopoMap'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <Polyline 
          positions={positions} 
          pathOptions={{ color: '#ef4444', weight: 5, opacity: 0.8 }} 
        />

        {currentPosition && (
          <Marker position={[currentPosition.lat, currentPosition.lng]} icon={userIcon}>
            <Popup>Você está aqui</Popup>
          </Marker>
        )}

        <RecenterMap position={currentPosition} />
      </MapContainer>
      
      <div className="absolute top-4 left-16 z-[400] bg-white/90 backdrop-blur px-3 py-1 rounded-md shadow border text-xs font-bold text-red-600 flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        GRAVANDO TRAJETO
      </div>
    </div>
  )
}