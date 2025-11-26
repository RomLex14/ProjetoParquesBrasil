"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Star, TrendingUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trilhas } from "@/lib/types";

const ITEMS_PER_PAGE = 9;

export default function TrilhasListClient({ initialTrails }: { initialTrails: Trilhas[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);

  const filteredTrails = initialTrails.filter((trail) => {
    const matchesSearch = 
      trail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trail.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Ajuste fino para bater com o ENUM do banco (que pode vir como "Fácil" ou "facil")
    const matchesDifficulty = difficultyFilter 
      ? trail.difficulty.toLowerCase() === difficultyFilter.toLowerCase() 
      : true;

    return matchesSearch && matchesDifficulty;
  });

  const currentTrails = filteredTrails.slice(0, visibleItems);
  const hasMore = visibleItems < filteredTrails.length;

  const handleLoadMore = () => setVisibleItems((prev) => prev + ITEMS_PER_PAGE);

  const getDifficultyColor = (difficulty: string) => {
    const d = difficulty.toLowerCase();
    if (d.includes("fácil") || d.includes("facil")) return "bg-emerald-500 hover:bg-emerald-600";
    if (d.includes("moderada")) return "bg-amber-500 hover:bg-amber-600";
    if (d.includes("difícil") || d.includes("dificil")) return "bg-red-500 hover:bg-red-600";
    if (d.includes("extrema")) return "bg-purple-500 hover:bg-purple-600";
    return "bg-blue-500 hover:bg-blue-600";
  };

  return (
    <>
       <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            <Button 
              variant={difficultyFilter === null ? "default" : "outline"} 
              onClick={() => setDifficultyFilter(null)}
              className="rounded-full"
            >
              Todas
            </Button>
            {['Fácil', 'Moderada', 'Difícil'].map((diff) => (
               <Button 
               key={diff}
               variant={difficultyFilter === diff ? "default" : "outline"} 
               onClick={() => setDifficultyFilter(difficultyFilter === diff ? null : diff)}
               className="rounded-full"
             >
               {diff}
             </Button>
            ))}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTrails.map((trail) => (
            <Link href={`/trilhas/${trail.id}`} key={trail.id} className="group">
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden">
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={trail.imageUrl || "/placeholder.jpg"}
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

        {filteredTrails.length === 0 && (
          <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
            <p className="text-muted-foreground text-lg mb-2">Nenhuma trilha encontrada.</p>
          </div>
        )}

        {hasMore && (
          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" onClick={handleLoadMore} className="min-w-[200px] gap-2">
              Carregar mais trilhas <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        )}
    </>
  );
}