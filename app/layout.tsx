import { Inter, Lexend } from "next/font/google"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", // Cria uma variável CSS para a fonte
})

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend", // Cria uma variável CSS para a fonte
  weight: ['400', '500', '600', '700'], // Importa pesos diferentes
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className={`${inter.variable} ${lexend.variable}`}>
      <body>{children}</body>
    </html>
  )
}