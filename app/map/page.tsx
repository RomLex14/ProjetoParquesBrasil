// app/map/page.tsx
"use client"

import { useState } from "react";
import { Search, Star, MapPin, TrendingUp, Mountain } from "lucide-react";
import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { featuredTrails } from "@/lib/data";
import LeafletMap from "@/components/leaflet-map";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MapPage() {
    const [selectedTrailId, setSelectedTrailId] = useState<string | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTrails = featuredTrails.filter(
        (trail) =>
            trail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trail.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTrailSelect = (trailId: string) => {
        setSelectedTrailId(trailId);
    };

    // CORES AJUSTADAS PARA ALTO CONTRASTE NO MODO ESCURO
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Fácil": 
                return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/60 dark:text-emerald-300 dark:border-emerald-700";
            case "Moderado": 
                return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/60 dark:text-amber-300 dark:border-amber-700";
            case "Difícil": 
                return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/60 dark:text-red-300 dark:border-red-700";
            default: 
                return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden">
            <Navbar />
            <div className="flex-1 flex flex-row overflow-hidden relative">
                
                {/* --- BARRA LATERAL FIXA --- */}
                <aside className="w-full md:w-96 h-full bg-card border-r border-border z-20 flex flex-col shadow-xl flex-shrink-0">
                    
                    {/* Cabeçalho da Sidebar */}
                    <div className="p-5 border-b border-border bg-card">
                        <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-primary">
                            <Mountain className="h-6 w-6" />
                            Explorar Trilhas
                        </h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar trilha ou parque..."
                                className="pl-9 bg-muted/50 border-input focus:bg-background"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Lista de Trilhas (Scrollável) */}
                    <ScrollArea className="flex-1">
                        <div className="p-4 space-y-3">
                            {filteredTrails.length > 0 ? (
                                filteredTrails.map((trail) => (
                                    <div
                                        key={trail.id}
                                        onClick={() => handleTrailSelect(trail.id)}
                                        className={cn(
                                            "group p-4 rounded-xl cursor-pointer border transition-all duration-200",
                                            selectedTrailId === trail.id 
                                                ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20 dark:bg-primary/10" 
                                                : "bg-card border-border hover:border-primary/50 hover:bg-accent/50 hover:shadow-sm"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className={cn(
                                                "font-bold text-sm line-clamp-1 transition-colors",
                                                selectedTrailId === trail.id ? "text-primary" : "text-foreground group-hover:text-primary"
                                            )}>
                                                {trail.name}
                                            </h4>
                                            <Badge variant="outline" className={cn("text-[10px] px-2 py-0.5 h-5 border font-semibold", getDifficultyColor(trail.difficulty))}>
                                                {trail.difficulty}
                                            </Badge>
                                        </div>
                                        
                                        <div className="flex items-center text-xs text-muted-foreground mb-3">
                                            <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                                            <span className="truncate">{trail.location}</span>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-2">
                                            <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                                                <span className="flex items-center text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-md border border-amber-100 dark:border-amber-900/30">
                                                    <Star className="h-3 w-3 mr-1 fill-current" /> 
                                                    {trail.rating}
                                                </span>
                                                <span className="flex items-center">
                                                    <TrendingUp className="h-3 w-3 mr-1" />
                                                    {trail.elevation}m
                                                </span>
                                            </div>
                                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full dark:bg-primary/20 dark:text-primary-foreground">
                                                {trail.distance} km
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 px-4 text-muted-foreground">
                                    <p className="text-sm font-medium">Nenhuma trilha encontrada.</p>
                                    <p className="text-xs mt-1">Tente buscar por outro termo.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    
                    {/* Rodapé da Sidebar */}
                    <div className="p-3 border-t border-border bg-muted/30 text-center text-xs text-muted-foreground font-medium">
                        {filteredTrails.length} trilhas encontradas
                    </div>
                </aside>
                
                {/* --- ÁREA DO MAPA --- */}
                <main className="flex-1 relative w-full h-full bg-slate-100 dark:bg-slate-900 z-0 hidden md:block">
                    <LeafletMap 
                        showAllTrails 
                        fullscreen 
                        selectedTrailId={selectedTrailId} 
                    />
                </main>
            </div>
        </div>
    );
}