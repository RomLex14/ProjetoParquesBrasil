"use client";

import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L, { Map as LeafletMapInstance } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainerProps } from "react-leaflet";

// 🔧 Corrige ícones padrão do Leaflet (sem warning)
const FixLeafletIcons = () => {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);
  return null;
};

// 🧭 Tipagem de props
interface LeafletMapClientProps extends MapContainerProps {
  paths?: Array<Array<[number, number]>>;
  waypoints?: Array<{
    position: [number, number];
    name: string;
    description?: string;
  }>;
  onMapReady?: (map: LeafletMapInstance) => void;
}

// 🌍 Controla eventos do mapa (como onMapReady)
const MapLifecycle: React.FC<{
  onMapReady?: (map: LeafletMapInstance) => void;
}> = ({ onMapReady }) => {
  const map = useMap();

  useEffect(() => {
    if (map && onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  // ❌ Removido map.remove() — o React Leaflet já faz isso automaticamente
  return null;
};

// 🗺️ Componente principal
const LeafletMapClient: React.FC<LeafletMapClientProps> = ({
  paths,
  waypoints,
  style,
  onMapReady,
  ...mapContainerProps
}) => {
  return (
    <MapContainer
      style={style || { height: "100%", width: "100%" }}
      {...mapContainerProps}
    >
      <FixLeafletIcons />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Desenha linhas (rotas) */}
      {paths?.map((path, index) => (
        <Polyline key={index} positions={path} color="blue" />
      ))}

      {/* Marca pontos (waypoints) */}
      {waypoints?.map((waypoint, index) => (
        <Marker key={index} position={waypoint.position}>
          <Popup>
            <strong>{waypoint.name}</strong>
            {waypoint.description && <p>{waypoint.description}</p>}
          </Popup>
        </Marker>
      ))}

      {/* Lifecycle do mapa */}
      <MapLifecycle onMapReady={onMapReady} />
    </MapContainer>
  );
};

export default LeafletMapClient;
