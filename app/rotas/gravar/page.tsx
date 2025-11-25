"use client"

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic";
// ❌ NÃO IMPORTAR LEAFLET AQUI. ISSO CAUSA O ERRO "WINDOW IS NOT DEFINED"
// import L from "leaflet"; 

import { 
  ArrowLeft, Play, Pause, StopCircle, Clock, TrendingUp, 
  Loader2, Save, PlayCircle, Trash2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGeolocation } from "@/hooks/use-geolocation";

// Importamos apenas o TIPO das props para usar no dynamic
import type { MapComponentProps } from "@/components/map-component-for-recorder";

// Carregamento dinâmico com SSR desativado
const MapForRecorder = dynamic<MapComponentProps>(() => import("@/components/map-component-for-recorder"), {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-muted flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Carregando mapa...</span>
      </div>
    )
});

type RecordingStatus = 'idle' | 'recording' | 'paused' | 'finished';

export default function GravarRotaPage() {
  const router = useRouter();
  
  const [status, setStatus] = useState<RecordingStatus>('idle'); 
  const [elapsedTime, setElapsedTime] = useState(0);
  const [distance, setDistance] = useState(0);
  
  const { latitude, longitude } = useGeolocation({
    enableHighAccuracy: true,
    maximumAge: 0,
  });

  // ✅ CORREÇÃO 1: Usar objetos simples { lat, lng } em vez de tipos do Leaflet
  const [recordedPath, setRecordedPath] = useState<{ lat: number; lng: number }[]>([]);
  
  // ✅ CORREÇÃO 2: Ref também guarda objeto simples
  const lastPosition = useRef<{ lat: number; lng: number } | null>(null);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'recording') {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Lógica de GPS e Distância
  useEffect(() => {
    const processPosition = async () => {
      if (status === 'recording' && latitude && longitude) {
        const newPoint = { lat: latitude, lng: longitude };
        
        setRecordedPath(prevPath => [...prevPath, newPoint]);

        if (lastPosition.current) {
          // ✅ CORREÇÃO 3: Importamos o Leaflet dinamicamente SÓ aqui dentro
          // Isso evita que o servidor tente carregar o Leaflet e acesse 'window'
          try {
            const L = (await import('leaflet')).default;
            const from = L.latLng(lastPosition.current.lat, lastPosition.current.lng);
            const to = L.latLng(newPoint.lat, newPoint.lng);
            
            setDistance(prev => prev + from.distanceTo(to));
          } catch (error) {
            console.error("Erro ao calcular distância:", error);
          }
        }
        lastPosition.current = newPoint;
      }
    };

    processPosition();
  }, [latitude, longitude, status]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setStatus('recording');
    setElapsedTime(0);
    setDistance(0);
    setRecordedPath([]);
    lastPosition.current = null;
  };

  const handleStop = () => {
    setStatus('finished');
  };
  
  const handlePauseResume = () => {
    setStatus(prev => prev === 'paused' ? 'recording' : 'paused');
  };
  
  const handleDiscard = () => {
    setStatus('idle');
    setRecordedPath([]);
    setElapsedTime(0);
    setDistance(0);
  };

  const handleSave = () => {
    if (recordedPath.length > 1) {
      const routeData = {
        waypoints: recordedPath, // Já está no formato correto {lat, lng}
        distance: distance,
        name: `Minha trilha de ${new Date().toLocaleDateString('pt-BR')}`
      };
      sessionStorage.setItem('finalizingRoute', JSON.stringify(routeData));
      router.push('/rotas/finalizar?type=gravada');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-background border-b z-10">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/rotas">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-semibold">Gravar Nova Rota</h1>
              <p className="text-xs text-muted-foreground">
                {status === 'idle' && 'Pressione Iniciar para começar'}
                {status === 'recording' && 'Gravando seu percurso...'}
                {status === 'paused' && 'Gravação pausada'}
                {status === 'finished' && 'Gravação finalizada. Salve ou descarte.'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative">
        <div className="flex-1 relative w-full h-full">
          {/* O mapa agora aceita nosso array de objetos simples e tem z-index baixo */}
          <MapForRecorder userPath={recordedPath} />
        </div>

        <div className="bg-background border-t z-20 relative">
          <div className="container py-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Card><CardContent className="p-4 flex flex-col items-center justify-center"><Clock className="h-5 w-5 text-muted-foreground mb-1" /><div className="text-xl font-bold">{formatTime(elapsedTime)}</div><div className="text-xs text-muted-foreground">Tempo</div></CardContent></Card>
              <Card><CardContent className="p-4 flex flex-col items-center justify-center"><TrendingUp className="h-5 w-5 text-muted-foreground mb-1" /><div className="text-xl font-bold">{(distance / 1000).toFixed(2).replace(".", ",")} km</div><div className="text-xs text-muted-foreground">Distância</div></CardContent></Card>
            </div>

            <div className="flex justify-center gap-4">
              {status === 'idle' && (
                <Button size="lg" className="h-14 rounded-full px-8" onClick={handleStart}>
                  <PlayCircle className="mr-2 h-6 w-6" /> Iniciar Gravação
                </Button>
              )}

              {(status === 'recording' || status === 'paused') && (
                <>
                  <Button variant="outline" size="lg" className="h-14 rounded-full px-8" onClick={handlePauseResume}>
                    {status === 'paused' ? <Play className="mr-2 h-6 w-6" /> : <Pause className="mr-2 h-6 w-6" />}
                    {status === 'paused' ? 'Continuar' : 'Pausar'}
                  </Button>
                  <Button variant="destructive" size="lg" className="h-14 rounded-full px-8" onClick={handleStop}>
                    <StopCircle className="mr-2 h-6 w-6" /> Finalizar
                  </Button>
                </>
              )}

              {status === 'finished' && (
                <>
                  <Button variant="outline" size="lg" className="h-14 rounded-full px-8" onClick={handleDiscard}>
                    <Trash2 className="mr-2 h-6 w-6" /> Descartar
                  </Button>
                  <Button size="lg" className="h-14 rounded-full px-8" onClick={handleSave}>
                    <Save className="mr-2 h-6 w-6" /> Salvar Rota
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}