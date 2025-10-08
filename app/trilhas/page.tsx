// app/trilhas/page.tsx

"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import {
  Mountain,
  Search,
  Filter,
  MapPin,
  Compass,
  Star,
  TrendingUp,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { featuredTrails, getPopularTrails, getTopRatedTrails, getNearbyTrails } from "@/lib/data" 
import type { Trilhas } from "@/lib/types"
import { useGeolocation } from "@/hooks/use-geolocation"
import Navbar from "@/components/navbar"
import TrailCard from "@/components/trail-card"

export default function TrilhasPage() {
  const [allTrilhas, setAllTrilhas] = useState<Trilhas[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("sugeridas");
  const { latitude, longitude, loading: loadingLocation } = useGeolocation();

  // Carrega os dados mocados uma vez
  useEffect(() => {
    // Simula um carregamento inicial
    setTimeout(() => {
        setAllTrilhas(featuredTrails);
        setIsLoading(false);
    }, 500);
  }, []);

  // Hook 'useMemo' para calcular a lista de trilhas a ser exibida.
  // Ele só será recalculado quando uma das dependências mudar.
  const displayedTrilhas = useMemo(() => {
    let filteredData: Trilhas[] = [];

    // 1. Aplica o filtro principal (botões)
    switch (activeFilter) {
      case "perto_de_mim":
        if (latitude && longitude) {
            filteredData = getNearbyTrails(latitude, longitude);
        } else {
            filteredData = []; // Retorna vazio se a localização não estiver pronta
        }
        break;
      case "bem_avaliadas":
        filteredData = getTopRatedTrails();
        break;
      case "populares":
        filteredData = getPopularTrails();
        break;
      case "sugeridas":
      default:
        filteredData = [...allTrilhas];
    }
    
    // 2. Aplica o filtro de busca por texto sobre o resultado anterior
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      return filteredData.filter(trail =>
        trail.name.toLowerCase().includes(lowercasedFilter) ||
        trail.location.toLowerCase().includes(lowercasedFilter)
      );
    }

    return filteredData;
  }, [activeFilter, searchTerm, allTrilhas, latitude, longitude]);


  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8 px-4">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Descubra Trilhas Incríveis
              </h1>
              <p className="text-muted-foreground">
                Explore trilhas por todo o Brasil, filtrando por popularidade ou proximidade.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex flex-wrap gap-2">
                    <Button variant={activeFilter === 'sugeridas' ? 'default' : 'outline'} size="sm" className="rounded-full" onClick={() => setActiveFilter('sugeridas')}>
                      <Compass className="mr-2 h-4 w-4" /> Sugeridas
                    </Button>
                    <Button variant={activeFilter === 'perto_de_mim' ? 'default' : 'outline'} size="sm" className="rounded-full" onClick={() => setActiveFilter('perto_de_mim')} disabled={loadingLocation || !latitude}>
                      {loadingLocation ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Localizando...</>) : (<><MapPin className="mr-2 h-4 w-4" />Perto de Mim</>)}
                    </Button>
                    <Button variant={activeFilter === 'bem_avaliadas' ? 'default' : 'outline'} size="sm" className="rounded-full" onClick={() => setActiveFilter('bem_avaliadas')}>
                        <Star className="mr-2 h-4 w-4" /> Mais Bem Avaliadas
                    </Button>
                    <Button variant={activeFilter === 'populares' ? 'default' : 'outline'} size="sm" className="rounded-full" onClick={() => setActiveFilter('populares')}>
                      <TrendingUp className="mr-2 h-4 w-4" />Populares
                    </Button>
                </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Buscar nas trilhas exibidas..." 
                    className="pl-8 pr-4 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Sheet>
                  <SheetTrigger asChild><Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button></SheetTrigger>
                  <SheetContent>
                    <SheetHeader><SheetTitle>Filtrar Trilhas</SheetTitle></SheetHeader>
                    <div className="grid gap-4 py-4 text-center text-muted-foreground">Filtros avançados em breve.</div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {displayedTrilhas.length > 0 ? (
                  displayedTrilhas.map((trail) => (
                    <TrailCard key={trail.id} trail={trail} />
                  ))
                ) : (
                  <div className="text-center py-10 col-span-full">
                     <Mountain className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                     <p className="text-muted-foreground">Nenhuma trilha encontrada para este filtro.</p>
                   </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}