// app/layout.tsx

import { Inter, Lexend } from "next/font/google";
import type { Metadata } from 'next';
import "./globals.css";
import PWAInstallPrompt from "@/components/pwa-install-prompt"; 


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Trilhas Brasil",
  description: "Explore trilhas, parques nacionais e as paisagens mais incríveis do Brasil.",
  manifest: "/manifest.json",
  themeColor: "#059669",
  // CORREÇÃO: Mova as tags da Apple para dentro do objeto 'other'
  other: {
    'apple-web-app-capable': 'yes',
    'apple-web-app-status-bar-style': 'default',
    'apple-web-app-title': 'Trilhas Brasil',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className={`${inter.variable} ${lexend.variable}`}>
      <body>
        {children}
        <PWAInstallPrompt /> {/* <<< ADICIONE O COMPONENTE AQUI */}
      </body>
    </html>
  );
}