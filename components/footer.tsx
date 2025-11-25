// components/footer.tsx
import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Marca e Sobre */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              {/* Substituído o ícone Mountain pela logo do projeto */}
              <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                <Image 
                  src="/icon.png" 
                  alt="Logo Trilhas Brasil" 
                  fill
                  className="object-contain"
                />
              </div>
              <span>Trilhas<span className="text-primary">Brasil</span></span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Seu guia definitivo para explorar as belezas naturais do Brasil. 
              Descubra trilhas, parques e cachoeiras incríveis perto de você.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Explorar</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/map" className="hover:text-primary transition-colors">Mapa Interativo</Link>
              </li>
              <li>
                <Link href="/parques" className="hover:text-primary transition-colors">Parques Nacionais</Link>
              </li>
              <li>
                <Link href="/trilhas" className="hover:text-primary transition-colors">Melhores Trilhas</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">Minha Área</Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Suporte</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/ajuda" className="hover:text-primary transition-colors">Central de Ajuda</Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-primary transition-colors">Fale Conosco</Link>
              </li>
              <li>
                <Link href="/termos" className="hover:text-primary transition-colors">Termos de Uso</Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-primary transition-colors">Privacidade</Link>
              </li>
            </ul>
          </div>

          {/* Contato Rápido */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Contato</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>Taguatinga - DF<br />CEUB</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>trilhas.brasil.jrvy@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>(61) 9 9376-4675</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Trilhas Brasil. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com <span className="text-red-500">♥</span> para aventureiros
          </p>
        </div>
      </div>
    </footer>
  )
}