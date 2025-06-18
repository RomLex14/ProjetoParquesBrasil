export interface Waypoint {
  name: string;
  lat: number;
  lng: number;
}
export interface Parque {
  id: string;
  uuid: string;
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

export interface Trilhas {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  difficulty: "Fácil" | "Moderado" | "Difícil" | "Extrema";
  distance: number;
  duration: string;
  elevation: number;
  rating: number;
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
  waypoints?: Waypoint[]; // <-- NOVA PROPRIEDADE ADICIONADA
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