import { createClient } from "@supabase/supabase-js"

// Usando as variáveis de ambiente fornecidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jvozulhvujkalwyxbdqe.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2b3p1bGh2dWprYWx3eXhiZHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxODQ0OTcsImV4cCI6MjA1ODc2MDQ5N30.rGYmmMrQWVuZnZkjfwAfTETag1EiABIA8LIJUpJ98EA"

// Cria o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, 
    storageKey: "parques-brasil-auth", 
    autoRefreshToken: true, 
    detectSessionInUrl: true, 
  },
})

// Tipos para as tabelas
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

