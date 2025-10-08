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

// Atualiza a interface para receber a nova propriedade
interface LeafletMapClientProps {
    trailId?: string;
    showAllTrails?: boolean;
    trailsToDisplay?: Trilhas[];
    fullscreen?: boolean;
    selectedTrailId?: string;
    userPath?: L.LatLng[]; // <-- Propriedade adicionada
}

export default function LeafletMapClient({
    trailId,
    showAllTrails = false,
    trailsToDisplay,
    fullscreen = false,
    selectedTrailId,
    userPath, // <-- Propriedade recebida
}: LeafletMapClientProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMapRef = useRef<L.Map | null>(null);
    const trailLayersRef = useRef<L.LayerGroup | null>(null);
    const userPathLayerRef = useRef<L.LayerGroup | null>(null); // Nova camada para o trajeto do usuário
    const router = useRouter();

    const getTrailColor = (difficulty: Trilhas["difficulty"]): string => {
        switch (difficulty) {
            case "Fácil": return "#22c55e";
            case "Moderado": return "#eab308";
            case "Difícil": return "#ef4444";
            case "Extrema": return "#8b5cf6";
            default: return "#3b82f6";
        }
    };

    // Efeito para inicializar o mapa (sem alterações)
    useEffect(() => {
        if (mapRef.current && !leafletMapRef.current) {
            const defaultCenter: L.LatLngTuple = [-15.7801, -47.9292];
            leafletMapRef.current = L.map(mapRef.current, { attributionControl: false }).setView(defaultCenter, 5);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(leafletMapRef.current);
            L.control.attribution({ prefix: '<a href="https://leafletjs.com">Leaflet</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' }).addTo(leafletMapRef.current);
            trailLayersRef.current = L.layerGroup().addTo(leafletMapRef.current);
            userPathLayerRef.current = L.layerGroup().addTo(leafletMapRef.current); // Inicializa a nova camada
        }
    }, []);

    // Efeito para desenhar as trilhas (sem alterações)
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
        });
        
        if (selectedTrailBounds) {
            map.fitBounds(selectedTrailBounds, { padding: [50, 50], maxZoom: 16 });
        } else if (collectiveBounds) {
            map.fitBounds(collectiveBounds, { padding: [50, 50], maxZoom: 16 });
        }

    }, [trailId, showAllTrails, trailsToDisplay, selectedTrailId, router]);

    // Novo efeito para desenhar o trajeto do usuário
    useEffect(() => {
        const map = leafletMapRef.current;
        const userLayer = userPathLayerRef.current;
        if (!map || !userLayer) return;

        // Limpa o trajeto anterior
        userLayer.clearLayers();

        // Se houver um novo trajeto, desenha a linha
        if (userPath && userPath.length > 1) {
            L.polyline(userPath, {
                color: '#3b82f6', // Cor azul para diferenciar
                weight: 5,
                opacity: 0.9,
            }).addTo(userLayer);
        }

        // Adiciona um marcador na posição atual do usuário
        if (userPath && userPath.length > 0) {
            const currentPosition = userPath[userPath.length - 1];
            L.circleMarker(currentPosition, {
                radius: 8,
                color: 'white',
                weight: 2,
                fillColor: '#3b82f6',
                fillOpacity: 1,
            }).addTo(userLayer);

            // Centraliza o mapa na posição atual do usuário
            map.setView(currentPosition, map.getZoom() < 15 ? 15 : map.getZoom());
        }

    }, [userPath]); // Este efeito roda sempre que o 'userPath' mudar

    return <div ref={mapRef} className="w-full h-full outline-none" />;
}