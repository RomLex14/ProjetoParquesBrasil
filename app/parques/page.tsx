import Navbar from "@/components/navbar";
import { getParques } from "@/lib/data-service";
import ParquesListClient from "@/components/parques-list-client";
import { Trees } from "lucide-react";

export const dynamic = 'force-dynamic'; // Garante dados frescos

export default async function ParquesPage() {
  const parquesData = await getParques();

  return (
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
          {/* A barra de busca fica dentro do componente cliente agora */}
        </div>

        {/* Passamos os dados iniciais para o componente cliente */}
        <ParquesListClient initialParques={parquesData} />
      </main>
    </div>
  );
}