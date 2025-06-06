import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Star, Users, Mountain } from "lucide-react";
import Navbar from "@/components/navbar";
import { parques } from "@/lib/data"; // <<< DADOS VÊM DAQUI AGORA

function ParqueCard({ parque }: { parque: (typeof parques)[0] }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <Link href={`/parques/${parque.id}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={parque.imagem || "/placeholder.svg"}
            alt={parque.nome}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {parque.destaque && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-amber-500 text-white border-amber-600">Destaque</Badge>
            </div>
          )}
          <div className="absolute top-2 right-2 flex items-center bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
            <span>{parque.rating.toFixed(1)}</span>
          </div>
        </div>
      </Link>
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="space-y-2 flex-grow">
          <h3 className="font-bold text-lg line-clamp-1">{parque.nome}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span>{parque.localizacao}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{parque.descricao}</p>
        </div>
        <div className="border-t pt-3 mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <Mountain className="h-4 w-4 mr-1.5 text-muted-foreground" />
            <span>{parque.trilhas} trilhas</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1.5 text-muted-foreground" />
            <span>{parque.visitantes}</span>
          </div>
        </div>
        <Button asChild className="w-full mt-4">
          <Link href={`/parques/${parque.id}`}>Explorar Parque</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ParquesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Parques <span className="text-green-600 dark:text-green-400">Nacionais</span> do Brasil
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Descubra a diversidade e beleza dos parques nacionais brasileiros. Cada um oferece experiências únicas e paisagens inesquecíveis.
          </p>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar parques..." className="pl-10" />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Nossos Parques</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {parques.map((parque) => (
              <ParqueCard key={parque.id} parque={parque} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}