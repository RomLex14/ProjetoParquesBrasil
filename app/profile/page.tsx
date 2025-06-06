"use client"

import { useEffect, useState } from "react"; // Importar useEffect e useState
import Link from "next/link";
import { supabase } from "@/lib/supabase"; // Importar supabase
import type { User } from "@supabase/supabase-js"; // Importar tipo User
import { Mail } from "lucide-react";
import { Mountain, MapPin, Calendar, Edit3, Loader2 } from "lucide-react";
import Navbar from "@/components/navbar"; // Supondo que você tenha um Navbar
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle,CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import AuthGuard from "@/components/auth-guard"; // Para proteger a rota

// Você pode querer mover este tipo para lib/types.ts ou lib/supabase.ts
interface PerfilData {
  nome_completo?: string;
  nome_usuario?: string;
  biografia?: string;
  url_avatar?: string;
  localizacao?: string;
  criado_em?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PerfilData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      if (authUser) {
        // Buscar dados do perfil da tabela 'perfis'
        const { data: profileData, error: profileError } = await supabase
          .from('perfis')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116: no rows found, ok se perfil ainda não existe
          console.error("Erro ao buscar perfil:", profileError);
        }
        setProfile(profileData);
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const getDisplayName = () => {
    if (profile?.nome_completo) return profile.nome_completo;
    if (user?.user_metadata?.nome_completo) return user.user_metadata.nome_completo;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split("@")[0];
    return "Usuário";
  };
  
  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    // AuthGuard deveria redirecionar, mas como fallback:
    return (
       <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container py-8 text-center">Você precisa estar logado para ver esta página.</div>
      </div>
    )
  }

  const displayName = getDisplayName();
  const avatarUrl = profile?.url_avatar || user.user_metadata?.avatar_url;


  return (
    <AuthGuard> {/* Envolve com AuthGuard para garantir que só usuários logados acessem */}
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar /> {/* Seu componente Navbar global */}

        <main className="flex-1">
          <div className="container py-8">
            <div className="max-w-3xl mx-auto">
              <Card className="overflow-hidden shadow-lg">
                <div className="h-40 bg-gradient-to-r from-green-400 to-emerald-600" />
                <CardContent className="p-6 relative">
                  <div className="flex flex-col items-center sm:flex-row sm:items-end sm:space-x-5 -mt-16">
                    <Avatar className="h-28 w-28 border-4 border-white dark:border-slate-800 shadow-md">
                      <AvatarImage src={avatarUrl || undefined} alt={displayName} />
                      <AvatarFallback className="text-3xl">{getInitials(displayName)}</AvatarFallback>
                    </Avatar>
                    <div className="mt-4 sm:mt-0 flex-grow text-center sm:text-left">
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{displayName}</h1>
                      {profile?.nome_usuario && <p className="text-sm text-muted-foreground">@{profile.nome_usuario}</p>}
                      <p className="text-sm text-muted-foreground mt-1">
                        {profile?.biografia || "Entusiasta de trilhas e natureza."}
                      </p>
                    </div>
                   <Link href="/profile/edit" className="w-full">
   <Button className="mt-6 w-full" variant="outline"> {/* variant="outline" pode ser uma boa opção */}
    <Edit3 className="h-4 w-4 mr-2" />
    Editar Perfil
  </Button>
</Link>
                  </div>

                  <div className="mt-6 pt-6 border-t dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {profile?.localizacao && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{profile.localizacao}</span>
                      </div>
                    )}
                    {user.created_at && ( // Usando user.created_at que vem de auth.users
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Entrou em {new Date(user.created_at).toLocaleDateString("pt-BR", { month: 'long', year: 'numeric' })}</span>
                      </div>
                    )}
                     {user.email && (
                      <div className="flex items-center sm:col-span-2">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" /> {/* Exemplo, ícone importado de lucide-react */}
                        <span>{user.email}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Exemplo de como você poderia listar algumas badges se tivesse esses dados */}
                  {/* <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                    <Badge variant="secondary">Caminhante</Badge>
                    <Badge variant="secondary">Fotógrafo da Natureza</Badge>
                  </div> */}
                </CardContent>
              </Card>

              {/* Aqui você pode adicionar outras seções se desejar, como "Trilhas Favoritas" simplificado */}
              {/* Por exemplo, a lista de favoritos já está em /favorites */}
               <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Minhas Próximas Aventuras</CardTitle>
                  <CardDescription>Trilhas que você planejou ou está explorando.</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Aqui viria a lógica para buscar e listar atividades planejadas ou em progresso */}
                  <p className="text-muted-foreground">Nenhuma atividade planejada no momento.</p>
                  <Link href="/trilhas">
                    <Button className="mt-4">Explorar Trilhas</Button>
                  </Link>
                </CardContent>
              </Card>

            </div>
          </div>
        </main>

        {/* Footer (mantido como placeholder, conforme solicitado) */}
        <footer className="bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-12">
            {/* ... (Conteúdo do Footer placeholder, como na página inicial) ... */}
            <div className="text-center mt-4 text-sm text-gray-500">
              © 2025 Parques Brasil. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </div>
    </AuthGuard>
  )
}
