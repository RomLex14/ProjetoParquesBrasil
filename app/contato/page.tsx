// app/contato/page.tsx
"use client"

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, Clock } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function ContatoPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de envio
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    toast({
      title: "Mensagem enviada!",
      description: "Recebemos seu contato e responderemos em breve.",
    });
    
    // Reset do form
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Header com fundo colorido */}
        <div className="bg-primary/5 py-16 md:py-24">
          <div className="container text-center max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Fale Conosco</h1>
            <p className="text-lg text-muted-foreground">
              Tem dúvidas sobre alguma trilha, sugestões ou quer relatar um problema? 
              Estamos aqui para ajudar você a ter a melhor experiência na natureza.
            </p>
          </div>
        </div>

        <div className="container py-12 -mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Coluna de Informações (Esquerda) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Cards de Contato */}
              <Card className="border-none shadow-md bg-primary text-primary-foreground overflow-hidden relative">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <CardContent className="p-6 space-y-6 relative z-10">
                  <h3 className="font-bold text-xl mb-6">Informações de Contato</h3>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium opacity-90 text-sm">Telefone</p>
                      <p className="font-bold text-lg">(61) 99376-4675</p>
                      <p className="text-xs opacity-75 mt-1">Seg - Sex, 9h às 18h</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium opacity-90 text-sm">Email</p>
                      <p className="font-bold">trilhas.brasil.jrvy@gmail.com</p>
                      <p className="text-xs opacity-75 mt-1">Respondemos em até 24h</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium opacity-90 text-sm">Sede</p>
                      <p className="font-bold">Taguatinga, Brasília - DF</p>
                      <p className="text-xs opacity-75 mt-1">CEUB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card de Horário */}
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" /> Horário de Atendimento
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex justify-between">
                      <span>Segunda a Sexta</span>
                      <span className="font-medium text-foreground">09:00 - 18:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sábado</span>
                      <span className="font-medium text-foreground">09:00 - 13:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Domingo</span>
                      <span className="text-red-500 font-medium">Fechado</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Coluna do Formulário (Direita) */}
            <div className="lg:col-span-2">
              <Card className="h-full shadow-md border-none">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Envie uma mensagem</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input id="name" placeholder="Seu nome" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="seu@email.com" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone (Opcional)</Label>
                        <Input id="phone" placeholder="(00) 00000-0000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Assunto</Label>
                        <Input id="subject" placeholder="Sobre o que você quer falar?" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Descreva sua dúvida ou sugestão em detalhes..." 
                        className="min-h-[150px]"
                        required 
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full md:w-auto px-8" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" /> Enviar Mensagem
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}