"use client"

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, Star, MapPin } from "lucide-react";

import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { featuredTrails } from "@/lib/data";
import LeafletMap from "@/components/leaflet-map";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function MapPage() {
    // 1. A "MEMÓRIA": Criamos um "estado" para lembrar o ID da trilha selecionada.
    const [selectedTrailId, setSelectedTrailId] = useState<string | undefined>(undefined);
    
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTrails = featuredTrails.filter(
        (trail) =>
            trail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trail.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. A FUNÇÃO DE ATUALIZAÇÃO: Esta função será chamada quando o usuário clicar em uma trilha.
    // Ela atualiza a "memória" com o novo ID.
    const handleTrailSelect = (trailId: string) => {
        setSelectedTrailId(trailId);
    };

    return (
        <div className="flex flex-col h-screen bg-background">
            <Navbar />
            <div className="flex-1 flex flex-row overflow-hidden relative">
                {!sidebarOpen && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-4 left-4 z-20 bg-background/80 backdrop-blur-sm shadow-md"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Abrir barra lateral"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                )}

                <aside
                    className={cn(
                        "h-full bg-background border-r transition-all duration-300 z-10 flex-shrink-0 flex flex-col",
                        sidebarOpen ? "w-full md:w-80 lg:w-96" : "w-0 p-0 border-0"
                    )}
                    style={{ overflow: sidebarOpen ? 'visible' : 'hidden' }}
                >
                    <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
                        <h3 className="font-semibold text-lg">Trilhas</h3>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSidebarOpen(false)} aria-label="Fechar barra lateral">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="p-4 flex-shrink-0">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Filtrar trilhas..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                        {filteredTrails.map((trail) => (
                            <div
                                key={trail.id}
                                className={cn(
                                    "p-3 rounded-lg cursor-pointer transition-colors mb-2 border",
                                    selectedTrailId === trail.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50 border-transparent"
                                )}
                                // 3. O EVENTO DE CLIQUE: Cada item da lista agora chama a função para atualizar a memória.
                                onClick={() => handleTrailSelect(trail.id)}
                            >
                                <h4 className="font-semibold text-sm truncate">{trail.name}</h4>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    <MapPin className="h-3 w-3 mr-1.5" />
                                    <span className="truncate">{trail.location}</span>
                                </div>
                                <div className="flex items-center justify-between mt-2 text-xs">
                                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500 fill-yellow-400" /> {trail.rating}</span>
                                    <Badge variant="outline" className="text-xs">{trail.difficulty}</Badge>
                                    <span>{trail.distance} km</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
                
                <main className="flex-1 relative">
                    {/* 4. AVISANDO O MAPA: Passamos a "memória" (selectedTrailId) para o componente do mapa. */}
                    <LeafletMap showAllTrails fullscreen selectedTrailId={selectedTrailId} />
                </main>
            </div>
        </div>
    );
}