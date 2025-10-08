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
    // Verificar sessão existente ao carregar o componente
    const checkSession = async () => {
      try {
        // Verifica se há uma sessão existente
        const {
          data: { session },
        } = await supabase.auth.getSession()

        // Se houver uma sessão, define o usuário
        setUser(session?.user || null)

        // Se requer autenticação e não há usuário, redireciona
        if (requireAuth && !session?.user) {
          router.push(redirectTo)
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error)
        if (requireAuth) {
          router.push(redirectTo)
        }
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Atualiza o estado do usuário quando a autenticação muda
      setUser(session?.user ?? null)

      // Se o evento for SIGNED_OUT e requer autenticação, redireciona
      if (event === "SIGNED_OUT" && requireAuth) {
        router.push(redirectTo)
      }

      // Se o evento for SIGNED_IN e não requer autenticação, redireciona para o dashboard
      if (event === "SIGNED_IN" && !requireAuth) {
        router.push("/dashboard")
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [requireAuth, redirectTo, router])

  // Se ainda está carregando, mostrar fallback
  if (loading) {
    return <>{fallback}</>
  }

  // Se requer autenticação mas usuário não está logado
  if (requireAuth && !user) {
    router.push(redirectTo)
    return <>{fallback}</>
  }

  // Se não requer autenticação ou usuário está logado
  return <>{children}</>
}
