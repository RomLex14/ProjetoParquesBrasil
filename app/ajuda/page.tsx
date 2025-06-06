import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, HelpCircle, Book, MessageSquare } from "lucide-react"
import Navbar from "@/components/navbar"
import Link from "next/link"

const faqs = [
  {
    pergunta: "Como faço para encontrar trilhas próximas a mim?",
    resposta:
      "Permita o acesso à sua localização quando solicitado ou use a função 'Perto de Mim' na página de trilhas. Nosso sistema mostrará as trilhas mais próximas baseadas na sua localização atual.",
  },
  {
    pergunta: "Preciso pagar para usar o aplicativo?",
    resposta:
      "O Parques Brasil oferece um plano gratuito com acesso básico às trilhas. Para recursos avançados como mapas offline e previsão do tempo detalhada, oferecemos planos Premium a partir de R$ 19,90/mês.",
  },
  {
    pergunta: "Como posso baixar mapas para usar offline?",
    resposta:
      "Os mapas offline estão disponíveis para usuários Premium. Na página da trilha, clique em 'Baixar GPX' ou 'Baixar Mapa Offline' para ter acesso mesmo sem internet.",
  },
  {
    pergunta: "É seguro fazer trilhas sozinho?",
    resposta:
      "Recomendamos sempre fazer trilhas acompanhado. Se for sozinho, informe alguém sobre seus planos, leve equipamentos de segurança e use nossa função de compartilhamento de localização em tempo real.",
  },
  {
    pergunta: "Como posso contribuir com avaliações e fotos?",
    resposta:
      "Após fazer uma trilha, você pode deixar sua avaliação e enviar fotos na página da trilha. Suas contribuições ajudam outros exploradores a se prepararem melhor.",
  },
  {
    pergunta: "O que fazer em caso de emergência na trilha?",
    resposta:
      "Em emergências, ligue 190 (Polícia) ou 193 (Bombeiros). Use nossa função de compartilhamento de localização para facilitar o resgate. Sempre leve um kit de primeiros socorros.",
  },
]

export default function AjudaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Central de Ajuda</h1>
            <p className="text-xl text-gray-600">Encontre respostas para suas dúvidas sobre o Parques Brasil</p>
          </div>

          {/* Busca */}
          <div className="mb-12">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar na ajuda..." className="pl-10" />
            </div>
          </div>

          {/* Categorias de Ajuda */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <HelpCircle className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Primeiros Passos</CardTitle>
                <CardDescription>Como começar a usar o Parques Brasil</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Ver Guias
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Book className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Dicas de Trilha</CardTitle>
                <CardDescription>Segurança e preparação para trilhas</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Ler Dicas
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Suporte</CardTitle>
                <CardDescription>Fale diretamente com nossa equipe</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contato">Entrar em Contato</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left">{faq.pergunta}</AccordionTrigger>
                  <AccordionContent className="text-gray-600">{faq.resposta}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12 bg-green-600 text-white rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Não encontrou o que procurava?</h3>
            <p className="mb-6">Nossa equipe está pronta para ajudar você</p>
            <Button variant="secondary" asChild>
              <Link href="/contato">Falar com Suporte</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
