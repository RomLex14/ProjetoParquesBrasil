"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { 
  ArrowLeft, MapPin, Clock, TrendingUp, Star, 
  Share2, Heart, Navigation, Info, Map as MapIcon,
  Calendar, Signal, Footprints
} from "lucide-react";
import Autoplay from "embla-carousel-autoplay"; 
import { supabase } from "@/lib/supabase"; 
import type { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious 
} from "@/components/ui/carousel";
import { Trilhas } from "@/lib/types";
import dynamic from "next/dynamic";

// Importação dos Novos Componentes
import CommentForm from "@/components/comment-form";
import ReviewCard from "@/components/review-card";

const LeafletMap = dynamic(() => import("@/components/leaflet-map"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted animate-pulse rounded-lg flex items-center justify-center">Carregando Mapa...</div>
});

export default function TrilhaDetalhesClient({ trail }: { trail: Trilhas }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Verifica o usuário logado ao carregar a página
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const handleCommentSubmitted = () => {
    // Atualiza a página para mostrar o novo comentário sem recarregar tudo
    router.refresh(); 
  };
  
  const handleGetDirections = () => {
    if (trail.coordinates) {
      const { lat, lng } = trail.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
      window.open(url, '_blank');
    } else {
      const destinationName = encodeURIComponent(trail.name + ", " + trail.location);
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destinationName}&travelmode=driving`;
      window.open(url, '_blank');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const d = difficulty?.toLowerCase() || "";
    if (d.includes("fácil")) return "bg-emerald-500 hover:bg-emerald-600";
    if (d.includes("moderada")) return "bg-amber-500 hover:bg-amber-600";
    if (d.includes("difícil")) return "bg-red-500 hover:bg-red-600";
    if (d.includes("extrema")) return "bg-purple-500 hover:bg-purple-600";
    return "bg-blue-500 hover:bg-blue-600";
  };

  const carouselImages = trail.images && trail.images.length > 0 
    ? trail.images 
    : [trail.imageUrl || "/placeholder.jpg", trail.imageUrl || "/placeholder.jpg"];

  return (
    <>
        {/* --- CARROSSEL DE IMAGENS --- */}
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px] bg-black">
          <Carousel 
            className="w-full h-full"
            plugins={[Autoplay({ delay: 5000, stopOnInteraction: true }) as any]}
            opts={{ loop: true }}
          >
            <CarouselContent>
              {carouselImages.map((imgSrc, index) => (
                <CarouselItem key={index} className="relative w-full h-[300px] md:h-[400px] lg:h-[450px]">
                  <Image
                    src={imgSrc}
                    alt={`${trail.name} - Imagem ${index + 1}`}
                    fill
                    className="object-cover opacity-90"
                    priority={index === 0}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Controles Opcionais */}
             <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
               <div className="pointer-events-auto">
                 <CarouselPrevious className="relative left-0 translate-x-0 bg-white/20 hover:bg-white/40 border-none text-white" />
               </div>
               <div className="pointer-events-auto">
                 <CarouselNext className="relative right-0 translate-x-0 bg-white/20 hover:bg-white/40 border-none text-white" />
               </div>
            </div>
          </Carousel>

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
          
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
                  <Badge className={`mb-2 text-white border-none ${getDifficultyColor(trail.difficulty)}`}>
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
            
            {/* COLUNA PRINCIPAL */}
            <div className="lg:col-span-2 space-y-8">
              
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

              <Tabs defaultValue="about" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
                  <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6">Sobre</TabsTrigger>
                  <TabsTrigger value="map" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6">Mapa</TabsTrigger>
                  <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6">Avaliações ({trail.reviews?.length || 0})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="pt-6 space-y-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Descrição</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {trail.description}
                    </p>
                  </div>
                  {/* Detalhes extras */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg text-primary"><Calendar className="h-4 w-4" /></div>
                            <div><p className="font-medium text-sm">Melhor Época</p><p className="text-sm text-muted-foreground">{trail.bestSeason}</p></div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg text-primary"><Footprints className="h-4 w-4" /></div>
                            <div><p className="font-medium text-sm">Tipo de Terreno</p><p className="text-sm text-muted-foreground">{trail.terrainType}</p></div>
                        </div>
                      </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="map" className="pt-6">
                  <div className="h-[400px] w-full rounded-xl overflow-hidden border shadow-sm bg-slate-100">
                    <LeafletMap trailId={trail.id} />
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="pt-6 space-y-8">
                   {/* Formulário de Comentário */}
                   <div className="bg-muted/10 border rounded-xl p-6">
                      <h3 className="font-semibold text-lg mb-2">Avalie esta trilha</h3>
                      <p className="text-sm text-muted-foreground mb-4">Compartilhe sua experiência com a comunidade.</p>
                      <CommentForm 
                        trilhaId={trail.id} 
                        user={user} 
                        onCommentSubmitted={handleCommentSubmitted} 
                      />
                   </div>

                   {/* Lista de Avaliações */}
                   <div className="space-y-6">
                      <h3 className="font-bold text-xl">Comentários Recentes</h3>
                      {trail.reviews && trail.reviews.length > 0 ? (
                        trail.reviews.map((review) => (
                          <div key={review.id}>
                            <ReviewCard review={review} />
                            <Separator className="my-6" />
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                          <p>Ainda não há avaliações para esta trilha.</p>
                          <p className="text-sm">Seja o primeiro a compartilhar sua aventura!</p>
                        </div>
                      )}
                   </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* SIDEBAR */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-24">
                <h3 className="font-bold text-lg mb-4">Sua Aventura</h3>
                <div className="flex flex-col gap-3 mb-6">
                    <Link href={`/trilhas/${trail.id}/start`} className="w-full">
                      <Button size="lg" className="w-full gap-2 shadow-lg shadow-primary/20 h-12 text-base">
                          <Navigation className="h-5 w-5" /> Iniciar Trilha Agora
                      </Button>
                    </Link>
                    <Button variant="outline" size="lg" onClick={handleGetDirections} className="w-full gap-2 h-12">
                        <MapIcon className="h-5 w-5" /> Como Chegar
                    </Button>
                </div>
                <Separator className="my-6" />
                <div className="bg-muted/30 p-3 rounded-lg border border-muted">
                    <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1.5"><Info className="h-3 w-3" /> Preparação</p>
                    <p className="text-sm leading-snug text-foreground/80">Leve água, protetor solar e verifique o clima.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}