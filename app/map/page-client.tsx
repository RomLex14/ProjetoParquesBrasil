"use client"

import { useState } from "react";
import { Search, MapPin, TrendingUp, Mountain, Star, Loader2 } from "lucide-react";
import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import dynamic from "next/dynamic";
import { Trilhas } from "@/lib/types"; // Importe a tipagem correta

const LeafletMap = dynamic(() => import("@/components/leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted/20">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
});

// Recebe as trilhas como propriedade
export default function MapPageClient({ initialTrails }: { initialTrails: Trilhas[] }) {
    const [selectedTrailId, setSelectedTrailId] = useState<string | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState("");

    // Filtra baseado na lista recebida do servidor
    const filteredTrails = initialTrails.filter(
        (trail) =>
            trail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trail.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // ... (Funções auxiliares como getDifficultyColor mantidas)
    const handleTrailSelect = (id: string) => setSelectedTrailId(id);

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden">
            <Navbar />
            <div className="flex-1 flex flex-row overflow-hidden relative">
                {/* Sidebar com lista filtrada */}
                <aside className="w-full md:w-96 h-full bg-card border-r border-border z-20 flex flex-col shadow-xl flex-shrink-0">
                    <div className="p-5 border-b border-border bg-card">
                         {/* ... Inputs de busca ... */}
                         <Input 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            placeholder="Buscar trilhas..." 
                         />
                    </div>
                    
                    <ScrollArea className="flex-1">
                        <div className="p-4 space-y-3">
                            {filteredTrails.map(trail => (
                                // ... Card da trilha (copie a lógica de renderização do original) ...
                                // Ao clicar: handleTrailSelect(trail.id)
                                <div key={trail.id} onClick={() => handleTrailSelect(trail.id)}>
                                    {trail.name}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </aside>

                <main className="flex-1 relative w-full h-full bg-slate-100 dark:bg-slate-900 z-0 hidden md:block">
                    {/* Passamos as trilhas filtradas (ou todas) para o mapa */}
                    <LeafletMap 
                        trailsToDisplay={initialTrails} // Mapa mostra todas, ou filteredTrails se quiser que o mapa filtre junto
                        fullscreen 
                        selectedTrailId={selectedTrailId} 
                    />
                </main>
            </div>
        </div>
    );
}