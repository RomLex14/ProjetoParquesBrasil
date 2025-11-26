import Navbar from "@/components/navbar";
import { getTrilhas } from "@/lib/data-service";
import TrilhasListClient from "@/components/trail-list-client"; // Vamos criar
import { Mountain } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function TrilhasPage() {
  const trilhasData = await getTrilhas();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-6">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold flex items-center justify-center lg:justify-start gap-2">
              <Mountain className="h-8 w-8 text-primary" />
              Explorar Trilhas
            </h1>
            <p className="text-muted-foreground mt-1">
              Encontre o caminho perfeito para sua próxima aventura no cerrado.
            </p>
          </div>
        </div>

        {/* Passa dados para o cliente */}
        <TrilhasListClient initialTrails={trilhasData} />
      </main>
    </div>
  );
}