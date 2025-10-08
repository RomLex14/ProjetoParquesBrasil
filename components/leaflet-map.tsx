"use client"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import type { Trilhas } from "@/lib/types";
import type L from "leaflet"; // Importa os tipos do Leaflet

// Dynamically import Leaflet with no SSR
const LeafletMapComponent = dynamic(() => import("@/components/leaflet-map-client"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <span className="ml-2 text-muted-foreground">Carregando mapa...</span>
    </div>
  ),
})

// Atualiza a interface de propriedades para incluir o caminho do usuário
interface LeafletMapProps {
  trailId?: string
  fullscreen?: boolean
  recording?: boolean
  showAllTrails?: boolean
  selectedTrailId?: string
  trailsToDisplay?: Trilhas[]
  userPath?: L.LatLng[] // <-- Propriedade adicionada
}

export default function LeafletMap(props: LeafletMapProps) {
  return <LeafletMapComponent {...props} />
}