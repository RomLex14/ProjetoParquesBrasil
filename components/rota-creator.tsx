"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LocateFixed, Save, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { useGeolocation } from "@/hooks/use-geolocation";
import Link from "next/link";

const MapForCreator = dynamic(() => import("./map-component-for-creator"), {
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center bg-muted"><Loader2 className="h-10 w-10 animate-spin" /></div>,
});

export default function RotaCreator() {
  const [waypoints, setWaypoints] = useState<L.LatLng[]>([]);
  const { latitude, longitude, loading: loadingLocation } = useGeolocation();
  const router = useRouter();

  const handleLocateUser = () => {
    if (latitude && longitude) {
        const userLatLng = new L.LatLng(latitude, longitude);
        setWaypoints(prev => [...prev, userLatLng]);
    }
  };

  return (
    <div className="flex-1 relative">
      <MapForCreator 
          waypoints={waypoints} 
          setWaypoints={setWaypoints} 
          initialPosition={{lat: latitude, lng: longitude}} 
      />

      <div className="absolute top-4 left-4 z-[1000]">
        <Button asChild variant="outline" className="bg-background/80 backdrop-blur-sm">
            <Link href="/rotas">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Rotas
            </Link>
        </Button>
      </div>

      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <Button 
          onClick={handleLocateUser}
          disabled={loadingLocation} 
          size="icon" 
          aria-label="Usar minha localização"
        >
          <LocateFixed className="h-5 w-5" />
        </Button>
        <Button variant="destructive" onClick={() => setWaypoints([])} disabled={waypoints.length === 0} size="icon" aria-label="Limpar rota">
          <Trash2 className="h-5 w-5" />
        </Button>
        <Button 
          onClick={() => {
            const routeData = { waypoints: waypoints };
            sessionStorage.setItem('finalizingRoute', JSON.stringify(routeData));
            router.push('/rotas/finalizar?type=planejada');
          }} 
          disabled={waypoints.length < 2} 
          size="icon" 
          aria-label="Finalizar e adicionar detalhes"
        >
          <Save className="h-5 w-5" />
        </Button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-lg">
          <p className="text-sm text-center text-foreground">
            {waypoints.length === 0 
              ? "Clique no mapa para adicionar o ponto inicial."
              : waypoints.length === 1 
              ? "Adicione mais pontos para criar um percurso."
              : `Rota com ${waypoints.length} pontos. Clique em um ponto para removê-lo.`
            }
          </p>
      </div>
    </div>
  );
}