import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Cria um cliente Supabase específico para o middleware
  const supabase = createMiddlewareClient({ req, res })

  // Atualiza a sessão se existir um token de atualização
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Rotas que requerem autenticação
  const protectedRoutes = [
    "/dashboard", 
    "/profile", 
    "/favorites", 
    "/my-activities", 
    "/settings", 
    "/admin",
    "/rotas/criar"
  ]

  // Rotas que são apenas para usuários não autenticados
  const authRoutes = ["/login", "/signup"]

  const { pathname } = req.nextUrl

  // Verifica se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Verifica se é uma rota de autenticação
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Se o usuário não está logado e tenta acessar uma rota protegida
  if (!session && isProtectedRoute) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/login"
    redirectUrl.searchParams.set("next", pathname)

    // Lógica da mensagem personalizada
    if (pathname.startsWith("/rotas/criar")) {
      redirectUrl.searchParams.set("message", "Você deverá estar logado para criar suas rotas")
    } else {
      redirectUrl.searchParams.set("message", "Você precisa estar logado para acessar esta página")
    }
    
    return NextResponse.redirect(redirectUrl)
  }

  // Se o usuário está logado e tenta acessar rotas de autenticação
  if (session && isAuthRoute) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/dashboard"
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/callback (callback de autenticação)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)",
  ],
}