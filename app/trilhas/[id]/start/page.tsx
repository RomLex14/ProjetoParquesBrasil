"use client"

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import L from "leaflet";
import { 
  ArrowLeft, Play, Pause, StopCircle, Clock, TrendingUp, Mountain, 
  MapPin, ChevronDown, Share2, Loader2, Save,
  PlayCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getTrailById } from "@/lib/data";
import LeafletMap from "@/components/leaflet-map";
import Navbar from "@/components/navbar";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useToast } from "@/hooks/use-toast";

export default function TrailRecordPage({ params }: { params: { id: string } }) {
  const trail = getTrailById(params.id);
  const router = useRouter();
  const { toast } = useToast();
  
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [elevation, setElevation] = useState(0);
  
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [newTrailName, setNewTrailName] = useState("");
  const [newTrailDescription, setNewTrailDescription] = useState("");
  const [newTrailDifficulty, setNewTrailDifficulty] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  
  const { latitude, longitude } = useGeolocation({
  enableHighAccuracy: true,
  maximumAge: 0,
});
  const [recordedPath, setRecordedPath] = useState<L.LatLng[]>([]);
  const lastPosition = useRef<L.LatLng | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  useEffect(() => {
    if (isRecording && !isPaused && latitude && longitude) {
      const newPosition = new L.LatLng(latitude, longitude);
      setRecordedPath(prevPath => [...prevPath, newPosition]);

      if (lastPosition.current) {
        setDistance(prev => prev + lastPosition.current!.distanceTo(newPosition));
      }
      lastPosition.current = newPosition;
    }
  }, [latitude, longitude, isRecording, isPaused]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsRecording(true);
    setIsPaused(false);
    setElapsedTime(0);
    setDistance(0);
    setElevation(0);
    setRecordedPath([]);
    lastPosition.current = null;
  };

  const handleStop = () => {
    setIsRecording(false);
    setIsPaused(false);
    if(recordedPath.length > 1) {
      setNewTrailName(`Minha trilha de ${new Date().toLocaleDateString('pt-BR')}`);
      setIsSaveDialogOpen(true);
    }
  };
  
  const handlePauseResume = () => {
    if (isRecording) {
      setIsPaused(!isPaused);
    }
  };

  const handleSaveTrail = async () => {
    if (!newTrailName.trim()) {
      toast({ title: "Nome inválido", description: "Por favor, dê um nome para sua trilha.", variant: "destructive" });
      return;
    }
    if (!newTrailDifficulty) {
      toast({ title: "Dificuldade não selecionada", description: "Por favor, escolha uma dificuldade.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({ title: "Erro de Autenticação", description: "Você precisa estar logado para salvar.", variant: "destructive" });
      setIsSaving(false);
      return;
    }

    try {
      const { data, error } = await supabase.from('rotas_usuario').insert({
        usuario_id: user.id,
        nome: newTrailName,
        descricao: newTrailDescription,
        dificuldade: newTrailDifficulty,
        waypoints: recordedPath.map(p => ({ lat: p.lat, lng: p.lng })),
        distancia_total_km: parseFloat((distance / 1000).toFixed(2)),
      }).select().single();

      if (error) throw error;

      toast({ title: "Sucesso!", description: "Sua nova trilha foi salva." });
      setIsSaveDialogOpen(false);
      
      if (data) {
        router.push(`/rotas/${data.id}`);
      } else {
        router.push('/rotas');
      }

    } catch (error: any) {
      console.error("Erro ao salvar trilha:", error);
      toast({ title: "Erro ao Salvar", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (!trail) {
    return (
      <>
        <Navbar />
        <div className="container py-10">Trilha não encontrada</div>
      </>
    )
  }

  return (
    <>
      <div className="flex flex-col h-screen">
        <header className="bg-background border-b z-10">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/trilhas/${trail.id}`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-semibold">{trail.name}</h1>
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{trail.location}</span>
                </div>
              </div>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  Opções <ChevronDown className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Opções da Trilha</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <Button variant="outline" className="justify-start">
                    <Share2 className="mr-2 h-4 w-4" /> Compartilhar Localização
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            {/* Passando o trajeto gravado para o mapa */}
            <LeafletMap trailId={trail.id} fullscreen userPath={recordedPath} />
          </div>

          <div className="bg-background border-t">
            <div className="container py-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <Card><CardContent className="p-4 flex flex-col items-center justify-center"><Clock className="h-5 w-5 text-muted-foreground mb-1" /><div className="text-xl font-bold">{formatTime(elapsedTime)}</div><div className="text-xs text-muted-foreground">Tempo</div></CardContent></Card>
                <Card><CardContent className="p-4 flex flex-col items-center justify-center"><TrendingUp className="h-5 w-5 text-muted-foreground mb-1" /><div className="text-xl font-bold">{(distance / 1000).toFixed(2).replace(".", ",")} km</div><div className="text-xs text-muted-foreground">Distância</div></CardContent></Card>
                <Card><CardContent className="p-4 flex flex-col items-center justify-center"><Mountain className="h-5 w-5 text-muted-foreground mb-1" /><div className="text-xl font-bold">{elevation}m</div><div className="text-xs text-muted-foreground">Elevação</div></CardContent></Card>
              </div>

              <div className="flex justify-center gap-4">
                {isRecording ? (
                  <>
                    <Button variant="outline" size="icon" className="h-14 w-14 rounded-full" onClick={handlePauseResume}>
                      {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
                    </Button>
                    <Button variant="destructive" size="icon" className="h-14 w-14 rounded-full" onClick={handleStop}>
                      <StopCircle className="h-6 w-6" />
                    </Button>
                  </>
                ) : (
                  <Button size="lg" className="h-14 rounded-full px-8" onClick={handleStart}>
                    <PlayCircle className="mr-2 h-6 w-6" /> Iniciar Gravação
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Salvar Trilha Concluída</DialogTitle>
            <DialogDescription>
              Adicione os detalhes da sua aventura. Ela será salva em "Minhas Rotas".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="trail-name">Nome da Trilha</Label>
              <Input id="trail-name" value={newTrailName} onChange={(e) => setNewTrailName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trail-description">Descrição</Label>
              <Textarea id="trail-description" value={newTrailDescription} onChange={(e) => setNewTrailDescription(e.target.value)} placeholder="Como foi a experiência? Dicas?" />
            </div>
            <div className="space-y-2">
              <Label>Dificuldade</Label>
              <RadioGroup value={newTrailDifficulty} onValueChange={setNewTrailDifficulty} className="flex gap-4 pt-1">
                {["Fácil", "Moderado", "Difícil", "Extrema"].map(level => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem value={level} id={`diff-${level}`} />
                    <Label htmlFor={`diff-${level}`} className="font-normal">{level}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsSaveDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" onClick={handleSaveTrail} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Trilha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}