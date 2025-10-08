"use client"

import Link from "next/link"
import { ArrowLeft, Mountain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTrailById } from "@/lib/data"
import LeafletMap from "@/components/leaflet-map"
import Navbar from "@/components/navbar"

export default function TrailMapPage({ params }: { params: { id: string } }) {
  const trail = getTrailById(params.id)

  if (!trail) {
    return (
      <>
        <Navbar />
        <div className="container py-10">Trilha não encontrada</div>
      </>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-background border-b z-10">
        <div className="container flex h-16 items-center">
          <Link href={`/trilhas/${trail.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 font-bold">
            <Mountain className="h-5 w-5 text-primary" />
            <span>{trail.name}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        <LeafletMap trailId={trail.id} fullscreen />
      </main>
    </div>
  )
}
