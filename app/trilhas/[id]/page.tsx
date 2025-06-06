// app/trilhas/[id]/page.tsx
"use client"

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, MapPin, Star, Clock, TrendingUp, Mountain, Maximize, PlayCircle, 
  MessageSquare, User as UserIcon, Loader2, Edit3, Heart as HeartIcon, Share2, CalendarDays, AlertCircle
} from 'lucide-react';
import Navbar from '@/components/navbar';
import LeafletMap from '@/components/leaflet-map';
import ReviewCard from '@/components/review-card';
import WeatherForecast from '@/components/weather-forecast';
import CommentForm from '@/components/comment-form';
import { Button } from '@/components/ui/button';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

import { getTrailById } from '@/lib/data'; // Seus dados mocados DEVEM USAR UUIDs
import { supabase } from '@/lib/supabase';
import type { Trilhas, Review as DisplayReview, AvaliacaoComPerfil, Perfil } from '@/lib/types'; // Usando seu tipo Trilhas
import type { User } from "@supabase/supabase-js";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface TrailWithAuthor extends Trilhas {
  author?: Pick<Perfil, "nome_completo" | "url_avatar" | "id">;
}

export default function TrailDetailPage() {
  const paramsHook = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const trilhaId = typeof paramsHook.id === 'string' ? paramsHook.id : undefined;

  const [trail, setTrail] = useState<TrailWithAuthor | null>(null);
  const [loadingTrail, setLoadingTrail] = useState(true);
  const [comments, setComments] = useState<AvaliacaoComPerfil[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [parqueNome, setParqueNome] = useState<string | null>(null);

  const fetchTrailData = useCallback(async () => {
    if (!trilhaId) {
      setLoadingTrail(false);
      setTrail(null);
      return;
    }
    setLoadingTrail(true);
    const trailDataFromMock = getTrailById(trilhaId); 
    
    if (trailDataFromMock) {
      setTrail(trailDataFromMock as TrailWithAuthor);
      if (trailDataFromMock.parque_id) {
         setParqueNome(trailDataFromMock.location.split(",")[1]?.trim() || "Parque Desconhecido");
      }
    } else {
      console.error("Trilha não encontrada com id (fetchTrailData):", trilhaId);
      setTrail(null);
    }
    setLoadingTrail(false);
  }, [trilhaId]);

  const fetchComments = useCallback(async () => {
    if (!trilhaId) {
      setLoadingComments(false);
      setComments([]);
      return;
    }
    setLoadingComments(true);
    try {
      const { data: commentsData, error: commentsError } = await supabase
        .from('avaliacoes')
        .select(`*, perfis (nome_completo, nome_usuario, url_avatar)`)
        .eq('trilha_id', trilhaId) 
        .order('criado_em', { ascending: false });

      if (commentsError) {
        console.error("Supabase error object (fetchComments):", JSON.stringify(commentsError, null, 2));
        throw commentsError;
      }
      
      const validCommentsData = (commentsData || []) as AvaliacaoComPerfil[];
      setComments(validCommentsData);

      if (validCommentsData.length > 0) {
        const total = validCommentsData.reduce((acc, comment) => acc + comment.avaliacao, 0);
        setAverageRating(parseFloat((total / validCommentsData.length).toFixed(1)));
        setTotalReviews(validCommentsData.length);
      } else {
        setAverageRating(null);
        setTotalReviews(0);
      }
    } catch (error: any) {
      const errorMessage = error?.message || (typeof error === 'object' && error !== null ? JSON.stringify(error) : "Erro desconhecido ao buscar avaliações.");
      console.error("Erro ao buscar avaliações (catch):", errorMessage, error);
      setComments([]);
      toast({ title: "Erro de Avaliações", description: `Não foi possível carregar: ${errorMessage}`, variant: "destructive" });
    } finally {
      setLoadingComments(false);
    }
  }, [trilhaId, toast]);

  const checkFavoriteStatus = useCallback(async (userId: string) => {
    if (!userId || !trilhaId) {
      setIsFavorite(false);
      return;
    }
    setLoadingFavorite(true);
    try {
      const { count, error } = await supabase
        .from('favoritos')
        .select('id', { count: 'exact', head: true })
        .eq('usuario_id', userId)
        .eq('trilha_id', trilhaId); 

      if (error) {
        console.error("Supabase error object (checkFavoriteStatus):", JSON.stringify(error, null, 2));
        throw error;
      }
      setIsFavorite(count !== null && count > 0);
    } catch (error: any) {
      const errorMessage = error?.message || (typeof error === 'object' && error !== null ? JSON.stringify(error) : "Erro desconhecido ao verificar favorito.");
      console.error("Erro ao verificar favorito (catch):", errorMessage, error);
      setIsFavorite(false);
    } finally {
      setLoadingFavorite(false);
    }
  }, [trilhaId]);

  useEffect(() => {
    const initPage = async () => {
      if (trilhaId) {
        await Promise.all([
          fetchTrailData(),
          fetchComments()
        ]);
        
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
        if (user) {
          await checkFavoriteStatus(user.id);
        }
      } else {
        setLoadingTrail(false);
        setLoadingComments(false);
        setTrail(null);
      }
    };
    
    initPage();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const newAuthUser = session?.user ?? null;
      setCurrentUser(newAuthUser);
      if (trilhaId) {
        if (newAuthUser) {
          await checkFavoriteStatus(newAuthUser.id);
        } else {
          setIsFavorite(false);
        }
      }
    });
    
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [trilhaId, fetchTrailData, fetchComments, checkFavoriteStatus]);


  const handleToggleFavorite = async () => {
    if (!currentUser) {
      toast({ title: "Login Necessário", description: "Você precisa estar logado para adicionar aos favoritos.", variant: "default" });
      if (trilhaId) router.push(`/login?next=/trilhas/${trilhaId}`);
      return;
    }
    if (!trail || !trilhaId) return;
    setLoadingFavorite(true);

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favoritos')
          .delete()
          .match({ usuario_id: currentUser.id, trilha_id: trilhaId });
        if (error) {
          console.error("Supabase error object (delete favorite):", JSON.stringify(error, null, 2));
          throw error;
        }
        setIsFavorite(false);
        toast({ title: "Removido!", description: `${trail.name} removida dos seus favoritos.` });
      } else {
        const { error } = await supabase
          .from('favoritos')
          .insert({ usuario_id: currentUser.id, trilha_id: trilhaId });
        if (error) {
          console.error("Supabase error object (insert favorite):", JSON.stringify(error, null, 2));
          throw error;
        }
        setIsFavorite(true);
        toast({ title: "Adicionado!", description: `${trail.name} adicionada aos favoritos!`, variant: "default" });
      }
    } catch (error: any) {
      const errorMessage = error?.message || (typeof error === 'object' && error !== null ? JSON.stringify(error) : "Erro desconhecido ao atualizar favoritos.");
      console.error("Erro ao atualizar favoritos (catch):", errorMessage, error);
      toast({ title: "Erro", description: `Não foi possível atualizar seus favoritos: ${errorMessage}`, variant: "destructive" });
    } finally {
      setLoadingFavorite(false);
    }
  };

  // CORRIGIDO: Estados de Carregamento com JSX Válido
  const LoaderComponent = ({ message }: { message?: string }) => (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          {message && <p className="text-muted-foreground">{message}</p>}
        </div>
      </div>
    </div>
  );

  if (trilhaId === undefined) { 
    return <LoaderComponent />; // Loader inicial enquanto trilhaId é resolvido
  }
  
  if (loadingTrail) {
    return <LoaderComponent message="A carregar detalhes da trilha..." />;
  }

  if (!trail) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-10 px-4 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Trilha não encontrada</h1>
          <p className="text-muted-foreground mb-6">A trilha que procura não existe ou foi removida.</p>
          <Link href="/trilhas">
            <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Trilhas
            </Button>
          </Link>
        </div>
      </>
    );
  }

  const displayDifficulty = trail.difficulty; 

  const displayReviews: DisplayReview[] = comments.map(comment => ({
    id: comment.id,
    user: {
      name: comment.perfis?.nome_completo || comment.perfis?.nome_usuario || "Aventureiro(a)",
      avatar: comment.perfis?.url_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.perfis?.nome_completo || comment.perfis?.nome_usuario || "A")}&background=random&color=fff`,
    },
    rating: comment.avaliacao,
    date: new Date(comment.criado_em).toLocaleDateString("pt-BR", { year: 'numeric', month: 'long', day: 'numeric' }),
    content: comment.comentario || "",
    photos: comment.imagens || undefined,
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="container mx-auto py-6 sm:py-8 px-4">
        <div className="mb-6">
          <Link href="/trilhas" className="inline-flex items-center text-sm text-primary hover:underline font-medium">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para Todas as Trilhas
          </Link>
        </div>

        <section className="mb-8">
          <div className="relative w-full h-[40vh] min-h-[300px] md:h-[60vh] max-h-[550px] rounded-lg overflow-hidden shadow-xl group">
            <img 
              src={trail.imageUrl || `https://source.unsplash.com/1600x900/?brazil,nature,trail,${encodeURIComponent(trail.name.split(" ")[0])}`} 
              alt={`Paisagem da ${trail.name}`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6 md:p-8 flex flex-col justify-end">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2 shadow-text leading-tight">{trail.name}</h1>
              <div className="flex items-center text-gray-200 text-sm sm:text-base">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                <span className="truncate">{trail.location}</span>
              </div>
            </div>
            {trilhaId && (
              <Link href={`/trilhas/${trilhaId}/map`} className="absolute top-3 right-3 sm:top-4 sm:right-4">
                <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white text-slate-800 backdrop-blur-sm shadow-md text-xs sm:text-sm">
                  <Maximize className="h-3.5 w-3.5 mr-1.5 sm:mr-2"/> Ver Mapa Completo
                </Button>
              </Link>
            )}
          </div>
        </section>
        
        <section className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {/* Coluna Principal (Esquerda) */}
          <div className="md:col-span-2 space-y-6 lg:space-y-8">
            <Card>
              <CardHeader><CardTitle className="text-2xl font-semibold">Sobre a Trilha</CardTitle></CardHeader>
              <CardContent><p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{trail.description || "Descrição detalhada da trilha não disponível no momento."}</p></CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-xl font-semibold">Detalhes da Trilha</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-x-4 gap-y-5 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider">Dificuldade</p>
                  <Badge variant={
                    trail.difficulty === "Fácil" ? "default" :
                    trail.difficulty === "Moderado" ? "secondary" : 
                    trail.difficulty === "Difícil" || trail.difficulty === "Extrema" ? "destructive" : "outline"
                  } className={cn(
                    "font-medium mt-1 text-xs px-2.5 py-0.5",
                    trail.difficulty === "Fácil" && "bg-green-100 text-green-700 border-green-300 dark:bg-green-700/20 dark:text-green-300 dark:border-green-600/50",
                    trail.difficulty === "Moderado" && "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-700/20 dark:text-yellow-300 dark:border-yellow-600/50",
                    (trail.difficulty === "Difícil" || trail.difficulty === "Extrema") && "bg-red-100 text-red-700 border-red-300 dark:bg-red-700/20 dark:text-red-300 dark:border-red-600/50"
                  )}>
                    {displayDifficulty}
                  </Badge>
                </div>
                <div><p className="text-muted-foreground text-xs uppercase tracking-wider">Distância</p><p className="font-semibold text-base mt-0.5">{trail.distance} km</p></div>
                <div><p className="text-muted-foreground text-xs uppercase tracking-wider">Duração Estimada</p><p className="font-semibold text-base mt-0.5">{trail.duration}</p></div>
                <div><p className="text-muted-foreground text-xs uppercase tracking-wider">Elevação</p><p className="font-semibold text-base mt-0.5">{trail.elevation} m</p></div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider">Avaliação Média</p>
                  <div className="flex items-center font-semibold text-base mt-0.5">
                    {averageRating !== null ? (
                       <>
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                        {averageRating.toFixed(1)} 
                        <span className="text-xs text-muted-foreground ml-1.5">({totalReviews} {totalReviews === 1 ? 'avaliação' : 'avaliações'})</span>
                       </>
                    ) : (
                      <span className="text-muted-foreground text-sm">Nenhuma avaliação</span>
                    )}
                  </div>
                </div>
                <div className="col-span-full sm:col-span-1"> 
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">Parque Nacional</p>
                    <p className="font-semibold text-base mt-0.5">{parqueNome || "Não especificado"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="text-xl font-semibold">Previsão do Tempo</CardTitle><CardDescription>Para {trail.location.split(",")[0]}</CardDescription></CardHeader>
                <CardContent><WeatherForecast location={trail.location.split(",")[0]} /></CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <MessageSquare className="h-5 w-5" />
                  Avaliações ({totalReviews})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {trilhaId && (
                  <CommentForm 
                    trilhaId={trilhaId} 
                    user={currentUser} 
                    onCommentSubmitted={fetchComments}
                  />
                )}
                <Separator />
                {loadingComments ? (
                  <div className="flex justify-center py-6"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                ) : displayReviews.length > 0 ? (
                  <div className="space-y-8">
                    {displayReviews.map(review => (
                      <ReviewCard key={review.id} review={review} expanded={true} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-6">Nenhuma avaliação ainda. Seja o primeiro a compartilhar sua experiência!</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coluna Lateral (Direita) */}
          <div className="space-y-6 md:sticky md:top-24 self-start">
            <Card className="overflow-hidden shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Mapa da Trilha</CardTitle>
                <CardDescription>Visualize o percurso no mapa interativo.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <AspectRatio ratio={16/9} className="bg-muted dark:bg-slate-800 border-t dark:border-slate-700">
                  {trilhaId && <LeafletMap trailId={trilhaId} />}
                </AspectRatio>
              </CardContent>
            </Card>
            
            <div className="space-y-3">
              <Link href={trilhaId ? `/trilhas/${trilhaId}/start` : "#"} className={!trilhaId ? "pointer-events-none" : ""}>
                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white" disabled={!trilhaId}>
                  <PlayCircle className="mr-2 h-5 w-5" /> Iniciar Gravação
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full" 
                onClick={handleToggleFavorite}
                disabled={loadingFavorite || !trilhaId || !currentUser}
              > 
                {loadingFavorite ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <HeartIcon className={cn("mr-2 h-5 w-5", isFavorite && "fill-red-500 text-red-500")} />}
                {isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="lg" className="w-full" disabled={!trilhaId}>
                    <Share2 className="mr-2 h-5 w-5" /> Compartilhar Trilha
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Compartilhar "{trail.name}"</SheetTitle>
                    <SheetDescription>
                      Copie o link abaixo ou compartilhe diretamente nas suas redes sociais.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4 space-y-4">
                    <Input 
                      readOnly 
                      value={typeof window !== "undefined" ? window.location.href : ""} 
                      aria-label="Link da trilha"
                    />
                    <div className="flex gap-2">
                      <Button 
                        variant="default" 
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            navigator.clipboard.writeText(window.location.href)
                              .then(() => toast({title: "Link Copiado!", description: "O link da trilha foi copiado para sua área de transferência."}))
                              .catch(() => toast({title: "Erro", description: "Não foi possível copiar o link.", variant: "destructive"}));
                          }
                        }}
                      >
                        Copiar Link
                      </Button>
                    </div>
                  </div>
                   <SheetFooter>
                    <SheetClose asChild>
                      <Button variant="outline">Fechar</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t dark:border-slate-800 py-6 md:py-8 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Parques Brasil. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
