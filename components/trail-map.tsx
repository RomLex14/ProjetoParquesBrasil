"use client"
import LeafletMap from "@/components/leaflet-map"

interface TrailMapProps {
  trailId: string
  fullscreen?: boolean
  recording?: boolean
  selectedTrailId?: string
}

export default function TrailMap({ trailId, fullscreen = false, recording = false, selectedTrailId }: TrailMapProps) {
  // Use the dynamic Leaflet map component
  return (
    <LeafletMap
      trailId={trailId === "all" ? undefined : trailId}
      showAllTrails={trailId === "all"}
      fullscreen={fullscreen}
      recording={recording}
      selectedTrailId={selectedTrailId}
    />
  )
}
