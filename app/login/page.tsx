"use client"

import type React from "react" // Adicionado 'type'
import { useState, useEffect } from "react"
import Link from "next/link" // Garantida a importação
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import LoginGoogleButton from "@/components/login-google-button"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [envVarsError, setEnvVarsError] = useState<boolean>(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get("next") || "/dashboard"
  const message = searchParams.get("message")

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setEnvVarsError(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (envVarsError) {
      setError("Não é possível conectar ao Supabase. Verifique as variáveis de ambiente.")
      return
    }

    setError(null)
    try {
      setLoading(true)

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // persistSession: true, // <-- LINHA REMOVIDA
          // Adicione outras opções válidas aqui se necessário, ex: captchaToken
        },
      })

      if (error) {
        throw error
      }
      router.push(nextUrl)
      router.refresh()
    } catch (error: any) {
      setError(error.message || "Ocorreu um erro desconhecido.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
          <CardDescription>Faça login na sua conta para acessar o Parques Brasil</CardDescription>
          {message && (
            <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {envVarsError && (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Erro de configuração:</strong> As variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e
                NEXT_PUBLIC_SUPABASE_ANON_KEY não estão definidas. Verifique se o arquivo .env.local foi criado
                corretamente na raiz do projeto.
              </AlertDescription>
            </Alert>
          )}

          <LoginGoogleButton />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 dark:bg-background dark:text-muted-foreground">Ou continue com email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={envVarsError || loading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link href="/reset-password" className="text-sm text-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={envVarsError || loading}
              />
            </div>

            {error && !envVarsError && <div className="text-sm text-red-500">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading || envVarsError}>
              {loading ? "Entrando..." : "Entrar com Email"}
            </Button>

            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}