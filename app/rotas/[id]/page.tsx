// app/rotas/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import L from "leaflet";
import {
  ArrowLeft,
  Loader2,
  Share2,
  Edit,
  Trash2,
  CalendarDays,
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

// Tipo para os dados da rota que virão do banco
interface RotaUsuario {
  id: string;
  nome: string;
  descricao?: string | null;
  criado_em: string;
  dificuldade?: string | null;
  distancia_total_km?: number | null;
  waypoints: { lat: number; lng: number }[];
}

export default function RotaDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const rotaId = typeof params.id === 'string' ? params.id : undefined;

  const [rota, setRota] = useState<RotaUsuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRotaData = async () => {
      if (!rotaId) {
        setLoading(false);
        return;
      }

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
        console.error("Erro ao buscar dados da rota:", error);
        toast({ title: "Erro", description: "Não foi possível carregar a rota.", variant: "destructive" });
        setRota(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRotaData();
  }, [rotaId, toast]);

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

  if (!rota) {
    return (
      <>
        <Navbar />
        <div className="container text-center py-10">
          <h1 className="text-2xl font-bold">Rota não encontrada</h1>
          <Link href="/rotas">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Minhas Rotas
            </Button>
          </Link>
        </div>
      </>
    );
  }
  
  // Converte os waypoints para o formato que o Leaflet espera
  const rotaPath = rota.waypoints.map(wp => new L.LatLng(wp.lat, wp.lng));

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <Link href="/rotas">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Voltar para Minhas Rotas
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card className="overflow-hidden shadow-lg h-[400px] md:h-[600px]">
                <LeafletMap userPath={rotaPath} fullscreen />
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{rota.nome}</CardTitle>
                  <CardDescription>
                    Criada em {new Date(rota.criado_em).toLocaleDateString("pt-BR", { day: '2-digit', month: 'long', year: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {rota.descricao || "Nenhuma descrição fornecida para esta rota."}
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    {rota.distancia_total_km && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Distância</p>
                          <p className="font-semibold">{rota.distancia_total_km.toFixed(2)} km</p>
                        </div>
                      </div>
                    )}
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
                <CardHeader>
                    <CardTitle className="text-lg">Ações</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Compartilhar</Button>
                    <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Editar Rota (Em breve)</Button>
                    <Button variant="destructive" disabled><Trash2 className="mr-2 h-4 w-4" /> Excluir Rota</Button>
                </CardContent>
              </Card>

            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}