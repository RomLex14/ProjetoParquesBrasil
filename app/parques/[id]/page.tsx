// app/parques/[id]/page.tsx

"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Parque, Trilhas } from '@/lib/types';
import { ArrowLeft, Loader2, MapPin, Star } from 'lucide-react';
import Navbar from '@/components/navbar';
import WeatherForecast from '@/components/weather-forecast';
import TrailCard from '@/components/trail-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import LeafletMap from '@/components/leaflet-map';

const adaptTrilhaData = (data: any): Trilhas => ({
    id: data.id,
    name: data.nome,
    location: data.parques?.localizacao || data.location || 'Localização não informada',
    description: data.descricao,
    imageUrl: data.url_imagem,
    difficulty: data.dificuldade,
    distance: data.distancia,
    duration: `${data.duracao}h`,
    elevation: data.ganho_elevacao || 0,
    rating: data.avaliacao_media || 0,
    reviews: [],
    parque_id: data.parque_id,
    coordinates: data.coordinates,
    path: data.path,
});

export default function ParqueDetailPage() {
  const params = useParams();
  const parqueId = typeof params.id === 'string' ? params.id : undefined;

  const [parque, setParque] = useState<Parque | null>(null);
  const [trilhasDoParque, setTrilhasDoParque] = useState<Trilhas[]>([]);
  const [loading, setLoading] = useState(true);

  const sobreParqueNacionalBrasilia = `
O Parque Nacional de Brasília, conhecido como "Água Mineral", é uma unidade de conservação essencial para a capital. Criado em 1961, protege ecossistemas do Cerrado e os mananciais que abastecem parte do DF.

O parque é um refúgio para a fauna e flora nativas e oferece aos visitantes famosas piscinas de águas minerais, além de duas trilhas ecológicas bem demarcadas, sendo um local perfeito para lazer e contato com a natureza do Cerrado.
  `.trim();

  useEffect(() => {
    const fetchParqueData = async () => {
      if (!parqueId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [parqueResponse, trilhasResponse] = await Promise.all([
          supabase.from('parques').select('*').eq('id', parqueId).single(),
          supabase.from('trilhas').select('*, parques(localizacao)').eq('parque_id', parqueId)
        ]);
        
        const { data: parqueData, error: parqueError } = parqueResponse;
        if (parqueError) throw parqueError;
        setParque(parqueData as Parque);

        const { data: trilhasData, error: trilhasError } = trilhasResponse;
        if (trilhasError) throw trilhasError;

        const adaptedTrilhas = trilhasData.map(adaptTrilhaData);
        setTrilhasDoParque(adaptedTrilhas);

      } catch (error) {
        console.error("Erro ao buscar dados do parque:", error);
        setParque(null);
      } finally {
        setLoading(false);
      }
    };

    fetchParqueData();
  }, [parqueId]);

  if (loading) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 flex justify-center items-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        </div>
    );
  }

  if (!parque) {
    return (
      <>
        <Navbar />
        <div className="container text-center py-10">
          <h1 className="text-2xl font-bold">Parque não encontrado</h1>
          <Link href="/parques">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Parques
            </Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="container mx-auto py-6 sm:py-8 px-4">
        <div className="mb-6">
          <Link href="/parques" className="inline-flex items-center text-sm text-primary hover:underline font-medium">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para Todos os Parques
          </Link>
        </div>

        <section className="mb-8">
          <div className="relative w-full h-[40vh] min-h-[300px] md:h-[60vh] max-h-[550px] rounded-lg overflow-hidden shadow-xl group">
            <img 
              src={parque.nome === "Parque Nacional de Brasília" ? "/images/parques/parquenacional.jpg" : (parque.imagem || '/placeholder.svg')} 
              alt={`Paisagem do ${parque.nome}`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6 md:p-8 flex flex-col justify-end">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2 shadow-text leading-tight">{parque.nome}</h1>
              <div className="flex items-center text-gray-200 text-sm sm:text-base">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                <span className="truncate">{parque.localizacao}</span>
              </div>
            </div>
          </div>
        </section>
        
        <section className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <div className="md:col-span-2 space-y-6 lg:space-y-8">
            <Card>
              <CardHeader><CardTitle className="text-2xl font-semibold">Sobre o Parque</CardTitle></CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {parque.nome === "Parque Nacional de Brasília" ? sobreParqueNacionalBrasilia : parque.descricao}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-xl font-semibold">Trilhas em {parque.nome}</CardTitle></CardHeader>
              <CardContent>
                {trilhasDoParque.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {trilhasDoParque.map(trilha => (
                      <TrailCard key={trilha.id} trail={trilha} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">Nenhuma trilha encontrada para este parque.</p>
                )}
              </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="text-xl font-semibold">Previsão do Tempo</CardTitle><CardDescription>Para {parque.localizacao.split(",")[0]}</CardDescription></CardHeader>
                <CardContent><WeatherForecast location={parque.localizacao.split(",")[0]} /></CardContent>
            </Card>
          </div>

          <div className="space-y-6 md:sticky md:top-24 self-start">
             <Card>
              <CardHeader><CardTitle className="text-xl font-semibold">Detalhes</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-x-4 gap-y-5 text-sm">
                <div><p className="text-muted-foreground text-xs uppercase tracking-wider">Estado</p><p className="font-semibold text-base mt-0.5">{parque.estado}</p></div>
                <div><p className="text-muted-foreground text-xs uppercase tracking-wider">Área</p><p className="font-semibold text-base mt-0.5">{parque.area}</p></div>
                <div><p className="text-muted-foreground text-xs uppercase tracking-wider">Visitantes (aprox.)</p><p className="font-semibold text-base mt-0.5">{parque.visitantes}</p></div>
                {parque.rating && <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider">Avaliação</p>
                  <div className="flex items-center font-semibold text-base mt-0.5">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />{parque.rating.toFixed(1)}
                  </div>
                </div>}
              </CardContent>
            </Card>
            <Card className="overflow-hidden shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Mapa do Parque</CardTitle>
                <CardDescription>Visualize o parque e suas trilhas.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <AspectRatio ratio={4/3} className="bg-muted dark:bg-slate-800 border-t dark:border-slate-700">
                  <LeafletMap trailsToDisplay={trilhasDoParque} />
                </AspectRatio>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}