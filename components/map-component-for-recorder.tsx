"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapComponentProps {
  userPath: L.LatLng[];
}

export default function MapComponentForRecorder({ userPath }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const userPathLayerRef = useRef<L.LayerGroup | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current).setView([-15.7942, -47.8825], 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      userPathLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const userLayer = userPathLayerRef.current;
    if (!map || !userLayer) return;

    userLayer.clearLayers();

    if (userPath.length > 1) {
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

      if (map.getZoom() < 15) {
          map.flyTo(currentPosition, 16);
      } else {
          map.panTo(currentPosition);
      }
    }
  }, [userPath]);

  return <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />;
}