import { supabase } from '@/lib/supabase';
import { cache } from 'react';
import { Trilhas, Parque } from '@/lib/types';

// --- BUSCA DE PARQUES ---
export const getParques = cache(async (): Promise<Parque[]> => {
  // Agora consultamos a VIEW, que é simples e direta
  const { data, error } = await supabase
    .from('view_parques_app')
    .select('*')
    .order('nome');

  if (error) {
    console.error('Erro ao buscar parques:', error);
    return [];
  }

  return data.map((p: any) => ({
    ...p,
    imagem: p.url_imagem, // Mantendo compatibilidade com seu frontend
    trilhas: 0, 
  }));
});

// --- BUSCA DE TRILHAS (LISTAGEM) ---
export const getTrilhas = cache(async (): Promise<Trilhas[]> => {
  const { data, error } = await supabase
    .from('view_trilhas_app')
    .select('*');

  if (error) {
    console.error('Erro ao buscar trilhas:', error);
    return [];
  }

  return data.map((t: any) => ({
    id: t.id,
    parque_id: t.parque_id,
    name: t.nome,
    location: t.parque_nome || 'Localização desconhecida',
    description: t.descricao,
    imageUrl: t.url_imagem,
    difficulty: t.dificuldade,
    distance: Number(t.distancia),
    duration: `${t.duracao} horas`,
    elevation: t.ganho_elevacao,
    rating: 4.5, // Placeholder (média de reviews virá depois)
    reviews: [],
    coordinates: { lat: t.lat, lng: t.lng }
  }));
});

// --- BUSCA DE TRILHA POR ID (DETALHES) ---
export const getTrilhaById = cache(async (id: string): Promise<Trilhas | undefined> => {
  // 1. Busca os dados principais da View
  const { data: trilhaData, error: trilhaError } = await supabase
    .from('view_trilhas_app')
    .select('*')
    .eq('id', id)
    .single();

  if (trilhaError || !trilhaData) {
    console.error('Erro ao buscar detalhe da trilha:', trilhaError);
    return undefined;
  }

  // 2. Busca as avaliações separadamente (tabela real) para garantir relação correta
  const { data: reviewsData } = await supabase
    .from('avaliacoes')
    .select(`
      id, avaliacao, comentario, criado_em, imagens,
      perfis ( nome_completo, url_avatar )
    `)
    .eq('trilha_id', id);

  // Processa o GeoJSON para extrair coordenadas (se necessário para centralizar mapa)
  let centerCoords = { lat: trilhaData.lat, lng: trilhaData.lng };
  
  // Processa Avaliações
  const reviews = (reviewsData || []).map((av: any) => ({
    id: av.id,
    rating: av.avaliacao,
    content: av.comentario,
    date: new Date(av.criado_em).toLocaleDateString('pt-BR'),
    photos: av.imagens || [],
    user: {
      name: av.perfis?.nome_completo || 'Anônimo',
      avatar: av.perfis?.url_avatar || '/placeholder-user.jpg'
    }
  }));

  return {
    id: trilhaData.id,
    parque_id: trilhaData.parque_id,
    name: trilhaData.nome,
    location: `${trilhaData.parque_nome}, ${trilhaData.parque_estado}`,
    description: trilhaData.descricao,
    imageUrl: trilhaData.url_imagem,
    images: trilhaData.url_imagem ? [trilhaData.url_imagem] : [],
    difficulty: trilhaData.dificuldade,
    distance: Number(trilhaData.distancia),
    duration: `${trilhaData.duracao} horas`,
    elevation: trilhaData.ganho_elevacao,
    rating: 4.8, 
    reviews: reviews,
    coordinates: centerCoords,
    // Opcional: passar o path_geojson para o componente de mapa desenhar a linha
    // path: JSON.parse(trilhaData.path_geojson) 
    bestSeason: "Maio a Setembro",
    terrainType: "Misto",
    mobileSignal: "Parcial"
  };
});