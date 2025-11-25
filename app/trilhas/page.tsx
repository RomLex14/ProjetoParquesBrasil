// app/trilhas/page.tsx
"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mountain, Search, MapPin, Star, TrendingUp, ChevronDown } from "lucide-react";

import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { featuredTrails } from "@/lib/data";

const ITEMS_PER_PAGE = 9;

export default function TrilhasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);

  // Lógica de Filtragem
  const filteredTrails = featuredTrails.filter((trail) => {
    const matchesSearch = 
      trail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trail.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = difficultyFilter ? trail.difficulty === difficultyFilter : true;

    return matchesSearch && matchesDifficulty;
  });

  // Lógica de Paginação
  const currentTrails = filteredTrails.slice(0, visibleItems);
  const hasMore = visibleItems < filteredTrails.length;

  const handleLoadMore = () => {
    setVisibleItems((prev) => prev + ITEMS_PER_PAGE);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case "Fácil": return "bg-emerald-500 hover:bg-emerald-600";
        case "Moderado": return "bg-amber-500 hover:bg-amber-600";
        case "Difícil": return "bg-red-500 hover:bg-red-600";
        case "Extrema": return "bg-purple-500 hover:bg-purple-600";
        default: return "bg-blue-500 hover:bg-blue-600";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-8">
        {/* CABEÇALHO E BUSCA */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-6">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold flex items-center justify-center lg:justify-start gap-2">
              <Mountain className="h-8 w-8 text-primary" />
              Explorar Trilhas
            </h1>
            <p className="text-muted-foreground mt-1">
              Encontre o caminho perfeito para sua próxima aventura no cerrado.
            </p>
          </div>
          
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nome ou localidade..."
              className="pl-10 h-12 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* FILTROS */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start">
          <Button 
            variant={difficultyFilter === null ? "default" : "outline"} 
            onClick={() => setDifficultyFilter(null)}
            className="rounded-full"
          >
            Todas
          </Button>
          <Button 
            variant={difficultyFilter === "Fácil" ? "default" : "outline"} 
            onClick={() => setDifficultyFilter(difficultyFilter === "Fácil" ? null : "Fácil")}
            className="rounded-full border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-800 dark:hover:bg-emerald-900/20"
          >
            Fácil
          </Button>
          <Button 
            variant={difficultyFilter === "Moderado" ? "default" : "outline"} 
            onClick={() => setDifficultyFilter(difficultyFilter === "Moderado" ? null : "Moderado")}
            className="rounded-full border-amber-200 hover:bg-amber-50 hover:text-amber-700 dark:border-amber-800 dark:hover:bg-amber-900/20"
          >
            Moderado
          </Button>
          <Button 
            variant={difficultyFilter === "Difícil" ? "default" : "outline"} 
            onClick={() => setDifficultyFilter(difficultyFilter === "Difícil" ? null : "Difícil")}
            className="rounded-full border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-900/20"
          >
            Difícil
          </Button>
        </div>

        {/* GRID DE TRILHAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTrails.map((trail) => (
            <Link href={`/trilhas/${trail.id}`} key={trail.id} className="group">
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden">
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={trail.imageUrl}
                    alt={trail.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  <div className="absolute top-3 right-3">
                    <Badge className={`${getDifficultyColor(trail.difficulty)} text-white border-none shadow-sm px-3 py-1`}>
                      {trail.difficulty}
                    </Badge>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-bold text-lg leading-tight mb-1">{trail.name}</h3>
                    <div className="flex items-center text-xs opacity-90">
                       <MapPin className="h-3.5 w-3.5 mr-1" /> {trail.location}
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500 fill-current" />
                      <span className="font-medium text-foreground">{trail.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>{trail.elevation}m</span>
                    </div>
                    <div className="font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">
                      {trail.distance} km
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* ESTADO VAZIO */}
        {filteredTrails.length === 0 && (
          <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
            <p className="text-muted-foreground text-lg mb-2">Nenhuma trilha encontrada com esses filtros.</p>
            <Button variant="link" onClick={() => { setSearchTerm(""); setDifficultyFilter(null); }}>
              Limpar filtros
            </Button>
          </div>
        )}

        {/* BOTÃO CARREGAR MAIS (PAGINAÇÃO) */}
        {hasMore && (
          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" onClick={handleLoadMore} className="min-w-[200px] gap-2">
              Carregar mais trilhas <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}