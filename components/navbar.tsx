"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Settings, Heart, Activity, ChevronDown, Mountain, /* Adicionado para logo */ 
LayoutDashboard} from "lucide-react" // Ícones mantidos por enquanto

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (error) {
        console.error("Erro ao verificar sessão:", error)
      } finally {
        setLoading(false)
      }
    }
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/") // Redireciona para a home após logout
    router.refresh()
  }

  const getDisplayName = (user: any) => {
    if (user?.user_metadata?.nome_completo) return user.user_metadata.nome_completo;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name; // Para login com Google
    if (user?.email) return user.email.split("@")[0];
    return "Usuário";
  }

  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  return (
    <nav className="border-b bg-white dark:bg-gray-900 dark:border-gray-700 sticky top-0 z-50"> {/* Adicionado sticky e z-index */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-green-600 dark:text-green-400">
              <Mountain className="h-6 w-6" /> {/* Ícone de logo */}
              <span>Parques Brasil</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400">
              Início
            </Link>
            <Link href="/parques" className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400">
              Parques
            </Link>
            <Link href="/trilhas" className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400">
              Trilhas
            </Link>
            <Link href="/map" className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400">
              Mapa
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 h-auto p-1 rounded-full"> {/* Estilo de botão para trigger */}
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url || undefined} alt={getDisplayName(user)} />
                      <AvatarFallback>{getInitials(getDisplayName(user))}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm text-gray-700 dark:text-gray-300">{getDisplayName(user)}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.user_metadata?.avatar_url || undefined} alt={getDisplayName(user)} />
                        <AvatarFallback>{getInitials(getDisplayName(user))}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{getDisplayName(user)}</p>
                      <p className="w-[180px] truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {/* ITENS REMOVIDOS: Dashboard, Minhas Atividades, Configurações */}
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer w-full"> 
                      <User className="mr-2 h-4 w-4" />
                      Meu Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites" className="cursor-pointer w-full">
                      <Heart className="mr-2 h-4 w-4" />
                      Favoritos
                    </Link>  
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer w-full">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link> 
                    </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:hover:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Cadastrar</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
