// app/auth/update-password/page.tsx

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, KeyRound } from "lucide-react"

export default function UpdatePasswordPage() {
  const router = useRouter()  
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [sessionExists, setSessionExists] = useState(false)

  useEffect(() => {
    // Verifica se o usuário chegou aqui com uma sessão válida (link do email)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setSessionExists(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (newPassword !== confirmPassword) {
      setError("As senhas não conferem.")
      return
    }
    if (newPassword.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      setError(`Erro: ${error.message}`)
    } else {
      setMessage("Senha atualizada com sucesso! Redirecionando...")
      await supabase.auth.signOut()
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Nova Senha</CardTitle>
          <CardDescription>
            {sessionExists
              ? "Digite sua nova senha abaixo."
              : "Verificando link..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessionExists ? (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {message && (
                <Alert variant="default" className="text-green-700 border-green-300">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading || !!message}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <KeyRound className="mr-2 h-4 w-4" />
                )}
                Atualizar Senha
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground py-8">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Validando acesso...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}