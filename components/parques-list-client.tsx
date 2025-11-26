"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Parque } from "@/lib/types";

export default function ParquesListClient({ initialParques }: { initialParques: Parque[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredParques = initialParques.filter((parque) =>
    parque.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parque.localizacao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="relative w-full md:w-72 mb-6 md:absolute md:top-28 md:right-8 lg:right-32 z-10">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar parque..."
          className="pl-9 bg-card"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParques.map((parque) => (
          <Link href={`/parques/${parque.id}`} key={parque.id}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden group">
              <div className="relative h-48 w-full">
                <Image
                  src={parque.imagem || "/placeholder.jpg"}
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
                  {/* Removido contador estático de trilhas por enquanto, ou usar dado real se tiver */}
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
    </>
  );
}