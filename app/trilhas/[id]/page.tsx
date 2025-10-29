"use client"

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, MapPin, Star, Clock, TrendingUp, Mountain, Maximize, PlayCircle,
  MessageSquare, Loader2, Heart as HeartIcon, Share2, AlertCircle
} from 'lucide-react';
import Navbar from '@/components/navbar';
import LeafletMap from '@/components/leaflet-map';
import ReviewCard from '@/components/review-card';
import WeatherForecast from '@/components/weather-forecast';
import CommentForm from '@/components/comment-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { getTrailById } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import type { Trilhas, Review as DisplayReview, AvaliacaoComPerfil as DbReview } from '@/lib/types';
import type { User } from "@supabase/supabase-js";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';


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


export default function TrailDetailPage() {
  const paramsHook = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const trilhaId = typeof paramsHook.id === 'string' ? paramsHook.id : undefined;

  const [trail, setTrail] = useState<Trilhas | null>(null);
  const [loadingTrail, setLoadingTrail] = useState(true);
  const [comments, setComments] = useState<DbReview[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [parqueNome, setParqueNome] = useState<string | null>(null);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  const defaultMapCenter: LatLngExpression = [-15.7942, -47.8825];
  const defaultMapZoom = 4;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPageUrl(window.location.href);
    }
  }, []);

  const fetchTrailData = useCallback(async () => {
    if (!trilhaId) {
      setLoadingTrail(false); setTrail(null); return;
    }
    setLoadingTrail(true);
    const trailDataFromMock = getTrailById(trilhaId);

    if (trailDataFromMock) {
        setTrail(trailDataFromMock);
        if (trailDataFromMock.parque_id && !trailDataFromMock.location?.includes(',')) {
             try {
                const { data: parqueData, error } = await supabase
                    .from('parques')
                    .select('nome')
                    .eq('id', trailDataFromMock.parque_id)
                    .single();
                 if (!error && parqueData) {
                    setParqueNome(parqueData.nome);
                 }
             } catch(e) { console.error("Erro ao buscar nome do parque:", e); }
        }
    } else {
      setTrail(null);
      toast({ title: "Trilha não encontrada", description: "Não foi possível carregar os dados desta trilha.", variant: "destructive" });
    }
    setLoadingTrail(false);
  }, [trilhaId, toast]);

  const fetchComments = useCallback(async () => {
    if (!trilhaId) {
      setLoadingComments(false); setComments([]); return;
    }
    setLoadingComments(true);
    try {
      const { data: commentsData, error: commentsError } = await supabase
        .from('avaliacoes')
        .select(`*, perfis (nome_completo, nome_usuario, url_avatar, nivel)`)
        .eq('trilha_id', trilhaId)
        .order('criado_em', { ascending: false });

      if (commentsError) {
        console.error("Supabase error object (fetchComments):", JSON.stringify(commentsError, null, 2));
        throw commentsError;
      }

      const validCommentsData = (commentsData || []) as DbReview[];
      setComments(validCommentsData);

      if (validCommentsData.length > 0) {
        const sum = validCommentsData.reduce((acc, comment) => acc + (comment.avaliacao || 0), 0);
        setAverageRating(sum / validCommentsData.length);
        setTotalReviews(validCommentsData.length);
      } else {
        setAverageRating(0);
        setTotalReviews(0);
      }
    } catch (error: any) {
      console.error("Erro ao carregar comentários:", error.message);
      setComments([]);
      setAverageRating(0);
      setTotalReviews(0);
      toast({ title: "Erro ao carregar comentários", description: error.message, variant: "destructive" });
    } finally {
      setLoadingComments(false);
    }
  }, [trilhaId, toast]);

  const checkFavoriteStatus = useCallback(async (userId: string) => {
    if (!trilhaId) return;
    setLoadingFavorite(true);
    try {
      const { data, error } = await supabase
        .from('favoritos')
        .select('id')
        .eq('usuario_id', userId)
        .eq('trilha_id', trilhaId)
        .limit(1);

      if (error) throw error;
      setIsFavorite(data && data.length > 0);
    } catch (error: any) {
      console.error("Erro ao checar favorito:", error.message);
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
      toast({ title: "Ação necessária", description: "Você precisa estar logado para favoritar.", variant: "default" });
      router.push('/login');
      return;
    }
    if (!trilhaId) return;

    setLoadingFavorite(true);
    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favoritos')
          .delete()
          .eq('usuario_id', currentUser.id)
          .eq('trilha_id', trilhaId);
        if (error) throw error;
        setIsFavorite(false);
        toast({ title: "Removido dos Favoritos", variant: "default" });
      } else {
        const { error } = await supabase
          .from('favoritos')
          .insert({ usuario_id: currentUser.id, trilha_id: trilhaId });
        if (error) throw error;
        setIsFavorite(true);
        toast({ title: "Adicionado aos Favoritos!", variant: "default" });
      }
    } catch (error: any) {
      console.error("Erro ao favoritar:", error.message);
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setLoadingFavorite(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    toast({ title: "Link Copiado!", description: "URL da trilha copiada para a área de transferência." });
  };

  if (loadingTrail || trilhaId === undefined) {
      return <LoaderComponent message="A carregar detalhes da trilha..." />;
  }

  if (!trail) {
       return (
         <>
           <Navbar />
            <div className="container mx-auto py-8 px-4 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Trilha não encontrada</h1>
                <p className="text-muted-foreground mb-6">A trilha que você está procurando não existe ou foi removida.</p>
                <Button asChild variant="outline">
                    <Link href="/trilhas">Voltar para Trilhas</Link>
                </Button>
            </div>
         </>
       );
  }

  const displayReviews: DisplayReview[] = comments.map(comment => ({
    id: comment.id,
    user: {
      name: comment.perfis?.nome_completo || comment.perfis?.nome_usuario || "Aventureiro(a)",
      avatar: comment.perfis?.url_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.perfis?.nome_completo || comment.perfis?.nome_usuario || "A")}&background=random&color=fff`,
      level: comment.perfis?.nivel ?? 1,
    },
    rating: comment.avaliacao,
    date: new Date(comment.criado_em).toLocaleDateString("pt-BR", { year: 'numeric', month: 'long', day: 'numeric' }),
    content: comment.comentario || "",
    photos: comment.imagens || undefined,
  }));

  const mapCenterCoords = trail.coordinates ? [trail.coordinates.lat, trail.coordinates.lng] as LatLngExpression : defaultMapCenter;
  const mapZoom = trail.coordinates ? 14 : defaultMapZoom;
  const trailPathCoords = trail.path ? [trail.path.map(p => [p.lat, p.lng] as [number, number])] : undefined;
  const trailWaypointsData = trail.waypoints ? trail.waypoints.map(wp => ({ ...wp, position: [wp.lat, wp.lng] as [number, number] })) : undefined;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="container mx-auto py-6 sm:py-8 px-4">
        <div className="mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/trilhas" className="text-muted-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para trilhas
            </Link>
          </Button>
        </div>

        <section className="mb-6">
          <Card className="overflow-hidden">
            <AspectRatio ratio={16 / 9} className="bg-muted">
              <img
                src={trail.imageUrl || '/placeholder.jpg'}
                alt={`Imagem da ${trail.name}`}
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </Card>
        </section>

        <section className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <div className="md:col-span-2 space-y-6 lg:space-y-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-3xl font-bold">{trail.name}</CardTitle>
                    <CardDescription className="text-base text-muted-foreground flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      {parqueNome ? `${parqueNome}, ` : ''}{trail.location}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="outline" size="icon" onClick={() => setShowShareSheet(true)} title="Compartilhar">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant={isFavorite ? "default" : "outline"} size="icon" onClick={handleToggleFavorite} disabled={loadingFavorite} title={isFavorite ? "Remover favorito" : "Adicionar favorito"}>
                      {loadingFavorite ? <Loader2 className="h-4 w-4 animate-spin"/> : <HeartIcon className={cn("h-4 w-4", isFavorite && "fill-current")} />}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <Badge variant="outline" className="text-sm capitalize">{trail.difficulty}</Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{averageRating ? averageRating.toFixed(1) : "N/A"}</span>
                    <span className="text-muted-foreground">({totalReviews} reviews)</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground">{trail.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Detalhes da Trilha</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <Clock className="h-6 w-6 mx-auto text-primary mb-1" />
                  <p className="text-sm font-medium">Duração</p>
                  <p className="text-lg font-bold">{trail.duration}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <Maximize className="h-6 w-6 mx-auto text-primary mb-1" />
                  <p className="text-sm font-medium">Distância</p>
                  <p className="text-lg font-bold">{trail.distance} km</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <TrendingUp className="h-6 w-6 mx-auto text-primary mb-1" />
                  <p className="text-sm font-medium">Elevação</p>
                  <p className="text-lg font-bold">{trail.elevation} m</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <Mountain className="h-6 w-6 mx-auto text-primary mb-1" />
                  <p className="text-sm font-medium">Tipo</p>
                  <p className="text-lg font-bold capitalize">{trail.waypoints?.length ? 'Waypoints' : 'N/A'}</p>
                </div>
              </CardContent>
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
                  <p className="text-muted-foreground text-center py-6">Nenhuma avaliação ainda. Seja o primeiro!</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 md:sticky md:top-24 self-start">
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button size="lg" className="w-full text-lg" asChild>
                  <Link href={`/trilhas/${trilhaId}/start`}>
                    <PlayCircle className="h-5 w-5 mr-2" />
                    Iniciar Percurso
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full text-lg" asChild>
                  <Link href={`/trilhas/${trilhaId}/map`}>
                    <MapPin className="h-5 w-5 mr-2" />
                    Ver Mapa Completo
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
  <CardHeader><CardTitle>Mapa</CardTitle></CardHeader>
  <CardContent className="h-[300px] p-0 overflow-hidden rounded-b-lg">
    {/* ⚙️ Força o React a destruir e recriar o container do mapa apenas se mudar de trilha */}
    <LeafletMap
      key={trilhaId} 
      center={mapCenterCoords}
      zoom={mapZoom}
      paths={trailPathCoords}
      waypoints={trailWaypointsData}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    />
  </CardContent>
</Card>
            
            {trail.coordinates && (
              <WeatherForecast 
                lat={trail.coordinates.lat} 
                lon={trail.coordinates.lng} 
              />
            )}
          </div>
        </section>
      </main>

      <Sheet open={showShareSheet} onOpenChange={setShowShareSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Compartilhar Trilha</SheetTitle>
            <SheetDescription>
              Compartilhe esta trilha com seus amigos aventureiros!
            </SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-4">
             <Label htmlFor="share-link">Link da Trilha</Label>
             <Input id="share-link" value={pageUrl} readOnly />
             <Button onClick={handleCopyLink} className="w-full">Copiar Link</Button>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Fechar</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}