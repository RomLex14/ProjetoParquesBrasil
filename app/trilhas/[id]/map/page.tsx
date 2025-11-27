// app/trilhas/[id]/map/page.tsx
"use client"

import Link from "next/link"
import { ArrowLeft, Mountain, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTrailById } from "@/lib/data"
import Navbar from "@/components/navbar"
import dynamic from "next/dynamic" // Importação necessária

// --- CORREÇÃO DO ERRO ---
const LeafletMap = dynamic(() => import("@/components/leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
})

// Next.js 15: params é Promise (Tipagem corrigida para build)
interface PageProps {
  params: Promise<{ id: string }>;
}

// Componente assíncrono para lidar com params Promise
import { use } from "react";

export default function TrailMapPage({ params }: PageProps) {
  // Desembrulha os params (Next.js 15)
  const { id } = use(params);
  const trail = getTrailById(id);

  if (!trail) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center container">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Trilha não encontrada</h1>
            <Button asChild>
              <Link href="/trilhas">Voltar para Trilhas</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-background border-b z-10 shrink-0">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/trilhas/${trail.id}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 font-bold text-lg">
              <Mountain className="h-5 w-5 text-primary" />
              <span>{trail.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 relative w-full h-full overflow-hidden">
        <LeafletMap trailId={trail.id} fullscreen />
      </main>
    </div>
  )
}
