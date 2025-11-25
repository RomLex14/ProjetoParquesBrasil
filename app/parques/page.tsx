"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Search, Trees } from "lucide-react";

import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { parques } from "@/lib/data"; // Importa a lista atualizada

export default function ParquesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredParques = parques.filter((parque) =>
    parque.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parque.localizacao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // ✅ Fundo padrão do site (bg-background)
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Trees className="h-8 w-8 text-primary" />
              Parques Nacionais e Reservas
            </h1>
            <p className="text-muted-foreground mt-1">
              Explore as áreas de preservação mais incríveis da região.
            </p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar parque..."
              className="pl-9 bg-card"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParques.map((parque) => (
            <Link href={`/parques/${parque.id}`} key={parque.id}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden group">
                <div className="relative h-48 w-full">
                  <Image
                    src={parque.imagem}
                    alt={parque.nome}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <Badge variant="secondary" className="mb-1 bg-primary/90 text-white hover:bg-primary border-none">
                      {parque.estado}
                    </Badge>
                    <h3 className="font-bold text-lg leading-tight">{parque.nome}</h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-primary" />
                      {parque.localizacao}
                    </div>
                    <div className="text-xs font-medium bg-muted px-2 py-1 rounded-full">
                      {parque.trilhas} trilhas
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {parque.descricao}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredParques.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Nenhum parque encontrado.</p>
          </div>
        )}
      </main>
    </div>
  );
}