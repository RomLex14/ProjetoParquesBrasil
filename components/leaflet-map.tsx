"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import type { Trilhas } from "@/lib/types";

// Importação dinâmica com SSR desligado
const LeafletMapComponent = dynamic(() => import("@/components/leaflet-map-client"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-muted/50 min-h-[300px]">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
      <span className="text-sm text-muted-foreground font-medium">Carregando mapa...</span>
    </div>
  ),
})

interface LeafletMapProps {
  trailId?: string
  fullscreen?: boolean
  recording?: boolean
  showAllTrails?: boolean
  selectedTrailId?: string
  trailsToDisplay?: Trilhas[]
}

export default function LeafletMap(props: LeafletMapProps) {
  return <LeafletMapComponent {...props} />
}