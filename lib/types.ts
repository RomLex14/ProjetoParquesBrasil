// lib/types.ts

export interface Trilhas {
  id: string;
  name: string; // Nome da trilha
  location: string; 
  description: string;
  imageUrl: string;
  difficulty: "Fácil" | "Moderado" | "Difícil" | "Extrema"; 
  distance: number; // em km
  duration: string; // Ex: "2-3 horas"
  elevation: number; // em metros
  rating: number; // Ex: 4.7
  reviews: Review[];
  coordinates?: { 
    lat: number;
    lng: number;
  };
  path?: Array<{ 
    lat: number;
    lng: number;
  }>;
  parque_id: string;
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

export interface Perfil {
  id: string;
  nome_usuario?: string | null;
  nome_completo?: string | null;
  biografia?: string | null;
  url_avatar?: string | null;
  localizacao?: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface Parque { 
  id: string;
  nome: string;

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

export interface AvaliacaoComPerfil extends Avaliacao {
  perfis: Pick<Perfil, "nome_completo" | "nome_usuario" | "url_avatar"> | null;
}
