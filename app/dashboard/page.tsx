"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AuthGuard from "@/components/auth-guard"
import Navbar from "@/components/navbar"
import Link from "next/link"
import { Heart, Activity, MapPin, Settings } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    favoriteParks: 0,
    completedTrails: 0,
    plannedActivities: 0,
  })

  useEffect(() => {
    async function loadUserData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          // Carregar estatísticas do usuário
          // Aqui você pode fazer consultas para obter dados reais do banco
          setStats({
            favoriteParks: 5,
            completedTrails: 12,
            plannedActivities: 3,
          })
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error)
      }
    }

    loadUserData()
  }, [])

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="container mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Bem-vindo de volta, {user?.user_metadata?.nome_completo || user?.email}!</p>
          </div>

          {/* Estatísticas */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Parques Favoritos</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.favoriteParks}</div>
                <p className="text-xs text-muted-foreground">Parques salvos como favoritos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trilhas Concluídas</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedTrails}</div>
                <p className="text-xs text-muted-foreground">Trilhas que você completou</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Atividades Planejadas</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.plannedActivities}</div>
                <p className="text-xs text-muted-foreground">Próximas aventuras planejadas</p>
              </CardContent>
            </Card>
          </div>

          {/* Ações Rápidas */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Meus Favoritos</CardTitle>
                <CardDescription>Veja seus parques e trilhas favoritos</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/favorites">Ver Favoritos</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Minhas Atividades</CardTitle>
                <CardDescription>Acompanhe suas trilhas e atividades</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/my-activities">Ver Atividades</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
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

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Configurações</CardTitle>
                <CardDescription>Gerencie seu perfil e preferências</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurar
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
