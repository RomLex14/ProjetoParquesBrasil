// app/profile/page.tsx
"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Perfil } from "@/lib/types";
import LevelBadge from "@/components/level-badge";
import { Mail, MapPin, Calendar, Edit3, Loader2 } from "lucide-react";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import AuthGuard from "@/components/auth-guard";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      if (authUser) {
        const { data: profileData, error: profileError } = await supabase
          .from('perfis').select('*').eq('id', authUser.id).single<Perfil>();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Erro ao buscar perfil:", profileError);
        }
        setProfile(profileData);
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const getDisplayName = () => {
    return profile?.nome_completo
           || user?.user_metadata?.nome_completo
           || user?.user_metadata?.full_name
           || user?.email?.split("@")[0]
           || "Usuário";
  };

   const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
     return name ? name.substring(0, 2).toUpperCase() : 'U';
  };

  if (loading) {
       return (
         <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
           <Navbar />
           <main className="flex-1 container py-8 px-4">
               <div className="max-w-3xl mx-auto">
                   <Card className="overflow-hidden shadow-lg">
                       <Skeleton className="h-40 w-full" />
                       <CardContent className="p-6 relative">
                           <div className="flex flex-col items-center sm:flex-row sm:items-end sm:space-x-5 -mt-16">
                               <Skeleton className="h-28 w-28 rounded-full border-4 border-white dark:border-slate-800 shadow-md"/>
                               <div className="mt-4 sm:mt-0 flex-grow text-center sm:text-left space-y-2">
                                   <Skeleton className="h-7 w-48 mx-auto sm:mx-0"/>
                                   <Skeleton className="h-4 w-32 mx-auto sm:mx-0"/>
                                   <Skeleton className="h-4 w-64 mx-auto sm:mx-0"/>
                               </div>
                               <Skeleton className="h-10 w-32 mt-4 sm:mt-0"/>
                           </div>
                            <div className="mt-6 pt-6 border-t dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Skeleton className="h-5 w-40"/>
                                <Skeleton className="h-5 w-48"/>
                                <Skeleton className="h-5 w-full sm:col-span-2"/>
                            </div>
                       </CardContent>
                   </Card>
               </div>
           </main>
         </div>
       );
  }

  if (!user) {
     return (
       <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container py-8 text-center">Você precisa estar logado para ver esta página.</div>
      </div>
    )
  }

  const displayName = getDisplayName();
  const avatarUrl = profile?.url_avatar || user?.user_metadata?.avatar_url;

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <main className="flex-1">
          <div className="container py-8 px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="overflow-hidden shadow-lg">
                <div className="h-40 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-700 dark:to-emerald-800" />
                <CardContent className="p-6 relative">
                  <div className="flex flex-col items-center sm:flex-row sm:items-end sm:space-x-5 -mt-16">
                    <Avatar className="h-28 w-28 border-4 border-white dark:border-slate-800 shadow-md">
                      <AvatarImage src={avatarUrl || undefined} alt={displayName} />
                      <AvatarFallback className="text-3xl">{getInitials(displayName)}</AvatarFallback>
                    </Avatar>
                    <div className="mt-4 sm:mt-0 flex-grow text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{displayName}</h1>
                        {profile?.nivel != null && <LevelBadge level={profile.nivel} size="md" />}
                      </div>
                      {profile?.nome_usuario && <p className="text-sm text-muted-foreground">@{profile.nome_usuario}</p>}
                      <p className="text-sm text-muted-foreground mt-1">
                        {profile?.biografia || "Edite seu perfil para adicionar uma biografia."}
                      </p>
                    </div>
                   <Link href="/profile/edit" className="w-full sm:w-auto mt-4 sm:mt-0 flex-shrink-0">
                     <Button variant="outline" className="w-full">
                       <Edit3 className="h-4 w-4 mr-2" />
                       Editar Perfil
                     </Button>
                   </Link>
                  </div>
                  <div className="mt-6 pt-6 border-t dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      {profile?.localizacao && (<div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-muted-foreground" /><span>{profile.localizacao}</span></div>)}
                      {user.created_at && (<div className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-muted-foreground" /><span>Membro desde {new Date(user.created_at).toLocaleDateString("pt-BR", { month: 'long', year: 'numeric' })}</span></div>)}
                      {user.email && (<div className="flex items-center sm:col-span-2"><Mail className="h-4 w-4 mr-2 text-muted-foreground" /><span>{user.email}</span></div>)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}