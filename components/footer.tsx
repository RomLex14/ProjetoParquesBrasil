// components/footer.tsx

import Link from "next/link"
import Image from "next/image" // <<< 1. IMPORTE O COMPONENTE DE IMAGEM
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Shield,
  Globe,
} from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white dark:bg-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            {/* <<< 2. ALTERAÇÃO DO ÍCONE >>> */}
            <div className="flex items-center gap-2">
              <Image src="/icon.png" alt="Logo Trilhas Brasil" width={32} height={32} />
              <span className="text-xl font-bold">Trilhas Brasil</span>
            </div>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              A plataforma mais completa para explorar os parques nacionais do Brasil. Descubra trilhas, planeje
              aventuras e conecte-se com a natureza.
            </p>
            <div className="flex space-x-1">
              <Button asChild size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                <Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5" /></Link>
              </Button>
              <Button asChild size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                <Link href="#" aria-label="Instagram"><Instagram className="h-5 w-5" /></Link>
              </Button>
              <Button asChild size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5" /></Link>
              </Button>
              <Button asChild size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                <Link href="#" aria-label="Youtube"><Youtube className="h-5 w-5" /></Link>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Explorar</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/trilhas" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">Trilhas</Link></li>
              <li><Link href="/parques" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">Parques</Link></li>
              <li><Link href="/map" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">Mapa Interativo</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ajuda" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">Central de Ajuda</Link></li>
              <li><Link href="/contato" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">Fale Conosco</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-400 dark:text-gray-500"><Mail className="h-4 w-4 flex-shrink-0" /><span>contato@trilhasbrasil.com</span></li>
              <li className="flex items-center gap-2 text-gray-400 dark:text-gray-500"><Phone className="h-4 w-4 flex-shrink-0" /><span>(XX) XXXXX-XXXX</span></li>
              <li className="flex items-center gap-2 text-gray-400 dark:text-gray-500"><MapPin className="h-4 w-4 flex-shrink-0" /><span>Brasil</span></li>
            </ul>
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
          © {new Date().getFullYear()} Trilhas Brasil. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}