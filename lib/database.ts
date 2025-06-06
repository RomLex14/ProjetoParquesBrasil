import { supabase } from '@/lib/supabase'
import type { Parque, Trilha } from '../lib/supabase'

// Funções para parques
export async function obterTodosParques() {
  const { data, error } = await supabase.from("parques").select("*").order("nome")

  if (error) {
    console.error("Erro ao buscar parques:", error)
    throw error
  }

  return data as Parque[]
}

export async function obterParquePorId(id: string) {
  const { data, error } = await supabase.from("parques").select("*").eq("id", id).single()

  if (error) {
    console.error(`Erro ao buscar parque com ID ${id}:`, error)
    throw error
  }

  return data as Parque
}

// Funções para trilhas
export async function obterTrilhasPorParque(parqueId: string) {
  const { data, error } = await supabase.from("trilhas").select("*").eq("parque_id", parqueId).order("nome")

  if (error) {
    console.error(`Erro ao buscar trilhas do parque ${parqueId}:`, error)
    throw error
  }

  return data as Trilha[]
}

export async function obterTrilhaPorId(id: string) {
  const { data, error } = await supabase.from("trilhas").select("*").eq("id", id).single()

  if (error) {
    console.error(`Erro ao buscar trilha com ID ${id}:`, error)
    throw error
  }

  return data as Trilha
}

// Função para buscar parques por região
export async function obterParquesPorRegiao(regiao: string) {
  const { data, error } = await supabase.from("parques").select("*").eq("regiao", regiao).order("nome")

  if (error) {
    console.error(`Erro ao buscar parques da região ${regiao}:`, error)
    throw error
  }

  return data as Parque[]
}

// Função para buscar trilhas por dificuldade
export async function obterTrilhasPorDificuldade(dificuldade: string) {
  const { data, error } = await supabase
    .from("trilhas")
    .select("*, parques(*)")
    .eq("dificuldade", dificuldade)
    .order("nome")

  if (error) {
    console.error(`Erro ao buscar trilhas com dificuldade ${dificuldade}:`, error)
    throw error
  }

  return data
}

