"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"

export default function SignupGoogleButton() {
  const [loading, setLoading] = useState(false)

  const handleGoogleSignup = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error("Erro ao cadastrar com Google:", error.message)
      alert(`Erro ao cadastrar com Google: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      onClick={handleGoogleSignup}
      disabled={loading}
    >
      {loading ? (
        <>Conectando...</>
      ) : (
        <>
          <FcGoogle className="h-5 w-5" />
          Cadastrar com Google
        </>
      )}
    </Button>
  )
}

