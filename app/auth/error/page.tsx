import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-red-600">Erro de Autenticação</CardTitle>
          <CardDescription>Ocorreu um erro durante o processo de autenticação.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Não foi possível completar o processo de login ou cadastro. Isso pode ter ocorrido por um dos seguintes
            motivos:
          </p>

          <ul className="list-disc pl-5 space-y-1">
            <li>O link de autenticação expirou</li>
            <li>Houve um problema com o provedor de autenticação</li>
            <li>As permissões necessárias não foram concedidas</li>
            <li>Ocorreu um erro técnico durante o processo</li>
          </ul>

          <div className="pt-4">
            <Button asChild className="w-full">
              <Link href="/login">Voltar para a página de login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

