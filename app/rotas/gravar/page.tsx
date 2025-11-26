"use client"

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic";
import { 
  ArrowLeft, Play, Pause, StopCircle, Clock, TrendingUp, 
  Loader2, Save, PlayCircle, Trash2, Lock
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useToast } from "@/hooks/use-toast";

// ✅ CORREÇÃO 1: Importando a interface MapRecorderProps (que definimos no arquivo acima)
import type { MapRecorderProps } from "@/components/map-component-for-recorder";

// ✅ CORREÇÃO 2: Usando MapRecorderProps no dynamic
const MapForRecorder = dynamic<MapRecorderProps>(
  () => import("@/components/map-component-for-recorder"), 
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-muted flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Carregando mapa...</span>
      </div>
    )
  }
);

type RecordingStatus = 'idle' | 'recording' | 'paused' | 'finished';

const MIN_DISTANCE_THRESHOLD = 8;

export default function GravarRotaPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [status, setStatus] = useState<RecordingStatus>('idle'); 
  const [elapsedTime, setElapsedTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  
  const { latitude, longitude, error: geoError } = useGeolocation({
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 10000
  });

  const [recordedPath, setRecordedPath] = useState<{ lat: number; lng: number }[]>([]);
  const lastAcceptedPosition = useRef<{ lat: number; lng: number } | null>(null);

  const requestWakeLock = useCallback(async () => {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        const sentinel = await navigator.wakeLock.request('screen');
        setWakeLock(sentinel);
      } catch (err) {
        console.error('Erro ao solicitar Wake Lock:', err);
      }
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLock) {
      await wakeLock.release();
      setWakeLock(null);
    }
  }, [wakeLock]);

  useEffect(() => {
    if (status === 'recording') {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && status === 'recording') {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      releaseWakeLock();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [status, requestWakeLock, releaseWakeLock]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'recording') {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    const processPosition = async () => {
      if (status !== 'recording' || latitude === null || longitude === null) {
        return;
      }

      const newPoint = { lat: latitude, lng: longitude };
      
      if (!lastAcceptedPosition.current) {
        setRecordedPath([newPoint]);
        lastAcceptedPosition.current = newPoint;
        return;
      }

      const lastPos = lastAcceptedPosition.current;

      try {
        const L = (await import('leaflet')).default;
        const from = L.latLng(lastPos.lat, lastPos.lng);
        const to = L.latLng(newPoint.lat, newPoint.lng);
        
        const dist = from.distanceTo(to);

        if (dist >= MIN_DISTANCE_THRESHOLD) {
          setRecordedPath((prev) => [...prev, newPoint]);
          setDistance((prev) => prev + dist);
          lastAcceptedPosition.current = newPoint;
        }
      } catch (error) {
        console.error("Erro ao calcular distância:", error);
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
    if (latitude === null || longitude === null) {
      toast({ title: "Aguardando GPS...", description: "Espere o sinal de GPS ser encontrado.", variant: "destructive" });
      return;
    }
    setStatus('recording');
    setElapsedTime(0);
    setDistance(0);
    setRecordedPath([]);
    lastAcceptedPosition.current = null;
  };

  const handleStop = () => setStatus('finished');
  
  const handlePauseResume = () => {
    setStatus(prev => prev === 'paused' ? 'recording' : 'paused');
  };
  
  const handleDiscard = () => {
    if (window.confirm("Tem certeza que deseja descartar esta gravação?")) {
      setStatus('idle');
      setRecordedPath([]);
      setElapsedTime(0);
      setDistance(0);
      lastAcceptedPosition.current = null;
    }
  };

  const handleSave = () => {
    if (recordedPath.length < 2) {
      toast({ title: "Trilha muito curta", description: "Ande um pouco mais antes de salvar.", variant: "destructive" });
      return;
    }

    const routeData = {
      waypoints: recordedPath,
      distance: distance,
      name: `Trilha gravada em ${new Date().toLocaleDateString('pt-BR')}`
    };
    
    sessionStorage.setItem('finalizingRoute', JSON.stringify(routeData));
    router.push('/rotas/finalizar?type=gravada');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="bg-background border-b z-10">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/rotas">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-semibold">Gravar Trilha</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {status === 'recording' && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"/>}
                {status === 'idle' && 'Pronto para iniciar'}
                {status === 'recording' && 'Gravando...'}
                {status === 'paused' && 'Pausado'}
                {status === 'finished' && 'Finalizado'}
              </p>
            </div>
          </div>
          {/* ✅ CORREÇÃO 3: Prop 'title' movida para div wrapper */}
          {status === 'recording' && (
             <div title="Tela mantida ligada">
                <Lock className="h-4 w-4 text-green-500" />
             </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col relative">
        <div className="flex-1 relative w-full h-full bg-gray-100">
          <MapForRecorder 
            positions={recordedPath} 
            currentPosition={latitude && longitude ? { lat: latitude, lng: longitude } : null} 
          />
          
          {geoError && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-destructive text-white px-4 py-2 rounded-full shadow-lg text-xs font-bold z-[500]">
              Erro de GPS: Verifique permissões
            </div>
          )}
        </div>

        <div className="bg-background border-t z-20 relative shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="container py-6 pb-8">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="border-none shadow-sm bg-muted/50">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <Clock className="h-5 w-5 text-primary mb-2" />
                  <div className="text-2xl font-bold font-mono">{formatTime(elapsedTime)}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Tempo</div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-muted/50">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary mb-2" />
                  <div className="text-2xl font-bold font-mono">
                    {(distance / 1000).toFixed(2)} <span className="text-sm font-normal text-muted-foreground">km</span>
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Distância</div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center gap-4">
              {status === 'idle' && (
                <Button 
                  size="lg" 
                  className="h-16 rounded-full px-10 text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105" 
                  onClick={handleStart}
                  disabled={latitude === null}
                >
                  <PlayCircle className="mr-2 h-6 w-6" /> Iniciar
                </Button>
              )}

              {(status === 'recording' || status === 'paused') && (
                <>
                  <Button variant="outline" size="lg" className="h-16 w-16 rounded-full p-0 border-2" onClick={handlePauseResume}>
                    {status === 'paused' ? <Play className="h-6 w-6 fill-current" /> : <Pause className="h-6 w-6 fill-current" />}
                  </Button>
                  <Button variant="destructive" size="lg" className="h-16 rounded-full px-8 text-lg shadow-lg shadow-destructive/20" onClick={handleStop}>
                    <StopCircle className="mr-2 h-6 w-6" /> Finalizar
                  </Button>
                </>
              )}

              {status === 'finished' && (
                <>
                  <Button variant="ghost" size="lg" className="h-14 px-6 text-muted-foreground hover:text-destructive" onClick={handleDiscard}>
                    <Trash2 className="mr-2 h-5 w-5" /> Descartar
                  </Button>
                  <Button size="lg" className="h-14 rounded-full px-8 shadow-lg" onClick={handleSave}>
                    <Save className="mr-2 h-5 w-5" /> Salvar Rota
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