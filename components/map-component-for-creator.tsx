"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, LayersControl, useMap } from "react-leaflet"
import L from "leaflet"

import "leaflet/dist/leaflet.css"
import "@geoman-io/leaflet-geoman-free"
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css"

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

// --- Interface para corrigir o erro 'Property pm does not exist' ---
interface LeafletMapWithGeoman extends L.Map {
  pm: any;
}

interface MapComponentProps {
  onRouteChanged?: (geojson: any, distance: number) => void
}

function GeomanControls({ onRouteChanged }: { onRouteChanged?: (geojson: any, distance: number) => void }) {
  const map = useMap() as LeafletMapWithGeoman; // Cast do mapa para nossa interface estendida

  useEffect(() => {
    if (!map) return;

    // Inicializa controles
    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawCircleMarker: false,
      drawRectangle: false,
      drawPolygon: false,
      drawText: false,
      drawMarker: true,
      drawPolyline: true,
      editMode: true,
      dragMode: false,
      cutPolygon: false,
      rotateMode: false,
    });

    map.pm.setGlobalOptions({
      snappable: true,
      snapDistance: 20,
      templineStyle: { color: 'red', dashArray: '5,5' },
      hintlineStyle: { color: 'red', dashArray: '5,5' },
      pathOptions: { color: '#2563eb', weight: 4 }
    });

    const handleUpdate = () => {
      // 1. Resolve erro: Parameter 'layer' implicitly has an 'any' type
      const layers = map.pm.getGeomanDrawLayers();
      
      const features = layers.map((layer: any) => {
        // Verifica se a camada tem o método toGeoJSON (Markers e Polylines têm)
        if (layer.toGeoJSON) {
          return layer.toGeoJSON();
        }
        return null;
      }).filter(Boolean); // Remove nulos

      const geojson = {
        type: "FeatureCollection",
        features: features
      };

      // Cálculo de distância
      let totalDistance = 0;
      layers.forEach((layer: any) => {
        if (layer instanceof L.Polyline) {
          const latlngs = layer.getLatLngs() as L.LatLng[];
          // L.Polyline pode ter arrays aninhados (multipolyline), tratamos o caso simples aqui
          if (Array.isArray(latlngs) && latlngs.length > 1 && latlngs[0] instanceof L.LatLng) {
             for (let i = 0; i < latlngs.length - 1; i++) {
               totalDistance += latlngs[i].distanceTo(latlngs[i + 1]);
             }
          }
        }
      });

      if (onRouteChanged) {
        onRouteChanged(geojson, totalDistance / 1000);
      }
    };

    // Listeners
    map.on('pm:create', (e) => {
      handleUpdate();
      e.layer.on('pm:edit', handleUpdate);
    });
    map.on('pm:remove', handleUpdate);

    return () => {
      map.pm.removeControls();
    };
  }, [map, onRouteChanged]);

  return null;
}

export default function MapComponentForCreator({ onRouteChanged }: MapComponentProps) {
  return (
    <div className="h-full w-full relative z-0">
      <MapContainer
        center={[-15.7942, -47.8822]}
        zoom={13}
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

        <GeomanControls onRouteChanged={onRouteChanged} />
        
      </MapContainer>
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border text-sm font-medium text-center pointer-events-none">
        💡 Use a camada "Satélite" para desenhar trilhas não mapeadas
      </div>
    </div>
  )
}