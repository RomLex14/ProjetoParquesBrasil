// components/pwa-install-prompt.tsx

"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Download } from "lucide-react"

// Define a interface para o evento, pois o TypeScript padrão não o conhece
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export default function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      // Previne o mini-infobar do Chrome de aparecer
      event.preventDefault()
      // Guarda o evento para que ele possa ser acionado mais tarde.
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Limpeza do listener quando o componente é desmontado
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) {
      return
    }

    // Mostra o prompt de instalação
    await installPrompt.prompt()

    // Espera o usuário responder ao prompt
    const { outcome } = await installPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)

    // Limpa o prompt, pois ele só pode ser usado uma vez
    setInstallPrompt(null)
  }

  // Não renderiza nada se o prompt de instalação não estiver disponível
  if (!installPrompt) {
    return null
  }

  return (
    <Dialog open={!!installPrompt} onOpenChange={() => setInstallPrompt(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Instalar o Aplicativo
          </DialogTitle>
          <DialogDescription>
            Tenha uma experiência melhor instalando o Trilhas Brasil na sua tela inicial. É rápido e não ocupa
            espaço!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" className="sm:w-full" onClick={() => setInstallPrompt(null)}>
            Agora não
          </Button>
          <Button className="sm:w-full" onClick={handleInstallClick}>
            Instalar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}