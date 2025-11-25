// app/trilhas/[id]/page.tsx
"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, MapPin, Clock, TrendingUp, Star, 
  Share2, Heart, Navigation, Info, Map as MapIcon
} from "lucide-react";

import Navbar from "@/components/navbar";
// Footer removido para evitar duplicação com o layout global
// import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { getTrailById } from "@/lib/data";
import type { Trilhas } from "@/lib/types";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/leaflet-map"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted animate-pulse rounded-lg" />
});

export default function TrailDetailsPage() {
  const params = useParams();
  const [trail, setTrail] = useState<Trilhas | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const foundTrail = getTrailById(params.id as string);
      setTrail(foundTrail);
      setLoading(false);
    }
  }, [params.id]);

  const handleGetDirections = () => {
    if (trail) {
      if (trail.coordinates) {
        const { lat, lng } = trail.coordinates;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
        window.open(url, '_blank');
      } else {
        const destinationName = encodeURIComponent(trail.name + ", " + trail.location);
        const url = `https://www.google.com/maps/dir/?api=1&destination=${destinationName}&travelmode=driving`;
        window.open(url, '_blank');
      }
    }
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!trail) {
    return <div className="h-screen flex items-center justify-center">Trilha não encontrada.</div>;
  }

  // Garante que temos um array de imagens para o carrossel
  const carouselImages = trail.images && trail.images.length > 0 
    ? trail.images 
    : [trail.imageUrl, trail.imageUrl, trail.imageUrl]; // Fallback para 3 imagens iguais

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pb-10">
        {/* --- CARROSSEL DE IMAGENS (SUBSTITUI A HERO IMAGE ÚNICA) --- */}
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px] bg-black">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {carouselImages.map((imgSrc, index) => (
                <CarouselItem key={index} className="relative w-full h-[300px] md:h-[400px] lg:h-[450px]">
                  <Image
                    src={imgSrc}
                    alt={`${trail.name} - Imagem ${index + 1}`}
                    fill
                    className="object-cover opacity-80"
                    priority={index === 0}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Controles do Carrossel (Visíveis apenas em telas maiores ou ao passar o mouse) */}
            <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
               <div className="pointer-events-auto">
                 <CarouselPrevious className="relative left-0 translate-x-0 bg-white/20 hover:bg-white/40 border-none text-white" />
               </div>
               <div className="pointer-events-auto">
                 <CarouselNext className="relative right-0 translate-x-0 bg-white/20 hover:bg-white/40 border-none text-white" />
               </div>
            </div>
          </Carousel>

          {/* Gradiente para texto legível */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
          
          <div className="absolute top-4 left-4 z-10">
            <Link href="/trilhas">
              <Button variant="secondary" size="icon" className="rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white border-none">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white z-20">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                  <Badge className="mb-2 bg-primary hover:bg-primary/90 text-white border-none">
                    {trail.difficulty}
                  </Badge>
                  <h1 className="text-2xl md:text-4xl font-bold mb-2 shadow-sm">{trail.name}</h1>
                  <div className="flex items-center gap-2 text-gray-200 text-sm md:text-base">
                    <MapPin className="h-4 w-4" />
                    <span>{trail.location}</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="secondary" size="sm" className="gap-2 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border-none">
                    <Share2 className="h-4 w-4" /> <span className="hidden sm:inline">Compartilhar</span>
                  </Button>
                  <Button variant="secondary" size="sm" className="gap-2 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border-none">
                    <Heart className="h-4 w-4" /> <span className="hidden sm:inline">Salvar</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto mt-8 px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                  <TrendingUp className="h-5 w-5 text-primary mb-2" />
                  <span className="text-xs text-muted-foreground uppercase font-semibold">Distância</span>
                  <span className="text-lg font-bold">{trail.distance} km</span>
                </div>
                <div className="bg-card border rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                  <Clock className="h-5 w-5 text-primary mb-2" />
                  <span className="text-xs text-muted-foreground uppercase font-semibold">Duração</span>
                  <span className="text-lg font-bold">{trail.duration}</span>
                </div>
                <div className="bg-card border rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                  <TrendingUp className="h-5 w-5 text-primary mb-2" />
                  <span className="text-xs text-muted-foreground uppercase font-semibold">Elevação</span>
                  <span className="text-lg font-bold">{trail.elevation}m</span>
                </div>
                <div className="bg-card border rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                  <Star className="h-5 w-5 text-yellow-500 mb-2 fill-current" />
                  <span className="text-xs text-muted-foreground uppercase font-semibold">Avaliação</span>
                  <span className="text-lg font-bold">{trail.rating}</span>
                </div>
              </div>

              {/* Tabs: Sobre, Mapa, Avaliações */}
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
                  <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6">
                    Sobre
                  </TabsTrigger>
                  <TabsTrigger value="map" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6">
                    Mapa
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6">
                    Avaliações
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="pt-6">
                  <h3 className="text-xl font-bold mb-4">Descrição</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {trail.description}
                  </p>
                  
                  <h3 className="text-xl font-bold mt-8 mb-4">O que esperar</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" /> Visual panorâmico incrível
                    </li>
                    <li className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" /> Trechos de mata fechada e campo aberto
                    </li>
                    <li className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" /> Possibilidade de avistar fauna local
                    </li>
                  </ul>
                </TabsContent>
                
                <TabsContent value="map" className="pt-6">
                  <div className="h-[400px] w-full rounded-xl overflow-hidden border shadow-sm">
                    <LeafletMap trailId={trail.id} />
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="pt-6">
                  <div className="text-center py-10 text-muted-foreground">
                    <p>Ainda não há avaliações para esta trilha.</p>
                    <Button variant="link">Seja o primeiro a avaliar</Button>
                  </div>
                </TabsContent>
              </Tabs>

            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-24">
                <h3 className="font-bold text-lg mb-4">Sua Aventura</h3>
                
                <div className="flex flex-col gap-3 mb-6">
                    <Link href={`/trilhas/${trail.id}/start`}>
                    <Button size="lg" className="w-full gap-2 shadow-lg shadow-primary/20 h-12 text-base">
                        <Navigation className="h-5 w-5" /> Iniciar Trilha Agora
                    </Button>
                    </Link>

                    <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full gap-2 h-12 text-base border-primary/20 hover:bg-primary/5 text-primary hover:text-primary"
                        onClick={handleGetDirections}
                        disabled={!trail.coordinates}
                    >
                        <MapIcon className="h-5 w-5" /> Como Chegar
                    </Button>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                    <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                            <Info className="h-3 w-3" /> Dica
                        </p>
                        <p className="text-sm">
                            Lembre-se de levar água, protetor solar e usar calçados adequados. 
                            Verifique a previsão do tempo antes de sair.
                        </p>
                    </div>

                  <div className="flex justify-between text-sm pt-2">
                    <span className="text-muted-foreground">Melhor época</span>
                    <span className="font-medium">Maio a Setembro</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tipo de terreno</span>
                    <span className="font-medium">Misto (Terra/Pedra)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sinal de celular</span>
                    <span className="font-medium text-yellow-600">Parcial</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}