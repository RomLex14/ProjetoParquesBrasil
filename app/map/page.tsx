"use client"

import { useState } from "react"
import Link from "next/link"
import { Mountain, Search, Filter, MapPin, List, MapIcon, ChevronLeft, ChevronRight, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { featuredTrails } from "@/lib/data"
import LeafletMap from "@/components/leaflet-map"
import TrailCard from "@/components/trail-card"
import { cn } from "@/lib/utils"

export default function MapPage() {
  const [view, setView] = useState<"map" | "list">("map")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedTrailId, setSelectedTrailId] = useState<string | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrar trilhas com base no termo de busca
  const filteredTrails = featuredTrails.filter(
    (trail) =>
      trail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trail.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Função para traduzir a dificuldade
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "Fácil"
      case "Moderate":
        return "Moderada"
      case "Hard":
        return "Difícil"
      default:
        return difficulty
    }
  }

  // Função para obter a cor da dificuldade
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500"
      case "Moderate":
        return "bg-yellow-500"
      case "Hard":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  // Função para selecionar uma trilha
  const handleTrailSelect = (trailId: string) => {
    setSelectedTrailId(trailId)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Mountain className="h-6 w-6 text-primary" />
            <span>Explorador de Trilhas</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 mx-6">
            <Link href="/trails" className="text-sm font-medium transition-colors hover:text-primary">
              Descobrir
            </Link>
            <Link href="/map" className="text-sm font-medium transition-colors hover:text-primary font-bold">
              Mapa
            </Link>
            <Link href="/saved" className="text-sm font-medium transition-colors hover:text-primary">
              Salvos
            </Link>
            <Link href="/record" className="text-sm font-medium transition-colors hover:text-primary">
              Registrar
            </Link>
          </div>
          <div className="flex items-center ml-auto gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Cadastrar</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <div className="container py-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar trilhas por localização ou nome..."
                className="pl-8 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtrar Trilhas</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  {/* Opções de filtro iriam aqui */}
                  <p>Distância, dificuldade, elevação, etc.</p>
                </div>
              </SheetContent>
            </Sheet>
            <div className="border rounded-md p-1">
              <Button
                variant={view === "map" ? "default" : "ghost"}
                size="sm"
                className="px-2.5"
                onClick={() => setView("map")}
              >
                <MapIcon className="h-4 w-4 mr-2" />
                Mapa
              </Button>
              <Button
                variant={view === "list" ? "default" : "ghost"}
                size="sm"
                className="px-2.5"
                onClick={() => setView("list")}
              >
                <List className="h-4 w-4 mr-2" />
                Lista
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          {view === "map" ? (
            <div className="absolute inset-0 flex">
              {/* Sidebar de navegação */}
              <div
                className={cn(
                  "h-full bg-background border-r transition-all duration-300 z-10",
                  sidebarOpen ? "w-80" : "w-0",
                )}
              >
                {sidebarOpen && (
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b flex items-center justify-between">
                      <h3 className="font-medium">Trilhas Disponíveis</h3>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSidebarOpen(false)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-4">
                      <Input
                        type="search"
                        placeholder="Filtrar trilhas..."
                        className="mb-4"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex-1 overflow-auto">
                      <div className="space-y-1 p-2">
                        {filteredTrails.map((trail) => (
                          <div
                            key={trail.id}
                            className={cn(
                              "p-3 rounded-md cursor-pointer transition-colors",
                              selectedTrailId === trail.id
                                ? "bg-primary/10 border border-primary/20"
                                : "hover:bg-muted",
                            )}
                            onClick={() => handleTrailSelect(trail.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-muted"
                                style={{
                                  backgroundImage: `url(${trail.imageUrl || "/placeholder.svg"})`,
                                  backgroundSize: "cover",
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">{trail.name}</h4>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span className="truncate">{trail.location}</span>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <div className="flex items-center">
                                    <div
                                      className={`w-2 h-2 rounded-full ${getDifficultyColor(trail.difficulty)} mr-1`}
                                    />
                                    <span className="text-xs">{getDifficultyLabel(trail.difficulty)}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                    <span className="text-xs">{trail.rating.toFixed(1).replace(".", ",")}</span>
                                  </div>
                                  <span className="text-xs">{trail.distance.toString().replace(".", ",")} km</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botão para abrir sidebar quando fechada */}
              {!sidebarOpen && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 left-4 z-20 bg-background/80 backdrop-blur-sm"
                  onClick={() => setSidebarOpen(true)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}

              {/* Mapa */}
              <div className="flex-1 relative">
                <LeafletMap showAllTrails fullscreen selectedTrailId={selectedTrailId} />
              </div>
            </div>
          ) : (
            <div className="container py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrails.map((trail) => (
                  <TrailCard key={trail.id} trail={trail} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <div className="flex items-center gap-2">
            <Mountain className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">© 2025 Explorador de Trilhas. Todos os direitos reservados.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Termos
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacidade
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contato
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
