// app/dashboard/page.tsx

"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AuthGuard from "@/components/auth-guard"
import Navbar from "@/components/navbar"
import Link from "next/link"
import { Heart, Activity, MapPin, Settings, Loader2 } from "lucide-react"
import type { User } from "@supabase/supabase-js"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    favoritesCount: 0,
    reviewsCount: 0,
  })

  useEffect(() => {
    async function loadUserData() {
      setLoading(true)
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        setUser(currentUser)

        if (currentUser) {
          const [favorites, reviews] = await Promise.all([
            supabase
              .from('favoritos')
              .select('id', { count: 'exact', head: true })
              .eq('usuario_id', currentUser.id),
            supabase
              .from('avaliacoes')
              .select('id', { count: 'exact', head: true })
              .eq('usuario_id', currentUser.id)
          ]);

          if (favorites.error) throw favorites.error;
          if (reviews.error) throw reviews.error;
          
          setStats({
            favoritesCount: favorites.count || 0,
            reviewsCount: reviews.count || 0,
          })
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  const WelcomeMessage = () => {
    if (loading || !user) {
        return <div className="h-6 w-48 bg-muted rounded-md animate-pulse" />;
    }
    return <>Bem-vindo de volta, {user?.user_metadata?.nome_completo || user?.email}!</>
  }

  return (
    <AuthGuard requireAuth={true}>
       {/* <<< ALTERAÇÃO AQUI >>> */}
       {/* Trocamos 'bg-gray-50' por 'bg-background' */}
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="container mx-auto py-8 px-4">
          <div className="mb-8">
            {/* Trocamos 'text-gray-900' por 'text-foreground' e 'text-gray-600' por 'text-muted-foreground' */}
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground"><WelcomeMessage /></p>
          </div>

          {/* ... O resto do conteúdo do dashboard já usa componentes (Card) que se adaptam, então não precisa de mais mudanças ... */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{stats.favoritesCount}</div>}
                <p className="text-xs text-muted-foreground">Trilhas e parques salvos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trilhas Concluídas</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{stats.reviewsCount}</div>}
                <p className="text-xs text-muted-foreground">Baseado no número de avaliações</p>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-between">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Atividades Planejadas</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-muted-foreground">Funcionalidade em breve</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Meus Favoritos</CardTitle>
                <CardDescription>Veja seus parques e trilhas salvos</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/favorites">Ver Favoritos</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg text-muted-foreground">Minhas Atividades</CardTitle>
                <CardDescription>Acompanhe suas trilhas e avaliações</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" disabled>
                  Funcionalidade em breve
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Explorar Parques</CardTitle>
                <CardDescription>Descubra novos parques para visitar</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/parques">Explorar</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Configurações</CardTitle>
                <CardDescription>Gerencie seu perfil e preferências</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/profile/edit">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurar
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}