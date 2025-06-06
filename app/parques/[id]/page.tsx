"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Star, Users, Mountain } from 'lucide-react';
import Navbar from '@/components/navbar';
import WeatherForecast from '@/components/weather-forecast';
import TrailCard from '@/components/trail-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';
import { getParkById, getTrailsByParkId } from '@/lib/data';
import type { Trilhas } from '@/lib/types';

type Parque = ReturnType<typeof getParkById>;

function LoadingParqueDetalhe() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="container mx-auto py-6 sm:py-8 px-4">
        <div className="mb-6">
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="relative w-full h-[50vh] rounded-lg mb-8" />
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-72 w-full rounded-lg" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ParqueDetailPage() {
  const params = useParams();
  const parqueId = typeof params.id === 'string' ? params.id : undefined;

  const [parque, setParque] = useState<Parque>(undefined);
  const [trilhasDoParque, setTrilhasDoParque] = useState<Trilhas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (parqueId) {
      setLoading(true);
      const parqueEncontrado = getParkById(parqueId);
      setParque(parqueEncontrado);

      if (parqueEncontrado) {
        const trilhasAssociadas = getTrailsByParkId(parqueEncontrado.uuid);
        setTrilhasDoParque(trilhasAssociadas);
      }
      setTimeout(() => setLoading(false), 300);
    }
  }, [parqueId]);

  if (loading) {
    return <LoadingParqueDetalhe />;
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
              src={parque.imagem || '/placeholder.svg'} 
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
              <CardContent><p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{parque.descricao}</p></CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-xl font-semibold">Detalhes</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-x-4 gap-y-5 text-sm">
                <div><p className="text-muted-foreground text-xs uppercase tracking-wider">Estado</p><p className="font-semibold text-base mt-0.5">{parque.estado}</p></div>
                <div><p className="text-muted-foreground text-xs uppercase tracking-wider">Área</p><p className="font-semibold text-base mt-0.5">{parque.area}</p></div>
                <div><p className="text-muted-foreground text-xs uppercase tracking-wider">Visitantes (aprox.)</p><p className="font-semibold text-base mt-0.5">{parque.visitantes}</p></div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider">Avaliação Média</p>
                  <div className="flex items-center font-semibold text-base mt-0.5">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />{parque.rating.toFixed(1)}
                  </div>
                </div>
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
                  <p className="text-muted-foreground text-center py-4">Nenhuma trilha encontrada para este parque em nossos dados atuais.</p>
                )}
              </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="text-xl font-semibold">Previsão do Tempo</CardTitle><CardDescription>Para {parque.localizacao.split(",")[0]}</CardDescription></CardHeader>
                <CardContent><WeatherForecast location={parque.localizacao.split(",")[0]} /></CardContent>
            </Card>
          </div>

          <div className="space-y-6 md:sticky md:top-24 self-start">
            <Card className="overflow-hidden shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Mapa do Parque</CardTitle>
                <CardDescription>Visualize o parque e suas trilhas.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <AspectRatio ratio={4/3} className="bg-muted dark:bg-slate-800 border-t dark:border-slate-700">
                  <p className="p-4 text-center flex items-center justify-center h-full text-muted-foreground">Mapa do parque em breve.</p>
                </AspectRatio>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}