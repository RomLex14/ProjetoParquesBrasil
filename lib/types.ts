// lib/types.ts

export interface Waypoint {
  name: string;
  lat: number;
  lng: number;
}

export interface Parque {
  id: string;
  uuid?: string; // Opcional para compatibilidade com dados antigos ou IDs externos
  nome: string;
  estado: string;
  localizacao: string;
  area: string;
  trilhas: number;
  visitantes: string;
  rating: number;
  imagem: string;
  descricao: string;
  destaque: boolean;
}

export interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  date: string;
  content: string;
  photos?: string[];
}

export interface Trilhas {
  id: string;
  parque_id: string; // Identificador do parque
  name: string;
  location: string;
  description: string;
  imageUrl: string;     // Imagem de capa principal
    // Nova propriedade para o carrossel de imagens
  // Opcional (?) para não quebrar dados antigos imediatamente, 
  // mas recomendado preencher em todas.
  images: string[];
  difficulty: "Fácil" | "Moderado" | "Difícil" | "Extrema"; 
  distance: number;
  duration: string;
  elevation: number;
  rating: number;  
  // Lista de avaliações. 
  // No data.ts, você deve passar um array vazio [] se não houver reviews ainda.
  reviews: Review[];  
  // Coordenadas para ponto único (marcador no mapa)
  coordinates?: {
    lat: number;
    lng: number;
  };  
  // Caminho para desenhar a linha da trilha (array de pontos)
  path?: Array<{
    lat: number;
    lng: number;
  }>;
  
  waypoints?: Waypoint[];
  
  // Propriedade calculada dinamicamente (não precisa estar no data.ts)
  distancia_usuario?: number; 

  // --- NOVOS CAMPOS PARA INFORMAÇÕES DETALHADAS ---
  // Adicionados para enriquecer a página de detalhes da trilha
  bestSeason?: string;      // Melhor época (ex: "Maio a Setembro")
  terrainType?: string;     // Tipo de terreno (ex: "Pedregoso")
  mobileSignal?: "Excelente" | "Bom" | "Parcial" | "Ruim" | "Inexistente";
  tips?: string;            // Dicas específicas (ex: "Leve dinheiro em espécie")
}

// Tipos para o Banco de Dados (Supabase) - Opcional se você usar direto no componente
export interface Perfil {
  xp: number;
  id: string;
  nome_usuario?: string | null;
  nome_completo?: string | null;
  biografia?: string | null;
  url_avatar?: string | null;
  localizacao?: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface Avaliacao {
  id: string;
  usuario_id: string;
  parque_id?: string | null;
  trilha_id?: string | null;
  avaliacao: number;
  comentario?: string | null;
  data_visita?: string | null;
  imagens?: string[] | null;
  criado_em: string;
  atualizado_em: string;
}

// Tipo composto para avaliações com dados do perfil (join)
export interface AvaliacaoComPerfil extends Avaliacao {
  perfis: Pick<Perfil, "nome_completo" | "nome_usuario" | "url_avatar"> | null;
}