// app/search/page.tsx

"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Parque, Trilhas as TrilhaType } from '@/lib/types'
import Navbar from '@/components/navbar'
import TrailCard from '@/components/trail-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Loader2, Search, Frown, MapPin } from 'lucide-react'

// Componente de Card para Parques
function ParqueCard({ parque }: { parque: Parque }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full bg-card text-card-foreground rounded-xl border">
      <Link href={`/parques/${parque.id}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={parque.imagem || "/images/parques/chapada.jpg"}
            alt={parque.nome}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      <CardHeader className="p-4">
        <Link href={`/parques/${parque.id}`} className="block">
          <h3 className="font-bold text-lg line-clamp-1 hover:text-primary transition-colors">{parque.nome}</h3>
        </Link>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{parque.localizacao}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">{parque.descricao}</p>
      </CardContent>
    </Card>
  );
}

// Função para adaptar os dados do Supabase para o formato que o TrailCard espera
const adaptSupabaseTrilhaToCard = (data: any): TrilhaType => ({
    id: data.id,
    name: data.nome,
    location: data.location || 'Localização não informada',
    description: data.descricao,
    imageUrl: data.url_imagem,
    difficulty: data.dificuldade,
    distance: data.distancia,
    duration: `${data.duracao}h`,
    elevation: data.ganho_elevacao || 0,
    rating: data.avaliacao_media || 0,
    reviews: [],
    parque_id: data.parque_id,
});


function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<(Parque | TrilhaType)[]>([])
  const [suggestedTrails, setSuggestedTrails] = useState<TrilhaType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const performSearch = async () => {
      if (!query) {
        setResults([])
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        // <<< CORREÇÃO PRINCIPAL AQUI >>>
        // Trocamos .ilike('name', ...) por .ilike('nome', ...) para corresponder ao banco de dados
        const [trilhasResponse, parquesResponse] = await Promise.all([
          supabase.from('trilhas').select('*').ilike('nome', `%${query}%`),
          supabase.from('parques').select('*').ilike('nome', `%${query}%`)
        ]);

        if (trilhasResponse.error) throw trilhasResponse.error;
        if (parquesResponse.error) throw parquesResponse.error;

        const trilhas = trilhasResponse.data.map(t => ({ ...adaptSupabaseTrilhaToCard(t), type: 'trilha' }));
        const parques = parquesResponse.data.map(p => ({ ...p, type: 'parque' }));

        const allResults = [...trilhas, ...parques];
        setResults(allResults);

        // Busca por sugestões
        const resultIds = allResults.map(r => r.id);
        const { data: suggestionsData, error: suggestionsError } = await supabase
          .from('trilhas')
          .select('*')
          .not('id', 'in', `(${resultIds.join(',') || "''"})`) // Adicionado fallback para array vazio
          .limit(3);

        if (suggestionsError) throw suggestionsError;
        setSuggestedTrails(suggestionsData.map(adaptSupabaseTrilhaToCard));

      } catch (error: any) {
        console.error("Erro ao buscar:", error.message)
        setResults([])
        setSuggestedTrails([])
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [query])

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Resultados da Busca</h1>
        <p className="text-muted-foreground mb-6">
          Exibindo resultados para: <span className="font-semibold text-foreground">"{query}"</span>
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item: any) => {
              if (item.type === 'trilha') {
                return <TrailCard key={`trilha-${item.id}`} trail={item} />;
              } else {
                return <ParqueCard key={`parque-${item.id}`} parque={item} />;
              }
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/50 rounded-lg">
            <Frown className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">Nenhum resultado encontrado</h2>
            <p className="text-muted-foreground mt-2">Tente buscar por outros termos.</p>
          </div>
        )}

        {!loading && suggestedTrails.length > 0 && (
            <div className="mt-16">
                <Separator className="my-8" />
                <h2 className="text-2xl font-bold mb-6">Explore Outras Trilhas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {suggestedTrails.map((trail) => (
                        <TrailCard key={`suggested-${trail.id}`} trail={trail} />
                    ))}
                </div>
            </div>
        )}
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin"/></div>}>
        <SearchResults />
      </Suspense>
    </div>
  )
}