"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator"; // Importado, mas não usado nesta versão. Remova se não for necessário.
import {
  Star,
  MapPin,
  TrendingUp,
  Mountain,
  Crown,
  Check,
  X,
  Navigation,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Shield,
  Award,
  Users,
  Globe,
  Search,
  Loader2
} from "lucide-react"
import Navbar from "@/components/navbar"
import { supabase } from "@/lib/supabase"
import { featuredTrails } from "@/lib/data"
import TrailCard from "@/components/trail-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// import { useGeolocation } from "@/hooks/use-geolocation"; // Descomentado pois é usado

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [showLocationRequest, setShowLocationRequest] = useState(false)
  const [locationPermission, setLocationPermission] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false) // Estado para controlar renderização pós-montagem

  // Efeito para indicar que o componente foi montado no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function checkUserSession() {
      setLoadingAuth(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Erro ao verificar sessão do usuário:", error);
      } finally {
        setLoadingAuth(false);
      }
    }
    checkUserSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (_event !== "INITIAL_SESSION") { // Evitar setLoadingAuth(false) duas vezes na carga inicial
        setLoadingAuth(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isClient) return; // Só executa no cliente

    if (navigator.geolocation && 'permissions' in navigator) {
      navigator.permissions.query({ name: "geolocation" })
        .then((result) => {
          setLocationPermission(result.state);
          if (result.state === "prompt") {
            setShowLocationRequest(true);
          }
          result.onchange = () => { // Ouve mudanças no estado da permissão
            setLocationPermission(result.state);
            if (result.state !== "granted") {
                setShowLocationRequest(result.state === "prompt");
            } else {
                setShowLocationRequest(false);
            }
          };
        })
        .catch(() => {
          if (locationPermission !== 'granted' && locationPermission !== 'denied') {
            setShowLocationRequest(true);
          }
        });
    } else if (navigator.geolocation) {
      // Fallback se navigator.permissions não estiver disponível
      // Verifica o estado atual da permissão de forma mais simples ou assume 'prompt'
      // Para evitar mostrar o prompt repetidamente, podemos checar se já foi negado
      // ou se o usuário já interagiu. Por agora, mostra se não temos estado.
      if (!locationPermission) {
         setShowLocationRequest(true);
      }
    }
  }, [isClient, locationPermission]); // Adicionado locationPermission como dependência

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission("granted");
          setShowLocationRequest(false);
          // console.log("Localização obtida:", position.coords);
        },
        (error) => {
          setLocationPermission("denied");
          setShowLocationRequest(false);
          console.error("Erro ao obter localização:", error.message);
          // Poderia mostrar um toast informando o erro ou que a permissão foi negada
        }
      );
    }
  };

  const featuredTrailsForHome = featuredTrails.slice(0, 6);

  const getDisplayName = (currentUser: any) => {
    if (currentUser?.user_metadata?.nome_completo) return currentUser.user_metadata.nome_completo;
    if (currentUser?.user_metadata?.full_name) return currentUser.user_metadata.full_name;
    if (currentUser?.email) return currentUser.email.split("@")[0];
    return "Explorador(a)";
  };

  return (
    <div className="min-h-screen dark:from-slate-900 dark:to-slate-800">
      <Navbar />

      {isClient && showLocationRequest && locationPermission === 'prompt' && (
        <div className="bg-blue-100 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-700 print:hidden">
          <div className="container mx-auto px-4 py-3">
            <Alert className="border-blue-200 dark:border-blue-700 bg-transparent">
              <Navigation className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="text-blue-800 dark:text-blue-300 text-sm">
                  Permita o acesso à sua localização para encontrar trilhas próximas a você.
                </span>
                <div className="flex gap-2 mt-2 sm:mt-0 flex-shrink-0">
                  <Button size="sm" onClick={requestLocation} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Permitir
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowLocationRequest(false)}>
                    Agora não
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Explore os <span className="text-primary dark:text-green-400">Parques Nacionais</span> do Brasil
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Descubra trilhas incríveis, paisagens deslumbrantes e a biodiversidade única dos parques nacionais
          brasileiros. Planeje sua próxima aventura na natureza.
        </p>
        {!isClient || loadingAuth ? ( // Mostra placeholder se não for cliente ou se auth estiver carregando
            <div className="flex justify-center">
                <div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
        ) : user ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg text-green-700 dark:text-green-300 font-medium">
              Bem-vindo(a) de volta, {getDisplayName(user)}!
            </p>
            <Button size="lg" asChild className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white">
              <Link href="/trilhas">Explorar Todas as Trilhas</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white">
              <Link href="/trilhas">Ver Trilhas</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Entrar para Personalizar</Link>
            </Button>
          </div>
        )}
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {!isClient || loadingAuth ? (
                <div className="h-8 w-3/5 mx-auto bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : user ? "Trilhas Recomendadas para Você" 
                   : "Trilhas em Destaque"}
          </h2>
          {/* CORRIGIDO: <p> substituído por <div> para permitir <div> interno */}
          <div className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {!isClient || loadingAuth ? (
                <div className="space-y-2 mt-2">
                    <div className="h-4 w-full mx-auto bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                    <div className="h-4 w-2/3 mx-auto bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                </div>
            ) : user ? "Baseado nas suas preferências, selecionamos essas trilhas especiais para sua próxima aventura."
                   : "Descubra algumas das trilhas mais populares e bem avaliadas do Brasil."}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {featuredTrailsForHome.map((trail) => (
            <TrailCard key={trail.id} trail={trail} />
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/trilhas">Ver Todas as Trilhas</Link>
          </Button>
        </div>
      </section>

      {/* Seção Premium - Placeholder */}
      <section className="bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 dark:from-amber-900/20 dark:via-orange-900/10 dark:to-amber-900/20 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="h-8 w-8 text-amber-500" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Seja Premium</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Desbloqueie recursos exclusivos e tenha a melhor experiência explorando os parques nacionais do Brasil.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card Gratuito */}
            <Card className="relative bg-card text-card-foreground shadow-md hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-center text-xl">Gratuito</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold">R$ 0</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 flex-shrink-0" /><span>Acesso a trilhas básicas</span></li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 flex-shrink-0" /><span>Informações básicas dos parques</span></li>
                  <li className="flex items-center gap-2"><X className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-muted-foreground">Mapas offline</span></li>
                  <li className="flex items-center gap-2"><X className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="text-muted-foreground">Previsão do tempo detalhada</span></li>
                </ul>
                <Button className="w-full" variant="outline" disabled>Plano Atual</Button>
              </CardContent>
            </Card>
            {/* Card Premium */}
            <Card className="relative border-2 border-amber-500 dark:border-amber-400 shadow-xl hover:shadow-2xl transition-shadow bg-card text-card-foreground">
              <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-amber-500 text-white px-4 py-1 text-xs font-semibold">Mais Popular</Badge>
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-center text-xl flex items-center justify-center gap-2"><Crown className="h-5 w-5 text-amber-500" />Premium</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold">R$ 19,90</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 flex-shrink-0" /><span>Todas as trilhas e parques</span></li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 flex-shrink-0" /><span>Mapas offline detalhados</span></li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 flex-shrink-0" /><span>Previsão do tempo 7 dias</span></li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 flex-shrink-0" /><span>Recomendações personalizadas</span></li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 flex-shrink-0" /><span>Suporte prioritário</span></li>
                </ul>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">Assinar Premium</Button>
              </CardContent>
            </Card>
            {/* Card Família */}
            <Card className="relative bg-card text-card-foreground shadow-md hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-center text-xl flex items-center justify-center gap-2"><Users className="h-5 w-5 text-blue-500" />Família</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold">R$ 29,90</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 flex-shrink-0" /><span>Todos os recursos Premium</span></li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 flex-shrink-0" /><span>Até 5 contas familiares</span></li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 flex-shrink-0" /><span>Planejamento de grupo</span></li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 flex-shrink-0" /><span>Compartilhamento de trilhas</span></li>
                </ul>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">Assinar Família</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer Profissional - Placeholder */}
      <footer className="bg-gray-900 text-white dark:bg-slate-950">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mountain className="h-8 w-8 text-green-500" />
                <span className="text-xl font-bold">Parques Brasil</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                A plataforma mais completa para explorar os parques nacionais do Brasil. Descubra trilhas, planeje
                aventuras e conecte-se com a natureza.
              </p>
              <div className="flex space-x-1">
                <Button asChild size="icon" variant="ghost" className="text-gray-400 hover:text-white"><Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5" /></Link></Button>
                <Button asChild size="icon" variant="ghost" className="text-gray-400 hover:text-white"><Link href="#" aria-label="Instagram"><Instagram className="h-5 w-5" /></Link></Button>
                <Button asChild size="icon" variant="ghost" className="text-gray-400 hover:text-white"><Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5" /></Link></Button>
                <Button asChild size="icon" variant="ghost" className="text-gray-400 hover:text-white"><Link href="#" aria-label="Youtube"><Youtube className="h-5 w-5" /></Link></Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Explorar</h3>
              <ul className="space-y-2 text-sm">{[
                { href: "/trilhas", label: "Trilhas" },
                { href: "/parques", label: "Parques" },
                { href: "/map", label: "Mapa Interativo" },
              ].map(link => <li key={link.href}><Link href={link.href} className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">{link.label}</Link></li>)}</ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm">{[
                { href: "/ajuda", label: "Central de Ajuda" }, // Placeholder
                { href: "/contato", label: "Fale Conosco" }, // Placeholder
              ].map(link => <li key={link.href}><Link href={link.href} className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">{link.label}</Link></li>)}</ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contato</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-gray-400 dark:text-gray-500"><Mail className="h-4 w-4 flex-shrink-0" /><span>contato@parquesbrasil.com</span></li>
                <li className="flex items-center gap-2 text-gray-400 dark:text-gray-500"><Phone className="h-4 w-4 flex-shrink-0" /><span>(XX) XXXXX-XXXX</span></li>
                <li className="flex items-center gap-2 text-gray-400 dark:text-gray-500"><MapPin className="h-4 w-4 flex-shrink-0" /><span>Brasil</span></li>
              </ul>
              <div className="space-y-2 pt-2">
                <h4 className="font-medium text-base">Newsletter</h4>
                <form className="flex gap-2">
                  <Input type="email" placeholder="Seu e-mail" className="flex-1 bg-gray-800 dark:bg-slate-800 border-gray-700 dark:border-slate-700 text-sm placeholder:text-gray-500 focus:border-green-500" />
                  <Button size="sm" type="submit" className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white">Assinar</Button>
                </form>
              </div>
            </div>
          </div>
          <Separator className="my-8 bg-gray-800 dark:bg-slate-700" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-600">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link href="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link>
              <Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Política de Cookies</Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Shield className="h-4 w-4" />Site Seguro</span>
              <span className="flex items-center gap-1"><Globe className="h-4 w-4" />Português (Brasil)</span>
            </div>
          </div>
          <div className="text-center mt-6 text-xs text-gray-600 dark:text-gray-700">
            © {new Date().getFullYear()} Parques Brasil. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
