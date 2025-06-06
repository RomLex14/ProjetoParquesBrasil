import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Explorador de Trilhas",
  description: "Descubra, acompanhe e compartilhe trilhas incríveis",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>{/* Leaflet CSS will be imported client-side */}</head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
