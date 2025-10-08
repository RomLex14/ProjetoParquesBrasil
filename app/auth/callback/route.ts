import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/"

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Troca o código de autorização por uma sessão
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("Erro ao trocar código por sessão:", error.message)
      return NextResponse.redirect(new URL("/auth/error", request.url))
    }
  }

  // URL para redirecionar após a autenticação (página inicial por padrão)
  return NextResponse.redirect(new URL(next, request.url))
}
