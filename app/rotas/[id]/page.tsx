"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  Loader2,
  Share2,
  Edit,
  Trash2,
  Mountain,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/navbar";
import LeafletMap from "@/components/leaflet-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AuthGuard from "@/components/auth-guard";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RotaUsuario {
  id: string;
  nome: string;
  descricao?: string | null;
  criado_em: string;
  dificuldade?: string | null;
  distancia_total_km?: number | null;
  waypoints: any; // Pode ser Array antigo ou GeoJSON novo
}

export default function RotaDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  // Tratamento seguro do ID
  const rotaId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [rota, setRota] = useState<RotaUsuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- 1. BUSCAR DADOS ---
  useEffect(() => {
    const fetchRotaData = async () => {
      if (!rotaId) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("rotas_usuario")
          .select("*")
          .eq("id", rotaId)
          .single<RotaUsuario>();

        if (error) throw error;
        setRota(data);
      } catch (error: any) {
        console.error("Erro ao buscar rota:", error);
        toast({ 
          title: "Erro", 
          description: "Não foi possível carregar a rota.", 
          variant: "destructive" 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRotaData();
  }, [rotaId, toast]);

  // --- 2. EXCLUIR ROTA ---
  const handleDeleteRota = async () => {
    if (!rotaId) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('rotas_usuario').delete().eq('id', rotaId);
      if (error) throw error;
      toast({ title: "Sucesso", description: "Rota excluída." });
      router.push('/rotas');
      router.refresh();
    } catch (error: any) {
      toast({ title: "Erro", description: "Falha ao excluir.", variant: "destructive" });
      setIsDeleting(false);
    }
  };

  // --- 3. CONVERSOR INTELIGENTE (CORREÇÃO DO ERRO) ---
  const getLeafletPath = (waypoints: any): { lat: number; lng: number }[] => {
    if (!waypoints) return [];

    // Caso A: Formato Antigo (Array direto)
    if (Array.isArray(waypoints)) {
      return waypoints.map((wp: any) => ({ lat: wp.lat, lng: wp.lng }));
    }

    // Caso B: Formato Novo (GeoJSON) -> É AQUI QUE O ERRO ACONTECIA
    if (waypoints.type === "FeatureCollection" && Array.isArray(waypoints.features)) {
      const latLngs: { lat: number; lng: number }[] = [];
      
      waypoints.features.forEach((feature: any) => {
        if (feature.geometry.type === "LineString") {
          feature.geometry.coordinates.forEach((coord: number[]) => {
            // GeoJSON é [Long, Lat], Leaflet é [Lat, Long]
            latLngs.push({ lat: coord[1], lng: coord[0] });
          });
        } 
        else if (feature.geometry.type === "Point") {
           latLngs.push({ lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] });
        }
      });
      return latLngs;
    }

    return [];
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!rota) return null;

  // Processa o caminho antes de renderizar
  const rotaPath = getLeafletPath(rota.waypoints);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <Link href="/rotas">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* COLUNA DO MAPA */}
            <div className="md:col-span-2">
              <Card className="overflow-hidden shadow-lg h-[400px] md:h-[600px]">
                {/* O componente LeafletMap desenha a linha baseada no userPath */}
                <LeafletMap userPath={rotaPath} fullscreen />
              </Card>
            </div>

            {/* COLUNA DE DETALHES */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{rota.nome}</CardTitle>
                  <CardDescription>
                    Criada em {new Date(rota.criado_em).toLocaleDateString("pt-BR")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {rota.descricao || "Sem descrição."}
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Distância</p>
                        <p className="font-semibold">
                          {rota.distancia_total_km ? rota.distancia_total_km.toFixed(2) : "0.00"} km
                        </p>
                      </div>
                    </div>
                    {rota.dificuldade && (
                       <div className="flex items-center gap-2">
                        <Mountain className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Dificuldade</p>
                          <Badge variant="secondary">{rota.dificuldade}</Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-lg">Ações</CardTitle></CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Compartilhar</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isDeleting}>
                          {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                          Excluir Rota
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir rota?</AlertDialogTitle>
                          <AlertDialogDescription>Esta ação é irreversível.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={(e) => { e.preventDefault(); handleDeleteRota(); }} className="bg-destructive text-white hover:bg-destructive/90">
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}