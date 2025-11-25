// app/profile/page.tsx
"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, MapPin, Calendar, Settings, LogOut, 
  Heart, Award, TrendingUp, Edit2, Share2 
} from "lucide-react";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

// Tipos (poderiam estar em lib/types.ts)
type UserProfile = {
  id: string;
  name: string;
  email: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
  joined_at: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }

      // Aqui você buscaria dados extras do perfil no banco
      // Por enquanto, usamos dados da sessão e mock
      setUser({
        id: session.user.id,
        name: session.user.user_metadata.full_name || "Aventureiro",
        email: session.user.email || "",
        location: "Brasília, DF",
        bio: "Amante da natureza e explorador de trilhas nos fins de semana.",
        avatar_url: session.user.user_metadata.avatar_url,
        joined_at: new Date(session.user.created_at).toLocaleDateString('pt-BR'),
      });
      setLoading(false);
    };

    getUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Carregando perfil...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Coluna Esquerda: Cartão do Perfil */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-md overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-primary/80 to-primary"></div>
              <CardContent className="relative pt-0 pb-6 px-6 text-center">
                <div className="relative -mt-16 mb-4 inline-block">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                    <AvatarImage src={user?.avatar_url} alt={user?.name} />
                    <AvatarFallback className="text-4xl bg-muted">{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Link href="/profile/edit">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="absolute bottom-0 right-0 rounded-full shadow-md h-8 w-8"
                      title="Editar Foto"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                
                <h1 className="text-2xl font-bold mb-1">{user?.name}</h1>
                <p className="text-muted-foreground text-sm mb-4 flex items-center justify-center gap-1">
                  <MapPin className="h-3 w-3" /> {user?.location}
                </p>
                
                <p className="text-sm text-muted-foreground mb-6 px-4">
                  "{user?.bio}"
                </p>

                <div className="flex gap-2 justify-center">
                  {/* BOTÃO DE CONFIGURAÇÃO (NOVO) */}
                  <Link href="/profile/edit" className="w-full">
                    <Button variant="outline" className="w-full gap-2">
                      <Settings className="h-4 w-4" />
                      Configurar
                    </Button>
                  </Link>
                  
                  <Button variant="ghost" size="icon" className="text-muted-foreground" title="Compartilhar Perfil">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas Rápidas */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-xs text-muted-foreground font-medium uppercase">Trilhas</div>
                </div>
                <div className="border-l border-r border-border/50">
                  <div className="text-2xl font-bold text-primary">45km</div>
                  <div className="text-xs text-muted-foreground font-medium uppercase">Percorridos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">5</div>
                  <div className="text-xs text-muted-foreground font-medium uppercase">Conquistas</div>
                </div>
              </CardContent>
            </Card>

            {/* Botão de Sair */}
            <Button 
              variant="ghost" 
              className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sair da Conta
            </Button>
          </div>

          {/* Coluna Direita: Abas de Conteúdo */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="w-full justify-start h-12 bg-background p-1 border-b rounded-none">
                <TabsTrigger value="history" className="data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-md h-10 px-6">
                  <TrendingUp className="h-4 w-4 mr-2" /> Histórico
                </TabsTrigger>
                <TabsTrigger value="favorites" className="data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-md h-10 px-6">
                  <Heart className="h-4 w-4 mr-2" /> Favoritos
                </TabsTrigger>
                <TabsTrigger value="achievements" className="data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-md h-10 px-6">
                  <Award className="h-4 w-4 mr-2" /> Conquistas
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 space-y-6">
                <TabsContent value="history" className="mt-0">
                  <h3 className="text-lg font-semibold mb-4">Atividades Recentes</h3>
                  {/* Lista de Atividades (Mock) */}
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row">
                          <div className="h-32 sm:w-48 bg-muted relative">
                            {/* Placeholder de mapa ou foto */}
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-slate-200 dark:bg-slate-800">
                              <MapPin className="h-8 w-8 opacity-20" />
                            </div>
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-center">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-base">Trilha da Cachoeira do Tororó</h4>
                                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                  <Calendar className="h-3 w-3" /> 12 de Nov, 2024
                                </div>
                              </div>
                              <Badge variant="secondary">3.5 km</Badge>
                            </div>
                            <div className="flex gap-4 text-sm mt-2">
                              <div>
                                <span className="text-muted-foreground text-xs block">Tempo</span>
                                <span className="font-medium">1h 45m</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground text-xs block">Elevação</span>
                                <span className="font-medium">120m</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground text-xs block">Ritmo</span>
                                <span className="font-medium">12'30"/km</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="favorites">
                  <div className="text-center py-12 text-muted-foreground">
                    <Heart className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>Você ainda não favoritou nenhuma trilha.</p>
                    <Button variant="link" asChild className="mt-2">
                      <Link href="/map">Explorar trilhas</Link>
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="achievements">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Card key={i} className="text-center p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                        <div className="h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center mx-auto mb-3 text-yellow-600 dark:text-yellow-500">
                          <Award className="h-8 w-8" />
                        </div>
                        <h4 className="font-bold text-sm">Explorador Iniciante</h4>
                        <p className="text-xs text-muted-foreground mt-1">Completou 5 trilhas</p>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}