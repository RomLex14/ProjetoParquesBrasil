// app/rotas/page.tsx

"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AuthGuard from "@/components/auth-guard";
import Navbar from "@/components/navbar";
import { Route, Loader2, PlusCircle, ArrowRight, Radio } from "lucide-react"; // Ícone Radio adicionado
import type { User } from "@supabase/supabase-js";

interface RotaUsuario {
  id: string;
  nome: string;
  descricao?: string;
  criado_em: string;
}

function RotaCard({ rota }: { rota: RotaUsuario }) {
  const dataFormatada = new Date(rota.criado_em).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{rota.nome}</CardTitle>
        <CardDescription>Criada em {dataFormatada}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {rota.descricao || "Nenhuma descrição fornecida."}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/rotas/${rota.id}`}> 
            Ver Rota <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}


export default function MinhasRotasPage() {
  const [rotas, setRotas] = useState<RotaUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUserRotas() {
      setLoading(true);
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      if (currentUser) {
        try {
          const { data, error } = await supabase
            .from('rotas_usuario')
            .select('id, nome, descricao, criado_em')
            .eq('usuario_id', currentUser.id)
            .order('criado_em', { ascending: false });

          if (error) throw error;
          setRotas(data || []);
        } catch (error) {
          console.error("Erro ao carregar rotas do usuário:", error);
          setRotas([]);
        }
      }
      setLoading(false);
    }

    loadUserRotas();
  }, []);

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Route className="h-8 w-8 text-primary" />
                Minhas Rotas
              </h1>
              <p className="text-muted-foreground">Gerencie seus percursos planejados ou gravados.</p>
            </div>
            <div className="flex gap-2">
                <Button asChild variant="outline">
                    <Link href="/rotas/criar">
                        <PlusCircle className="mr-2 h-4 w-4" /> Planejar Rota
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/rotas/gravar">
                        <Radio className="mr-2 h-4 w-4" /> Gravar Rota
                    </Link>
                </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : rotas.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rotas.map((rota) => (
                <RotaCard key={rota.id} rota={rota} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-16">
              <CardContent>
                <Route className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">Você ainda não tem rotas</h3>
                <p className="text-muted-foreground mb-6">
                  Planeje um percurso manualmente ou grave sua próxima atividade.
                </p>
                <div className="flex justify-center gap-4">
                    <Button asChild>
                        <Link href="/rotas/gravar">Gravar minha primeira rota</Link>
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href="/rotas/criar">Planejar uma rota</Link>
                    </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}