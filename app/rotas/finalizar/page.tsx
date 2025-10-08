"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Info, Route, Radio as RadioIcon } from "lucide-react";
import Navbar from "@/components/navbar";
import AuthGuard from "@/components/auth-guard";

export default function FinalizarRotaPage() {
  const [waypoints, setWaypoints] = useState<any[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [routeName, setRouteName] = useState("");
  const [routeDescription, setRouteDescription] = useState("");
  const [routeDifficulty, setRouteDifficulty] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const routeType = searchParams.get('type'); 

 useEffect(() => {
    
    setTimeout(() => {
      const storedData = sessionStorage.getItem('finalizingRoute');
      if (storedData) {
        const data = JSON.parse(storedData);
        setWaypoints(data.waypoints || []);
        setDistance(data.distance || null);
        setRouteName(data.name || `Minha rota de ${new Date().toLocaleDateString('pt-BR')}`);
        sessionStorage.removeItem('finalizingRoute');
      }
      setIsLoading(false); 
    }, 100); 
  }, []); 
  
  if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin" />
        </div>
    );
  }

  // ADICIONE ESTA VERIFICAÇÃO DE ERRO LOGO A SEGUIR:
  if (!waypoints || waypoints.length === 0) {
    return (
        <div className="container text-center py-10">
            <h1 className="text-2xl font-bold">Percurso não encontrado</h1>
            <p className="text-muted-foreground">Não foi possível carregar os dados da rota. Por favor, tente novamente.</p>
            <Button asChild variant="outline" className="mt-4">
                <Link href="/rotas">Voltar para Minhas Rotas</Link>
            </Button>
        </div>
    );
  }

  const handleSaveRoute = async () => {
    if (!routeName.trim()) {
      toast({ title: "Erro", description: "Por favor, dê um nome para a sua rota.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { /* ... erro de autenticação ... */ return; }

    try {
      const { data, error } = await supabase.from('rotas_usuario').insert({
        usuario_id: user.id,
        nome: routeName,
        descricao: routeDescription,
        dificuldade: routeDifficulty,
        waypoints: waypoints,
        distancia_total_km: distance ? parseFloat((distance / 1000).toFixed(2)) : null,
      }).select().single();

      if (error) throw error;
      toast({ title: "Sucesso!", description: "Sua rota foi salva." });
      
      if (data) {
        router.push(`/rotas/${data.id}`);
      } else {
        router.push('/rotas');
      }
    } catch (error: any) {
      console.error("Erro ao salvar rota:", error);
      toast({ title: "Erro ao Salvar", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <main className="container max-w-2xl mx-auto py-8 px-4">
          <div className="mb-6">
              <h1 className="text-3xl font-bold">
                {routeType === 'gravada' ? 'Finalizar Rota Gravada' : 'Finalizar Rota Planejada'}
              </h1>
              <p className="text-muted-foreground">Adicione os detalhes para salvar o seu percurso.</p>
          </div>

          <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 flex items-start gap-3">
                  {routeType === 'gravada' ? <RadioIcon className="h-5 w-5 flex-shrink-0 mt-0.5" /> : <Route className="h-5 w-5 flex-shrink-0 mt-0.5" />}
                  <p>
                    Seu percurso com <strong>{waypoints.length} pontos</strong> 
                    {distance && <span> e distância de <strong>{(distance / 1000).toFixed(2)} km</strong></span>} foi salvo.
                    Adicione detalhes para salva-lo.
                  </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome da Rota</Label>
                <Input id="name" value={routeName} onChange={(e) => setRouteName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" value={routeDescription} onChange={(e) => setRouteDescription(e.target.value)} placeholder="Como foi a experiência? Dicas?" />
              </div>
              <div className="space-y-2">
                <Label>Dificuldade</Label>
                <RadioGroup value={routeDifficulty} onValueChange={setRouteDifficulty} className="flex flex-wrap gap-4 pt-2">
                    {["Fácil", "Moderado", "Difícil", "Extrema"].map(level => (
                        <div key={level} className="flex items-center space-x-2">
                        <RadioGroupItem value={level} id={`diff-${level}`} />
                        <Label htmlFor={`diff-${level}`} className="font-normal">{level}</Label>
                        </div>
                    ))}
                </RadioGroup>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" asChild>
                    <Link href="/rotas">Cancelar</Link>
                </Button>
                <Button onClick={handleSaveRoute} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Rota
                </Button>
              </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}