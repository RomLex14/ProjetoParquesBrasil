"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import {
  Navigation,
  Search,
  Loader2,
  Plus,
  Mountain,
  Globe
} from "lucide-react"
import Navbar from "@/components/navbar"
import { supabase } from "@/lib/supabase"
import TrailCard from "@/components/trail-card"
import { Card } from "@/components/ui/card"
import { Trilhas } from "@/lib/types"

type Suggestion = {
  id: string;
  nome: string;
  type: 'trilha' | 'parque';
  location: string;
  link: string;
};

// Interface para receber as trilhas do servidor
interface HomeClientProps {
  featuredTrails: Trilhas[];
}

export default function HomeClient({ featuredTrails }: HomeClientProps) {
  const [user, setUser] = useState<any>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [showLocationRequest, setShowLocationRequest] = useState(false)
  const [locationPermission, setLocationPermission] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSuggestions(false)
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }
  
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const debounceTimer = setTimeout(() => {
      const fetchSuggestions = async () => {
        setIsSuggestionsLoading(true)
        try {
          const [trilhasRes, parquesRes] = await Promise.all([
            supabase.from('view_trilhas_app').select('id, nome, parque_nome').ilike('nome', `%${searchQuery}%`).limit(3),
            supabase.from('parques').select('id, nome, localizacao').ilike('nome', `%${searchQuery}%`).limit(3)
          ]);

          const trilhasSuggestions: Suggestion[] = (trilhasRes.data || []).map((t: any) => ({
            id: t.id,
            nome: t.nome,
            type: 'trilha',
            location: t.parque_nome || 'Trilha',
            link: `/trilhas/${t.id}`
          }));

          const parquesSuggestions: Suggestion[] = (parquesRes.data || []).map((p: any) => ({
            id: p.id,
            nome: p.nome,
            type: 'parque',
            location: 'Parque Nacional',
            link: `/parques/${p.id}`
          }));
          
          setSuggestions([...parquesSuggestions, ...trilhasSuggestions])
          setShowSuggestions(true)
        } catch (error) {
          console.error("Erro ao buscar sugestões:", error)
        } finally {
          setIsSuggestionsLoading(false)
        }
      }
      fetchSuggestions()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    async function checkUserSession() {
      setLoadingAuth(true)
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Erro ao verificar sessão do usuário:", error)
      } finally {
        setLoadingAuth(false)
      }
    }
    checkUserSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (_event !== "INITIAL_SESSION") {
        setLoadingAuth(false)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  useEffect(() => {
    if (!isClient) return 

    if (navigator.geolocation && "permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((result) => {
          setLocationPermission(result.state)
          if (result.state === "prompt") {
            setShowLocationRequest(true)
          }
          result.onchange = () => {
            setLocationPermission(result.state)
            if (result.state !== "granted") {
              setShowLocationRequest(result.state === "prompt")
            } else {
              setShowLocationRequest(false)
            }
          }
        })
        .catch(() => {
          if (locationPermission !== "granted" && locationPermission !== "denied") {
            setShowLocationRequest(true)
          }
        })
    } else if (navigator.geolocation) {
      if (!locationPermission) {
        setShowLocationRequest(true)
      }
    }
  }, [isClient, locationPermission])

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission("granted")
          setShowLocationRequest(false)
        },
        (error) => {
          setLocationPermission("denied")
          setShowLocationRequest(false)
          console.error("Erro ao obter localização:", error.message)
        }
      )
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {isClient && showLocationRequest && locationPermission === "prompt" && (
        <div className="bg-blue-100 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-700 print:hidden">
          <div className="container mx-auto px-4 py-3">
            <Alert className="border-blue-200 dark:border-blue-700 bg-transparent">
              <Navigation className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="text-blue-800 dark:text-blue-300 text-sm">
                  Permita o acesso à sua localização para encontrar trilhas próximas a você.
                </span>
                <div className="flex gap-2 mt-2 sm:mt-0 flex-shrink-0">
                  <Button size="sm" onClick={requestLocation} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Permitir
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowLocationRequest(false)}>
                    Agora não
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      <section
        className="relative flex h-screen min-h-[600px] w-full flex-col items-center justify-center bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/home_bg06.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <h1 className="font-display text-4xl font-bold md:text-5xl lg:text-7xl">Descubra sua próxima aventura</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-200">
            Explore trilhas, parques nacionais e as paisagens mais incríveis do Brasil.
          </p>
          
          <div ref={searchContainerRef} className="relative w-full max-w-2xl">
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 flex w-full flex-col gap-2 sm:flex-row"
            >
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Busque por um parque, cidade ou trilha..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  autoComplete="off"
                  className="h-14 w-full rounded-full border-2 border-transparent bg-white/90 pl-12 text-base text-foreground placeholder:text-gray-500 focus:border-primary focus:bg-white"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-14 rounded-full bg-primary px-8 font-bold text-base hover:bg-primary/90"
              >
                Buscar
              </Button>
            </form>

            {showSuggestions && searchQuery.length > 1 && (
              <div className="absolute top-full mt-2 w-full bg-background rounded-xl shadow-lg border text-left overflow-hidden z-20">
                {isSuggestionsLoading ? (
                  <div className="p-4 flex items-center justify-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /></div>
                ) : suggestions.length > 0 ? (
                  <ul className="divide-y divide-border">
                    {suggestions.map(s => (
                      <li key={s.id}>
                        <Link href={s.link} className="flex items-center gap-4 p-3 hover:bg-muted/50" onClick={() => setShowSuggestions(false)}>
                          <div className="flex-shrink-0 bg-muted p-2 rounded-md">
                            {s.type === 'trilha' ? <Mountain className="h-5 w-5 text-muted-foreground" /> : <Globe className="h-5 w-5 text-muted-foreground" />}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{s.nome}</p>
                            <p className="text-sm text-muted-foreground">{s.location}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="p-4 text-center text-muted-foreground text-sm">Nenhum resultado encontrado.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {(!isClient || loadingAuth) ? (
              <div className="h-8 w-3/5 mx-auto bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : user ? (
              "Trilhas Recomendadas para Você"
            ) : (
              "Trilhas em Destaque"
            )}
          </h2>

          <div className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {(!isClient || loadingAuth) ? (
            <div className="space-y-2 mt-2">
              <div className="h-4 w-full mx-auto bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              <div className="h-4 w-2/3 mx-auto bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
            ) : user ? (
              <p>Baseado nas suas preferências, selecionamos essas trilhas especiais para sua próxima aventura.</p>
            ) : (
              <p>Descubra algumas das trilhas mais populares e bem avaliadas do Brasil.</p>
             )}
            </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {featuredTrails.map((trail) => (
            <TrailCard key={trail.id} trail={trail} />
          ))}

          <Link href="/rotas" aria-label="Criar ou ver suas rotas">
            <Card className="bg-card text-card-foreground rounded-xl shadow-md border border-dashed border-border transition hover:shadow-lg hover:border-primary h-full flex flex-col items-center justify-center group cursor-pointer">
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted group-hover:bg-primary/10 transition-colors mb-4">
                  <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-bold text-lg">Suas Rotas</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Planeje, grave e gerencie seus percursos.
                </p>
              </div>
            </Card>
          </Link>
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/trilhas">Ver Todas as Trilhas</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}