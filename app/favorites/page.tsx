// app/favorites/page.tsx (com debug)

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AuthGuard from "@/components/auth-guard"
import Navbar from "@/components/navbar"
import TrailCard from "@/components/trail-card"
import { Heart, Loader2 } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import type { Trilhas as TrilhaType } from "@/lib/types"

const adaptSupabaseTrilhaToCard = (supabaseTrilha: any): TrilhaType => {
  return {
    id: supabaseTrilha.id,
    name: supabaseTrilha.nome,
    location: supabaseTrilha.parques?.localizacao || 'Localização não informada',
    description: supabaseTrilha.descricao || '',
    imageUrl: supabaseTrilha.url_imagem, // Mapeando url_imagem -> imageUrl
    difficulty: supabaseTrilha.dificuldade,
    distance: supabaseTrilha.distancia,
    duration: `${supabaseTrilha.duracao}h`,
    elevation: supabaseTrilha.elevacao || 0,
    rating: supabaseTrilha.avaliacao_media || 0,
    reviews: [],
    parque_id: supabaseTrilha.parque_id,
  };
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<TrilhaType[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    async function loadFavorites() {
      setLoading(true);
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      if (currentUser) {
        try {
          const { data: favoriteIds, error: favError } = await supabase
            .from('favoritos')
            .select('trilha_id')
            .eq('usuario_id', currentUser.id);

          if (favError) throw favError;

          const trilhaIds = favoriteIds.map(f => f.trilha_id).filter(Boolean);
          
          if (trilhaIds.length > 0) {
            const { data: trilhasData, error: trilhasError } = await supabase
              .from('trilhas')
              .select(`*, parques ( localizacao )`)
              .in('id', trilhaIds);
            
            if (trilhasError) throw trilhasError;

            // <<< ADICIONADO PARA DEBUG >>>
            console.log("Dados recebidos do Supabase:", trilhasData);

            const adaptedTrilhas = trilhasData.map(adaptSupabaseTrilhaToCard);
            setFavorites(adaptedTrilhas);
          } else {
            setFavorites([]);
          }
        } catch (error) {
          console.error("Erro ao carregar favoritos:", error);
          setFavorites([]);
        }
      }
      setLoading(false);
    }

    loadFavorites();
  }, []);

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Heart className="h-8 w-8 text-red-500" />
              Meus Favoritos
            </h1>
            <p className="text-muted-foreground">Suas trilhas salvas para futuras aventuras.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((trilha) => (
                <TrailCard key={trilha.id} trail={trilha} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-16">
              <CardContent>
                <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">Sua lista de favoritos está vazia</h3>
                <p className="text-muted-foreground mb-6">
                  Explore as trilhas e clique no ícone de coração para salvá-las aqui.
                </p>
                <Button asChild>
                  <Link href="/trilhas">Explorar Trilhas</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}