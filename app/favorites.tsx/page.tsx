"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AuthGuard from "@/components/auth-guard"
import Navbar from "@/components/navbar"
import { Heart, MapPin } from "lucide-react"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFavorites() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          // Aqui você faria uma consulta real para buscar os favoritos do usuário
          // Por enquanto, vamos usar dados de exemplo
          setFavorites([
            {
              id: 1,
              type: "parque",
              name: "Parque Nacional da Tijuca",
              location: "Rio de Janeiro, RJ",
              image: "/placeholder.svg?height=200&width=300",
            },
            {
              id: 2,
              type: "trilha",
              name: "Trilha Pico da Tijuca",
              location: "Parque Nacional da Tijuca",
              difficulty: "Moderada",
              image: "/placeholder.svg?height=200&width=300",
            },
          ])
        }
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [])

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="container mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="h-8 w-8 text-red-500" />
              Meus Favoritos
            </h1>
            <p className="text-gray-600">Seus parques e trilhas favoritos salvos</p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg" />
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => (
                <Card key={favorite.id} className="hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <img
                      src={favorite.image || "/placeholder.svg"}
                      alt={favorite.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {favorite.name}
                      <Heart className="h-5 w-5 text-red-500 fill-current" />
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {favorite.location}
                    </CardDescription>
                    {favorite.difficulty && (
                      <div className="text-sm text-gray-600">Dificuldade: {favorite.difficulty}</div>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum favorito ainda</h3>
                <p className="text-gray-600 mb-4">
                  Comece explorando parques e trilhas para adicionar aos seus favoritos
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
