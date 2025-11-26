// components/leaflet-map-client.tsx
"use client"

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { Trilhas } from "@/lib/types";
import { getTrailById, featuredTrails } from "@/lib/data";

// Fix de ícones do Leaflet
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
    recording?: boolean;
    // Adicionado suporte para rota do usuário
    userPath?: L.LatLng[] | { lat: number; lng: number }[];
}

export default function LeafletMapClient({
    trailId,
    showAllTrails = false,
    trailsToDisplay,
    fullscreen = false,
    selectedTrailId,
    userPath
}: LeafletMapClientProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMapRef = useRef<L.Map | null>(null);
    const layersRef = useRef<L.LayerGroup | null>(null);
    const router = useRouter();

    // 1. INICIALIZAÇÃO DO MAPA
    useEffect(() => {
        if (typeof window === "undefined") return;

        if (mapRef.current && !leafletMapRef.current) {
            const map = L.map(mapRef.current, { 
                attributionControl: false,
                zoomControl: false,
                preferCanvas: true 
            }).setView([-15.7801, -47.9292], 10);

            // Tile Layer (CartoDB Voyager para visualização limpa)
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OSM &copy; CARTO',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(map);
            
            L.control.zoom({ position: 'bottomright' }).addTo(map);
            
            layersRef.current = L.layerGroup().addTo(map);
            leafletMapRef.current = map;
        }

        return () => {
            if (leafletMapRef.current) {
                leafletMapRef.current.remove();
                leafletMapRef.current = null;
                layersRef.current = null;
            }
        };
    }, []); 

    // 2. RENDERIZAÇÃO DAS TRILHAS
    useEffect(() => {
        if (typeof window === "undefined") return;

        const map = leafletMapRef.current;
        const layers = layersRef.current;
        
        if (!map || !layers) return;

        layers.clearLayers();

        // --- CASO 1: EXIBIR ROTA DO USUÁRIO (userPath) ---
        if (userPath && userPath.length > 0) {
            // Converte para array de tuplas [lat, lng] garantido
            const latLngs: L.LatLngTuple[] = userPath.map(p => [p.lat, p.lng]);

            // Desenha a linha
            L.polyline(latLngs, {
                color: '#2563eb', // Azul vibrante
                weight: 5,
                opacity: 0.9,
                lineCap: 'round',
                lineJoin: 'round'
            }).addTo(layers);

            // Marcador de Início (Verde)
            const startIcon = L.divIcon({
                className: '',
                html: `<div style="background-color: #10b981; width: 16px; height: 16px; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                iconSize: [16, 16]
            });
            L.marker(latLngs[0], { icon: startIcon }).addTo(layers).bindPopup("Início");

            // Marcador de Fim (Vermelho)
            const endIcon = L.divIcon({
                className: '',
                html: `<div style="background-color: #ef4444; width: 16px; height: 16px; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                iconSize: [16, 16]
            });
            L.marker(latLngs[latLngs.length - 1], { icon: endIcon }).addTo(layers).bindPopup("Chegada");

            // Ajusta o zoom para caber a rota inteira
            const bounds = L.latLngBounds(latLngs);
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
            return; // Encerra aqui se estiver mostrando rota de usuário
        }

        // --- CASO 2: EXIBIR TRILHAS PADRÃO DO SISTEMA ---
        let finalTrails: Trilhas[] = [];
        if (trailsToDisplay) finalTrails = trailsToDisplay;
        else if (showAllTrails) finalTrails = featuredTrails;
        else if (trailId) {
            const t = getTrailById(trailId);
            if (t) finalTrails = [t];
        }

        if (finalTrails.length === 0) return;
        
        const bounds = L.latLngBounds([]);
        let selectedBounds: L.LatLngBounds | null = null;

        finalTrails.forEach((trail) => {
            const isSelected = trail.id === selectedTrailId;
            
            let baseColor = "#3b82f6"; 
            if (trail.difficulty === "Fácil") baseColor = "#10b981";
            if (trail.difficulty === "Moderado") baseColor = "#f59e0b";
            if (trail.difficulty === "Difícil") baseColor = "#ef4444";

            const displayColor = isSelected ? "#2563eb" : baseColor;
            
            // Ícone SVG
            const iconHtml = `
                <div style="
                    background-color: ${displayColor};
                    width: ${isSelected ? '32px' : '24px'};
                    height: ${isSelected ? '32px' : '24px'};
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    border: 2px solid white;
                    box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
                    display: flex; align-items: center; justify-content: center;
                    margin-top: -${isSelected ? '16px' : '12px'};
                    transition: all 0.3s ease;
                ">
                    <div style="
                        width: ${isSelected ? '10px' : '6px'};
                        height: ${isSelected ? '10px' : '6px'};
                        background: white;
                        border-radius: 50%;
                        transform: rotate(45deg);
                    "></div>
                </div>
            `;

            const customIcon = L.divIcon({
                className: 'custom-marker-pin',
                html: iconHtml,
                iconSize: isSelected ? [32, 32] : [24, 24],
                iconAnchor: isSelected ? [16, 32] : [12, 24],
            });

            if (trail.path && trail.path.length > 1) {
                const latLngs: L.LatLngTuple[] = trail.path.map(p => [p.lat, p.lng]);
                
                if (isSelected) {
                    L.polyline(latLngs, { color: 'white', weight: 6, opacity: 1 }).addTo(layers);
                    L.polyline(latLngs, { color: '#2563eb', weight: 4, opacity: 1, lineCap: 'round', lineJoin: 'round' }).addTo(layers);
                    
                    const marker = L.marker(latLngs[0], { icon: customIcon }).addTo(layers);
                    marker.bindPopup(`<b>${trail.name}</b><br>${trail.distance} km`).openPopup();
                    selectedBounds = L.latLngBounds(latLngs);
                } else {
                    const polyline = L.polyline(latLngs, {
                        color: baseColor, weight: 3, opacity: 0.6, dashArray: '5, 10', lineCap: 'round', lineJoin: 'round'
                    }).addTo(layers);
                    polyline.on('click', () => router.push(`/trilhas/${trail.id}`));
                    L.marker(latLngs[0], { icon: customIcon }).addTo(layers)
                        .bindPopup(`<b>${trail.name}</b><br>${trail.distance} km`)
                        .on('click', () => router.push(`/trilhas/${trail.id}`));
                }
                bounds.extend(latLngs);
            } 
            else if (trail.coordinates) {
                 const marker = L.marker([trail.coordinates.lat, trail.coordinates.lng], { icon: customIcon }).addTo(layers).bindPopup(`<b>${trail.name}</b>`);
                 bounds.extend([trail.coordinates.lat, trail.coordinates.lng]);
                 if (isSelected) {
                    marker.openPopup();
                    selectedBounds = L.latLngBounds([[trail.coordinates.lat, trail.coordinates.lng]]);
                 }
            }
        });
        
        if (selectedBounds && map) {
            map.flyToBounds(selectedBounds, { padding: [50, 50], maxZoom: 16, animate: true, duration: 1 });
        } else if (bounds.isValid() && map && !selectedTrailId) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }

    }, [trailId, showAllTrails, trailsToDisplay, selectedTrailId, router, userPath]);

    return (
        <div 
            ref={mapRef} 
            className="w-full h-full outline-none z-0 relative bg-slate-100" 
            style={{ minHeight: "100%", width: "100%", height: "100%" }}
        />
    );
}