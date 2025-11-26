// components/auth-guard.tsx
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
}

export default function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = "/login",
  fallback = <div className="flex justify-center items-center min-h-screen">Carregando...</div>,
}: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (mounted) {
          setUser(session?.user || null)
          setLoading(false)

          // Redirecionamento deve acontecer AQUI, dentro do useEffect
          if (requireAuth && !session?.user) {
            router.push(redirectTo)
          }
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error)
        // Em caso de erro, assume sem usuário e termina loading
        if (mounted) {
            setLoading(false);
            if(requireAuth) router.push(redirectTo);
        }
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setUser(session?.user ?? null)
        
        // Lógica de redirecionamento em mudança de estado
        if (event === "SIGNED_OUT" && requireAuth) {
          router.push(redirectTo)
        }
        
        // Se preferir redirecionar para dashboard quando loga em página pública, descomente:
        // if (event === "SIGNED_IN" && !requireAuth) { router.push("/dashboard") }
        
        setLoading(false)
      }
    })

    return () => {
      mounted = false;
      subscription.unsubscribe()
    }
  }, [requireAuth, redirectTo, router])

  // Se está carregando, mostra fallback
  if (loading) {
    return <>{fallback}</>
  }

  // Se requer autenticação e não tem usuário, mostra fallback enquanto o useEffect redireciona.
  // NÃO chamamos router.push() aqui para evitar o erro.
  if (requireAuth && !user) {
    return <>{fallback}</>
  }

  // Se não requer autenticação ou usuário está logado, renderiza o conteúdo
  return <>{children}</>
}