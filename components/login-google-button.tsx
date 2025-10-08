"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase" // Certifique-se que o caminho está correto
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc" // Certifique-se que react-icons está instalado e funcionando
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginGoogleButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter() // router não está sendo usado neste snippet, mas pode ser útil para redirecionamentos pós-login se o redirectTo falhar ou para outras lógicas
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get("next") || "/dashboard"

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
      
        },
      })

      if (error) {
        throw error
      }

      if (data.url) {

      }

    } catch (error: any) {
      console.error("Erro ao fazer login com Google:", error.message)
      // Considerar usar um sistema de toast/notificação em vez de alert para melhor UX
      alert(`Erro ao fazer login com Google: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      onClick={handleGoogleLogin}
      disabled={loading}
    >
      {loading ? (
        <>Conectando...</> // Poderia usar um <Loader2 className="animate-spin" /> aqui também
      ) : (
        <>
          <FcGoogle className="h-5 w-5" />
          Entrar com Google
        </>
      )}
    </Button>
  )
}