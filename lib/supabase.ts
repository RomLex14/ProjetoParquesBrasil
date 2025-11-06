// lib/supabase.ts novo

import { createBrowserClient } from '@supabase/ssr'

// As variáveis de ambiente são lidas automaticamente pelo Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Função para criar um cliente Supabase que funciona no navegador (Client Components)
export const createClient = () => createBrowserClient(supabaseUrl, supabaseAnonKey)

// --- Seus tipos de dados permanecem os mesmos ---

export type Perfil = {
  id: string
  nome_usuario?: string
  nome_completo?: string
  biografia?: string
  url_avatar?: string
  localizacao?: string
  criado_em: string
  atualizado_em: string
}

export type Parque = {
  id: string
  nome: string
  descricao: string
  localizacao: string
  estado: string
  regiao: string
  url_imagem?: string
  criado_em: string
  atualizado_em: string
}

export type Trilha = {
  id: string
  parque_id: string
  nome: string
  descricao?: string
  dificuldade: "facil" | "moderada" | "dificil" | "extrema"
  distancia: number
  duracao: number
  url_imagem?: string
  criado_em: string
  atualizado_em: string
}