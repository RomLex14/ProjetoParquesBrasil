"use client"

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { Trilhas } from "@/lib/types";
import { getTrailById, featuredTrails } from "@/lib/data";

// Fix para ícones do Leaflet
if (typeof window !== "undefined") {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
}

interface LeafletMapClientProps {
    trailId?: string;
    showAllTrails?: boolean;
    trailsToDisplay?: Trilhas[];
    fullscreen?: boolean;
    selectedTrailId?: string;
}

export default function LeafletMapClient({
    trailId,
    showAllTrails = false,
    trailsToDisplay,
    fullscreen = false,
    selectedTrailId,
}: LeafletMapClientProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMapRef = useRef<L.Map | null>(null);
    const trailLayersRef = useRef<L.LayerGroup | null>(null);
    const router = useRouter();

    const getTrailColor = (difficulty: Trilhas["difficulty"]): string => {
        // ... (código da função inalterado)
        switch (difficulty) {
            case "Fácil": return "#22c55e";
            case "Moderado": return "#eab308";
            case "Difícil": return "#ef4444";
            case "Extrema": return "#8b5cf6";
            default: return "#3b82f6";
        }
    };

    useEffect(() => {
        if (mapRef.current && !leafletMapRef.current) {
            const defaultCenter: L.LatLngTuple = [-15.7801, -47.9292];
            leafletMapRef.current = L.map(mapRef.current, { attributionControl: false }).setView(defaultCenter, 5);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(leafletMapRef.current);
            L.control.attribution({ prefix: '<a href="https://leafletjs.com">Leaflet</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' }).addTo(leafletMapRef.current);
            trailLayersRef.current = L.layerGroup().addTo(leafletMapRef.current);
        }
    }, []);

    useEffect(() => {
        const map = leafletMapRef.current;
        const layers = trailLayersRef.current;
        if (!map || !layers) return;

        layers.clearLayers();

        let finalTrailsToDisplay: Trilhas[] = [];
        if (trailsToDisplay) {
            finalTrailsToDisplay = trailsToDisplay;
        } else if (showAllTrails) {
            finalTrailsToDisplay = featuredTrails;
        } else if (trailId) {
            const specificTrail = getTrailById(trailId);
            if (specificTrail) finalTrailsToDisplay = [specificTrail];
        }

        if (finalTrailsToDisplay.length === 0) return;
        
        let collectiveBounds: L.LatLngBounds | null = null;
        let selectedTrailBounds: L.LatLngBounds | null = null;

        finalTrailsToDisplay.forEach((trail) => {
            // Desenha o traçado da trilha (código existente)
            if (trail.path && trail.path.length >= 2) {
                const pathLatLngs: L.LatLngTuple[] = trail.path.map(p => [p.lat, p.lng]);
                const isSelected = trail.id === selectedTrailId;
                const trailColor = getTrailColor(trail.difficulty);

                const pathLine = L.polyline(pathLatLngs, {
                    color: trailColor,
                    weight: isSelected ? 7 : 5,
                    opacity: isSelected ? 1.0 : 0.8,
                }).addTo(layers);
                
                pathLine.on('click', () => router.push(`/trilhas/${trail.id}`));
                pathLine.bindTooltip(trail.name, { permanent: false, direction: 'top' });

                const currentBounds = L.latLngBounds(pathLatLngs);
                if (!collectiveBounds) {
                    collectiveBounds = currentBounds;
                } else {
                    collectiveBounds.extend(currentBounds);
                }
                if (isSelected) {
                    selectedTrailBounds = currentBounds;
                }
            } else if (trail.coordinates) {
                 L.marker([trail.coordinates.lat, trail.coordinates.lng]).addTo(layers).bindPopup(`<b>${trail.name}</b>`);
            }
            // WAYPOINTS
            if (trail.waypoints && trail.waypoints.length > 0) {
                trail.waypoints.forEach(point => {
                    const waypointIcon = L.divIcon({
                        html: `
                            <div style="background-color: #4f46e5; color: white; border-radius: 50%; width: 22px; height: 22px; display: flex; justify-content: center; align-items: center; font-size: 12px; font-weight: bold; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);">
                               📍 
                            </div>
                        `,
                        className: 'custom-waypoint-icon',
                        iconSize: [22, 22],
                        iconAnchor: [11, 11]
                    });

                    L.marker([point.lat, point.lng], { icon: waypointIcon })
                        .addTo(layers)
                        .bindPopup(`<b>${point.name}</b>`);
                });
            }
        });
        
        if (selectedTrailBounds) {
            map.fitBounds(selectedTrailBounds, { padding: [50, 50], maxZoom: 16 });
        } else if (collectiveBounds) {
            map.fitBounds(collectiveBounds, { padding: [50, 50], maxZoom: 16 });
        }

    }, [trailId, showAllTrails, trailsToDisplay, selectedTrailId, router]);

    return <div ref={mapRef} className="w-full h-full outline-none" />;
}