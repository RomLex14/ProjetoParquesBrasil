// app/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AuthGuard from "@/components/auth-guard"
import Navbar from "@/components/navbar"
import Link from "next/link"
import { Heart, Activity, Settings, Loader2, Route } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { Perfil } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import LevelBadge from "@/components/level-badge";
import {
  getXpForLevel,
  getXpForNextLevel,
  calculateProgressPercentage,
  MAX_LEVEL
} from "@/lib/gamification";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    favoritesCount: 0,
    reviewsCount: 0,
    routesCount: 0,
  })

  useEffect(() => {
    async function loadUserData() {
      setLoading(true)
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        setUser(currentUser)

        if (currentUser) {
          const [profileRes, favorites, reviews, routes] = await Promise.all([
             supabase.from('perfis').select('*').eq('id', currentUser.id).single<Perfil>(),
            supabase.from('favoritos').select('id', { count: 'exact', head: true }).eq('usuario_id', currentUser.id),
            supabase.from('avaliacoes').select('id', { count: 'exact', head: true }).eq('usuario_id', currentUser.id),
            supabase.from('rotas_usuario').select('id', { count: 'exact', head: true }).eq('usuario_id', currentUser.id),
          ]);

          if (profileRes.error && profileRes.error.code !== 'PGRST116') throw profileRes.error;
          if (favorites.error) throw favorites.error;
          if (reviews.error) throw reviews.error;
          if (routes.error) throw routes.error;

          setUserProfile(profileRes.data);
          setStats({
            favoritesCount: favorites.count || 0,
            reviewsCount: reviews.count || 0,
            routesCount: routes.count || 0,
          })
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error)
        setUserProfile(null);
        setStats({ favoritesCount: 0, reviewsCount: 0, routesCount: 0 });
      } finally {
        setLoading(false)
      }
    }
    loadUserData()
  }, [])

  const WelcomeMessage = () => {
    if (loading || !user) {
        return <Skeleton className="h-6 w-48" />;
    }
    const displayName = userProfile?.nome_completo || user?.user_metadata?.nome_completo || user?.email?.split('@')[0] || 'Explorador(a)';
    return <>Bem-vindo de volta, {displayName}!</>
  }

  const currentLevel = userProfile?.nivel ?? 1;
  const currentXp = userProfile?.xp ?? 0;
  const xpForCurrentLevel = getXpForLevel(currentLevel);
  const xpForNext = getXpForNextLevel(currentLevel);
  const progressPercentage = calculateProgressPercentage(currentXp, currentLevel);
  const xpToNextLevelText = currentLevel < MAX_LEVEL ? `${xpForNext} XP` : "Máx";

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <div className="text-muted-foreground"><WelcomeMessage /></div>
          </div>

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
                <CardTitle className="text-sm font-medium">Avaliações Feitas</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{stats.reviewsCount}</div>}
                <p className="text-xs text-muted-foreground">Suas contribuições</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rotas Criadas</CardTitle>
                <Route className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{stats.routesCount}</div>}
                <p className="text-xs text-muted-foreground">Planejadas ou gravadas</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
             <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    Progresso de Explorador
                    {loading ? <Skeleton className="h-5 w-5 rounded-full"/> : <LevelBadge level={currentLevel} size="md"/>}
                </CardTitle>
                <CardDescription>
                    {loading ? <Skeleton className="h-4 w-3/4"/> : `Nível ${currentLevel} - Continue criando rotas para subir de nível!`}
                </CardDescription>
             </CardHeader>
             <CardContent>
                {loading ? (
                    <Skeleton className="h-3 w-full rounded-full" />
                ) : (
                    <>
                        <Progress value={progressPercentage} aria-label={`${progressPercentage.toFixed(0)}% para o próximo nível`} className="w-full h-2.5 mb-1" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                            <span>{xpForCurrentLevel.toFixed(1)} XP</span>
                            <span className="font-medium text-foreground">{currentXp.toFixed(1)} / {xpToNextLevelText}</span>
                        </div>
                    </>
                )}
             </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader><CardTitle className="text-lg">Meus Favoritos</CardTitle><CardDescription>Veja seus itens salvos</CardDescription></CardHeader>
                <CardContent><Button asChild className="w-full"><Link href="/favorites">Ver Favoritos</Link></Button></CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader><CardTitle className="text-lg">Minhas Rotas</CardTitle><CardDescription>Acesse suas rotas</CardDescription></CardHeader>
                <CardContent><Button asChild className="w-full"><Link href="/rotas">Ver Minhas Rotas</Link></Button></CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader><CardTitle className="text-lg">Explorar Trilhas</CardTitle><CardDescription>Descubra novas trilhas</CardDescription></CardHeader>
                <CardContent><Button asChild className="w-full" variant="outline"><Link href="/trilhas">Explorar</Link></Button></CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader><CardTitle className="text-lg">Configurações</CardTitle><CardDescription>Gerencie seu perfil</CardDescription></CardHeader>
                <CardContent><Button asChild className="w-full" variant="outline"><Link href="/profile/edit"><Settings className="mr-2 h-4 w-4" />Configurar</Link></Button></CardContent>
              </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}