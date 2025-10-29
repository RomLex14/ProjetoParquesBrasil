"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapContainerProps } from "react-leaflet";
import { LatLngExpression, Map as LeafletMapInstance } from "leaflet";
import "leaflet/dist/leaflet.css";

interface LeafletMapProps extends MapContainerProps {
  paths?: Array<Array<[number, number]>>;
  waypoints?: Array<{ position: [number, number]; name: string; description?: string }>;
  onMapReady?: (map: LeafletMapInstance) => void;
}

const LeafletMapClient = dynamic(() => import("./leaflet-map-client"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "400px",
        background: "#eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Carregando Mapa...
    </div>
  ),
});

const LeafletMap = (props: LeafletMapProps) => {
  const [mounted, setMounted] = useState(false);

  // ⚙️ Este guard garante que o mapa só é montado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Evita renderização duplicada no React 18 (dev)

  return <LeafletMapClient {...props} />;
};

export default LeafletMap;
