"use client"

import { useState, useEffect } from "react"
import Link from "next/link" // Garantir importação
import { Mountain, Search, Filter, MapPin, List, Compass, User, Star, TrendingUp, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
// Card e CardContent são usados pelo TrailCard que será importado
import { supabase } from "@/lib/supabase"
import { featuredTrails, getNearbyTrails, getTopRatedTrails, getPopularTrails } from "@/lib/data"
import { useGeolocation } from "@/hooks/use-geolocation"
import Navbar from "@/components/navbar"
import TrailCard from "@/components/trail-card" // <<< ADICIONADO IMPORT
import type { Trilhas } from "@/lib/types" // Para tipar displayedTrails corretamente


// Definição inline de TrailCard REMOVIDA

export default function TrilhasPage() {
  const [displayedTrails, setDisplayedTrails] = useState<Trilhas[]>([]) // Tipado com Trail importado
  const [view, setView] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [user, setUser] = useState<any>(null) // Mantenha 'any' ou defina um tipo de usuário mais específico
  const [userLocation, setUserLocation] = useState("Brasília, DF") // Ou algum valor padrão
  const { latitude, longitude, loading: loadingLocation } = useGeolocation()

  // Função para obter trilhas recomendadas baseadas no perfil do usuário (exemplo)
  const getRecommendedTrails = (): Trilhas[] => {
    return [
      featuredTrails[2], 
      featuredTrails[0], 
      featuredTrails[5], 
      featuredTrails[1], 
    ].filter(Boolean) as Trilhas[]; // filter(Boolean) para remover undefined se algum ID não existir
  }

  // Função para obter trilhas populares baseadas na localização (exemplo)
  const getLocalPopularTrails = (location: string): Trilhas[] => {
    if (location.includes("DF") || location.includes("Brasília")) {
      return featuredTrails
        .filter((trail) => trail.location.includes("Distrito Federal"))
        .sort((a, b) => b.rating - a.rating)
    }
    return getPopularTrails()
  }
  
  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        if (!user && process.env.NODE_ENV === 'production') { // Mostra modal apenas em produção ou conforme lógica desejada
          const timer = setTimeout(() => {
            setShowLoginModal(true)
          }, 20000) // Aumentado para 20s
          return () => clearTimeout(timer)
        }
      } catch (error) {
        console.error("Erro ao verificar usuário:", error)
      }
    }
    checkUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) setShowLoginModal(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    setIsLoading(true); // Garante que o loading seja ativado ao mudar user ou userLocation
    const timer = setTimeout(() => {
      if (user) {
        setDisplayedTrails(getRecommendedTrails())
      } else {
        setDisplayedTrails(getLocalPopularTrails(userLocation))
      }
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [user, userLocation])

  const handleFilterChange = (filter: string) => {
    setIsLoading(true)
    setTimeout(() => {
      let trailsToDisplay: Trilhas[] = [];
      switch (filter) {
        case "nearby":
          trailsToDisplay = getNearbyTrails(latitude, longitude);
          break
        case "toprated":
          trailsToDisplay = getTopRatedTrails();
          break
        case "popular":
          trailsToDisplay = getPopularTrails();
          break
        case "all":
          trailsToDisplay = featuredTrails;
          break
        case "recommended": // Adicionado para o botão "Para Você" / "Sugeridas"
        default:
          if (user) {
            trailsToDisplay = getRecommendedTrails();
          } else {
            trailsToDisplay = getLocalPopularTrails(userLocation);
          }
      }
      setDisplayedTrails(trailsToDisplay);
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8 px-4">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {user ? "Trilhas Recomendadas para Você" : "Descubra Trilhas"}
              </h1>
              <p className="text-muted-foreground">
                {user
                  ? "Baseado nas suas preferências e histórico de atividades."
                  : `Explore trilhas incríveis ${userLocation ? `próximas a ${userLocation}` : 'por todo o Brasil'}.`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => handleFilterChange("recommended")}>
                  <Compass className="mr-2 h-4 w-4" />
                  {user ? "Para Você" : "Sugeridas"}
                </Button>
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => handleFilterChange("nearby")} disabled={loadingLocation || !latitude}>
                  {loadingLocation ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Localizando...</>) : (<><MapPin className="mr-2 h-4 w-4" />Perto de Mim</>)}
                </Button>
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => handleFilterChange("toprated")}><Star className="mr-2 h-4 w-4" />Mais Bem Avaliadas</Button>
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => handleFilterChange("popular")}><TrendingUp className="mr-2 h-4 w-4" />Populares</Button>
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => handleFilterChange("all")}>Todas</Button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Buscar trilhas..." className="pl-8 pr-4 w-full" />
                </div>
                <Sheet>
                  <SheetTrigger asChild><Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button></SheetTrigger>
                  <SheetContent>
                    <SheetHeader><SheetTitle>Filtrar Trilhas</SheetTitle></SheetHeader>
                    <div className="grid gap-4 py-4"> {/* Conteúdo do filtro */} </div>
                  </SheetContent>
                </Sheet>
                <div className="border rounded-md p-1 flex dark:bg-slate-800">
                  <Button variant={view === "grid" ? "default" : "ghost"} size="sm" className="px-2" onClick={() => setView("grid")}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>
                  </Button>
                  <Button variant={view === "list" ? "default" : "ghost"} size="sm" className="px-2" onClick={() => setView("list")}><List className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse h-[380px] bg-muted dark:bg-slate-800"><CardContent className="p-0"></CardContent></Card>
                ))}
              </div>
            ) : (
              <>
                {displayedTrails.length === 0 && !isLoading && (
                   <div className="text-center py-10 col-span-full">
                     <Mountain className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                     <p className="text-muted-foreground">Nenhuma trilha encontrada com os filtros atuais.</p>
                   </div>
                )}
                {view === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {displayedTrails.map((trail) => (
                      <TrailCard key={trail.id} trail={trail} /> // <<< USANDO O COMPONENTE IMPORTADO
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 mt-6">
                    {displayedTrails.map((trail) => (
                      // Layout de lista (simplificado, ajuste conforme necessário)
                      <Card key={trail.id} className="flex overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="w-1/3 max-w-[180px] sm:max-w-[220px] relative flex-shrink-0">
                          <Link href={`/trilhas/${trail.id}`} className="block h-full">
                            <img src={trail.imageUrl || "/placeholder.svg"} alt={trail.name} className="w-full h-full object-cover aspect-[3/4] sm:aspect-video"/>
                          </Link>
                        </div>
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div>
                            <Badge className={`${(TrailCard as any).getDifficultyColor?.(trail.difficulty) || 'bg-gray-100 text-gray-800'} mb-1`}> 
                              {(TrailCard as any).getDifficultyText?.(trail.difficulty) || trail.difficulty}
                            </Badge>
                            <Link href={`/trilhas/${trail.id}`}>
                              <h3 className="font-bold text-lg hover:text-primary transition-colors line-clamp-1">{trail.name}</h3>
                            </Link>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                              <span className="line-clamp-1">{trail.location}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2 sm:line-clamp-3">{trail.description}</p>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mt-2">
                            <span className="flex items-center"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />{trail.rating.toFixed(1)}</span>
                            <span className="flex items-center"><TrendingUp className="h-4 w-4 mr-1"/>{trail.distance} km</span>
                            <span className="flex items-center"><Mountain className="h-4 w-4 mr-1"/>{trail.elevation}m</span>
                          </div>
                          <div className="mt-auto pt-3 text-right">
                            <Link href={`/trilhas/${trail.id}`}><Button size="sm">Ver Detalhes</Button></Link>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      {/* Footer ... (copie o footer da página inicial ou de outro componente se for padronizado) */}
       <footer className="w-full border-t py-6 md:py-0 bg-background">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo Parques Brasil" className="h-5 w-5" />
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Parques Brasil. Todos os direitos reservados.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Termos</Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacidade</Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contato</Link>
          </div>
        </div>
      </footer>

      {/* Modal de Login/Registro (igual ao da app/page.tsx) */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" />Recomendações personalizadas</DialogTitle>
            <DialogDescription>Crie uma conta ou faça login para receber recomendações de trilhas personalizadas.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <ul className="space-y-2 text-sm p-4 border rounded-md bg-muted/50 dark:bg-slate-800">
              {[
                { icon: Compass, text: "Receber recomendações personalizadas" },
                { icon: Star, text: "Salvar suas trilhas favoritas" },
                { icon: TrendingUp, text: "Registrar e acompanhar seu progresso" },
              ].map(item => <li key={item.text} className="flex items-start gap-2"><div className="rounded-full bg-primary/20 p-1 mt-0.5"><item.icon className="h-3 w-3 text-primary" /></div><span>{item.text}</span></li>)}
            </ul>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" className="sm:w-full" onClick={() => setShowLoginModal(false)}>Continuar sem login</Button>
            <div className="flex gap-2 sm:w-full">
              <Link href="/login" className="w-full"><Button className="w-full">Entrar</Button></Link>
              <Link href="/signup" className="w-full"><Button variant="secondary" className="w-full">Cadastrar</Button></Link>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}