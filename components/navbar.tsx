"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Perfil } from "@/lib/types";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton";
import { User, LogOut, Heart, LayoutDashboard, ChevronDown, Route } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import LevelBadge from "./level-badge";

type NavbarProfile = Pick<Perfil, 'nivel' | 'nome_completo' | 'url_avatar'>;

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<NavbarProfile | null>(null);
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUserProfile = async (userId: string): Promise<NavbarProfile | null> => {
    const { data, error } = await supabase
      .from('perfis')
      .select('nivel, nome_completo, url_avatar')
      .eq('id', userId)
      .single<NavbarProfile>();

    if (error && error.code !== 'PGRST116') {
      console.error("Erro ao buscar perfil (Navbar):", error);
    }
    return data;
  }

  useEffect(() => {
    const handleAuthChange = async (_event: string, session: any) => {
        setLoading(true);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
            const profile = await fetchUserProfile(currentUser.id);
            setUserProfile(profile);
        } else {
            setUserProfile(null);
        }
        setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
        handleAuthChange('INITIAL_SESSION', session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null);
    setUserProfile(null);
    router.push("/")
    router.refresh()
  }

  const getDisplayName = (currentUser: any, profile: NavbarProfile | null) => {
    return profile?.nome_completo
           || currentUser?.user_metadata?.nome_completo
           || currentUser?.user_metadata?.full_name
           || currentUser?.email?.split("@")[0]
           || "Usuário";
  }

  const getInitials = (name: string) => {
     const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return name ? name.substring(0, 2).toUpperCase() : 'U';
  }

  const displayName = getDisplayName(user, userProfile);
  const avatarUrl = userProfile?.url_avatar || user?.user_metadata?.avatar_url;

  return (
    <nav className="border-b bg-background border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <Image src="/icon.png" alt="Logo Trilhas Brasil" width={32} height={32} />
              <span>TrilhasBrasil</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Início</Link>
            <Link href="/parques" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Parques</Link>
            <Link href="/trilhas" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Trilhas</Link>
            <Link href="/map" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Mapa</Link>
            {user && (
              <Link href="/rotas" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Minhas Rotas</Link>
            )}
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle />
            {loading ? (
              <Skeleton className="w-8 h-8 rounded-full" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" className="flex items-center space-x-2 h-auto p-1 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatarUrl || undefined} alt={displayName} />
                      <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                    </Avatar>
                     <span className="hidden sm:inline text-sm font-medium text-foreground">{displayName}</span>
                     {userProfile?.nivel != null && <LevelBadge level={userProfile.nivel} size="sm" />}
                     <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={avatarUrl || undefined} alt={displayName} />
                        <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                       <div className="flex items-center gap-1.5">
                           <p className="font-medium text-sm truncate w-[140px]">{displayName}</p>
                           {userProfile?.nivel != null && <LevelBadge level={userProfile.nivel} size="sm" />}
                       </div>
                       <p className="w-[180px] truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/dashboard" className="cursor-pointer w-full"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/profile" className="cursor-pointer w-full"><User className="mr-2 h-4 w-4" />Meu Perfil</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/rotas" className="cursor-pointer w-full"><Route className="mr-2 h-4 w-4" />Minhas Rotas</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/favorites" className="cursor-pointer w-full"><Heart className="mr-2 h-4 w-4" />Favoritos</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"><LogOut className="mr-2 h-4 w-4" />Sair</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild><Link href="/login">Entrar</Link></Button>
                <Button asChild><Link href="/signup">Cadastrar</Link></Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}