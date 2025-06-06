"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Play,
  Pause,
  StopCircle,
  Clock,
  TrendingUp,
  Mountain,
  MapPin,
  ChevronDown,
  Share2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { getTrailById } from "@/lib/data"
import LeafletMap from "@/components/leaflet-map"
import Navbar from "@/components/navbar"

export default function TrailRecordPage({ params }: { params: { id: string } }) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [distance, setDistance] = useState(0)
  const [elevation, setElevation] = useState(0)
  const trail = getTrailById(params.id)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1)

        // Simular aumento de distância e elevação
        if (Math.random() > 0.7) {
          setDistance((prev) => +(prev + 0.01).toFixed(2))
        }

        if (Math.random() > 0.8) {
          setElevation((prev) => prev + 1)
        }
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRecording, isPaused])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartStop = () => {
    if (!isRecording) {
      setIsRecording(true)
      setIsPaused(false)
    } else {
      setIsRecording(false)
      setIsPaused(false)
    }
  }

  const handlePauseResume = () => {
    if (isRecording) {
      setIsPaused(!isPaused)
    }
  }

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
                Opções
                <ChevronDown className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Opções da Trilha</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Button variant="outline" className="justify-start">
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar Localização em Tempo Real
                </Button>
                <Button variant="outline" className="justify-start">
                  Baixar Mapa Offline
                </Button>
                <Button variant="outline" className="justify-start">
                  Reportar Problema
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <div className="flex-1 relative">
          <LeafletMap trailId={trail.id} fullscreen recording={isRecording && !isPaused} />
        </div>

        <div className="bg-background border-t">
          <div className="container py-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <Clock className="h-5 w-5 text-muted-foreground mb-1" />
                  <div className="text-xl font-bold">{formatTime(elapsedTime)}</div>
                  <div className="text-xs text-muted-foreground">Tempo</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-muted-foreground mb-1" />
                  <div className="text-xl font-bold">{distance.toFixed(2).replace(".", ",")} km</div>
                  <div className="text-xs text-muted-foreground">Distância</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <Mountain className="h-5 w-5 text-muted-foreground mb-1" />
                  <div className="text-xl font-bold">{elevation}m</div>
                  <div className="text-xs text-muted-foreground">Elevação</div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-14 w-14 rounded-full"
                onClick={handlePauseResume}
                disabled={!isRecording}
              >
                {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
              </Button>
              <Button
                variant={isRecording ? "destructive" : "default"}
                size="icon"
                className="h-14 w-14 rounded-full"
                onClick={handleStartStop}
              >
                {isRecording ? <StopCircle className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
