import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shield, Heart } from "lucide-react"
import Navbar from "@/components/navbar"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Sobre o <span className="text-green-600">Parques Brasil</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos apaixonados pela natureza brasileira e dedicados a conectar pessoas com as maravilhas dos nossos
            parques nacionais através da tecnologia.
          </p>
        </section>

        {/* Nossa Missão */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nossa Missão</h2>
              <p className="text-gray-600 mb-6">
                Democratizar o acesso aos parques nacionais brasileiros, fornecendo informações precisas, ferramentas de
                planejamento e uma comunidade engajada para todos os amantes da natureza.
              </p>
              <p className="text-gray-600">
                Acreditamos que a conexão com a natureza é fundamental para o bem-estar humano e a preservação
                ambiental. Por isso, trabalhamos para tornar essa experiência mais acessível e segura para todos.
              </p>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Natureza brasileira"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Nossos Valores */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Nossos Valores</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Heart className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Paixão pela Natureza</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Amamos a natureza brasileira e trabalhamos para inspirar outros a descobrir e preservar nossas
                  riquezas naturais.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Segurança em Primeiro Lugar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Priorizamos a segurança dos aventureiros, fornecendo informações precisas sobre condições das trilhas
                  e clima.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Comunidade Unida</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Construímos uma comunidade de exploradores que compartilham experiências e se ajudam mutuamente.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Estatísticas */}
        <section className="bg-green-600 text-white rounded-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Nosso Impacto</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">70+</div>
              <div className="text-green-100">Parques Mapeados</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-green-100">Trilhas Catalogadas</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10k+</div>
              <div className="text-green-100">Usuários Ativos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50k+</div>
              <div className="text-green-100">Trilhas Realizadas</div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Junte-se à Nossa Comunidade</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Faça parte da maior comunidade de exploradores de parques nacionais do Brasil. Descubra, explore e
            compartilhe suas aventuras.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">Criar Conta Gratuita</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/trilhas">Explorar Trilhas</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
