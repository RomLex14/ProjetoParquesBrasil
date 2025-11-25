// components/navbar.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation" 
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
import { User, LogOut, Heart, LayoutDashboard, ChevronDown, Menu, LogIn, UserPlus, Trees, Mountain, Map, Home } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false) // Adicionado estado de scroll para visual dinâmico
  const router = useRouter()
  const pathname = usePathname()

  // Lógica de sessão original que funcionava para você
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listener de scroll para efeito visual
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
    router.refresh()
  }

  const getDisplayName = (user: any) => {
    if (user?.user_metadata?.nome_completo) return user.user_metadata.nome_completo;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
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

  // Links de navegação centralizados
  const navLinks = [
    { href: "/", label: "Início", icon: Home },
    { href: "/parques", label: "Parques", icon: Trees },
    { href: "/trilhas", label: "Trilhas", icon: Mountain },
    { href: "/map", label: "Mapa", icon: Map },
  ]

  return (
    // <<< AQUI ESTÁ A MUDANÇA VISUAL >>>
    <nav className={cn(
      "sticky top-0 z-50 transition-all duration-200",
      // Visual Translúcido (Glassmorphism)
      "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60",
      // Borda inferior dinâmica (aparece só ao rolar)
      isScrolled ? "shadow-sm border-b border-border/50" : "border-b border-transparent"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center relative">
          
          {/* 1. LOGO */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                 <Image src="/icon.png" alt="Logo Trilhas Brasil" fill className="object-contain" />
              </div>
              <span className="text-foreground">Trilhas<span className="text-primary">Brasil</span></span>
            </Link>
          </div>

          {/* 2. NAVEGAÇÃO DESKTOP (Centralizada) */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navLinks.map((link) => (
               <Link 
                 key={link.href}
                 href={link.href} 
                 className={cn(
                   "text-sm font-medium transition-colors hover:text-primary",
                   pathname === link.href ? "text-primary" : "text-muted-foreground"
                 )}
               >
                 {link.label}
               </Link>
            ))}
          </div>

          {/* 3. AÇÕES (DIREITA) */}
          <div className="flex items-center space-x-2 sm:space-x-4 ml-auto">
            <ThemeToggle />
            
            {/* Versão Desktop dos Botões */}
            <div className="hidden md:flex items-center gap-2">
              {loading ? (
                <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 h-auto p-1 rounded-full hover:bg-muted/50">
                      <Avatar className="h-8 w-8 border border-border/50">
                        <AvatarImage src={user.user_metadata?.avatar_url || undefined} alt={getDisplayName(user)} />
                        <AvatarFallback>{getInitials(getDisplayName(user))}</AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-sm font-medium text-foreground">{getDisplayName(user)}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer w-full flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Minha Área
                      </Link> 
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer w-full flex items-center"> 
                        <User className="mr-2 h-4 w-4" />
                        Meu Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favorites" className="cursor-pointer w-full flex items-center">
                        <Heart className="mr-2 h-4 w-4" />
                        Favoritos
                      </Link>  
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Entrar</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Cadastrar</Link>
                  </Button>
                </>
              )}
            </div>

            {/* MENU MOBILE (SHEET) - Visível apenas em telas pequenas */}
            <div className="flex md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col">
                   <SheetHeader>
                      <SheetTitle className="text-left flex items-center gap-2">
                        <div className="relative w-6 h-6 rounded overflow-hidden">
                           <Image src="/icon.png" alt="Logo" fill className="object-contain" />
                        </div>
                        TrilhasBrasil
                      </SheetTitle>
                    </SheetHeader>

                    {/* Perfil no Mobile */}
                    {user && (
                      <div className="mt-6 mb-2 flex items-center gap-4 px-2 bg-muted/50 p-3 rounded-lg">
                        <Avatar className="h-10 w-10 border border-border">
                          <AvatarImage src={user.user_metadata?.avatar_url} />
                          <AvatarFallback>{getInitials(getDisplayName(user))}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{getDisplayName(user)}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </div>
                    )}

                    <nav className="flex flex-col gap-2 mt-4 flex-1">
                      {navLinks.map((link) => {
                        const Icon = link.icon
                        return (
                          <SheetClose key={link.href} asChild>
                            <Link
                              href={link.href}
                              className={cn(
                                "flex items-center gap-4 px-2 py-3 text-lg font-medium transition-colors hover:text-primary rounded-md hover:bg-accent",
                                pathname === link.href ? "text-primary bg-accent/50" : "text-foreground"
                              )}
                            >
                              <Icon className="h-5 w-5" />
                              {link.label}
                            </Link>
                          </SheetClose>
                        )
                      })}
                    </nav>

                    <div className="mt-auto border-t border-border pt-4">
                      <div className="flex flex-col gap-3">
                        {user ? (
                           <SheetClose asChild>
                            <Button 
                              variant="outline" 
                              className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:border-red-900/30" 
                              size="lg"
                              onClick={handleLogout}
                            >
                              <LogOut className="h-4 w-4" />
                              Sair da conta
                            </Button>
                          </SheetClose>
                        ) : (
                          <>
                            <SheetClose asChild>
                              <Link href="/login" className="w-full">
                                <Button variant="outline" className="w-full justify-start gap-2" size="lg">
                                  <LogIn className="h-4 w-4" />
                                  Entrar
                                </Button>
                              </Link>
                            </SheetClose>
                            <SheetClose asChild>
                              <Link href="/signup" className="w-full">
                                <Button className="w-full justify-start gap-2" size="lg">
                                  <UserPlus className="h-4 w-4" />
                                  Criar conta
                                </Button>
                              </Link>
                            </SheetClose>
                          </>
                        )}
                      </div>
                    </div>
                </SheetContent>
              </Sheet>
            </div>

          </div>
        </div>
      </div>
    </nav>
  )
}