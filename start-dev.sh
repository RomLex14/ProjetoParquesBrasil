#!/bin/bash

# Iniciar o frontend Next.js
echo "Iniciando o frontend Next.js..."
npm run dev &
FRONTEND_PID=$!

# Função para encerrar os processos ao sair
function cleanup {
  echo "Encerrando processos..."
  # Verificar se o PID do frontend existe antes de tentar matar
  if kill -0 $FRONTEND_PID 2>/dev/null; then
    kill $FRONTEND_PID
  fi
  exit
}

# Capturar sinais de interrupção
trap cleanup SIGINT SIGTERM

# Manter o script em execução
echo "Frontend Next.js iniciado. Pressione Ctrl+C para encerrar."
wait $FRONTEND_PID