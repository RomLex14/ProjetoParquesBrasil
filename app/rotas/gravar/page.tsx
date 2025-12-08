"use client"

import Link from "next/link";
import { ArrowLeft, Construction, Map } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GravarRotaPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header Simplificado */}
      <header className="bg-background border-b z-10">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/rotas">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-semibold">Gravar Trilha</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo "Em Breve" */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/10">
        <Card className="w-full max-w-md border-none shadow-lg bg-card">
          <CardContent className="flex flex-col items-center text-center p-8 pt-10 gap-6">
            
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="relative h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Construction className="h-10 w-10 text-primary" />
              </div>
              <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-background flex items-center justify-center border shadow-sm">
                 <Map className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Em Desenvolvimento</h2>
              <p className="text-muted-foreground">
                Estamos trabalhando em novas features para você, aguarde futuras atualizações.
              </p>
            </div>

            <div className="flex flex-col w-full gap-3">
              <Button asChild size="lg" className="w-full">
                <Link href="/rotas/criar">
                  Tentar o Planejador Manual
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/rotas">
                  Voltar para Minhas Rotas
                </Link>
              </Button>
            </div>

          </CardContent>
        </Card>
      </main>
    </div>
  );
}