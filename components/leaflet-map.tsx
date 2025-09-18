"use client"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import type { Trilhas } from "@/lib/types"; // <<< 1. IMPORTAR O TIPO TRILHAS

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

// <<< 2. ATUALIZAR A INTERFACE DE PROPRIEDADES >>>
interface LeafletMapProps {
  trailId?: string
  fullscreen?: boolean
  recording?: boolean
  showAllTrails?: boolean
  selectedTrailId?: string
  trailsToDisplay?: Trilhas[] // Adicionada a nova propriedade
}

export default function LeafletMap(props: LeafletMapProps) {
  // O componente agora passará todas as propriedades, incluindo trailsToDisplay
  return <LeafletMapComponent {...props} />
}