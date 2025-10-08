// app/layout.tsx

import { Inter, Lexend } from "next/font/google"
import type { Metadata } from 'next'
import "./globals.css"
import PWAInstallPrompt from "@/components/pwa-install-prompt"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
})

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: "Trilhas Brasil",
  description: "Explore trilhas, parques nacionais e as paisagens mais incríveis do Brasil.",
  manifest: "/manifest.json",
  themeColor: "#059669",
  other: {
    'apple-web-app-capable': 'yes',
    'apple-web-app-status-bar-style': 'default',
    'apple-web-app-title': 'Trilhas Brasil',
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className={`${inter.variable} ${lexend.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <PWAInstallPrompt />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}