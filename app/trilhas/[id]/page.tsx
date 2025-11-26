import { getTrilhaById } from "@/lib/data-service";
import { notFound } from "next/navigation";
import TrilhaDetalhesClient from "@/components/trail-details-client";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Next.js 15: params é Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TrailDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const trail = await getTrilhaById(id);

  if (!trail) {
     return (
       <div className="h-screen flex flex-col items-center justify-center gap-4">
         <h2 className="text-2xl font-bold">Trilha não encontrada</h2>
         <p className="text-muted-foreground">O ID solicitado não existe no banco de dados.</p>
         <Link href="/trilhas"><Button>Voltar para Trilhas</Button></Link>
       </div>
     );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pb-10">
        <TrilhaDetalhesClient trail={trail} />
      </main>
    </div>
  );
}