// lib/data.ts
import type { Trilhas, Review } from "./types";
import { calculateDistance } from "./weather-service";

// --- IDs ÚNICOS PARA OS PARQUES ---
const PARQUE_NACIONAL_BRASILIA_ID = "7a103b3b-d434-4da6-88df-687df60043da";
const PARQUE_ESTADUAL_PIRENEUS_ID = "33d94de9-008d-4337-a300-62637c8ba278";
const PARQUE_NACIONAL_CHAPADA_VEADEIROS_ID = "f99ad11e-4242-4024-86b6-1ba840b55c25";
const PARQUE_NACIONAL_IGUACU_ID = "b2c3d4e5-f6a7-8901-2345-67890abcdef1";
const PARQUE_NACIONAL_SERRA_CANASTRA_ID = "a1b2c3d4-e5f6-7890-1234-567890abcdef";

// --- DADOS DOS PARQUES ---
export const parques = [
  {
    id: "1", // ID simples para a URL, ex: /parques/1
    uuid: PARQUE_NACIONAL_BRASILIA_ID,
    nome: "Parque Nacional de Brasília",
    estado: "Distrito Federal",
    localizacao: "Brasília, DF",
    area: "42.389 hectares",
    trilhas: 2,
    visitantes: "150k/ano",
    rating: 4.7,
    imagem: "/images/parques/parquenacional.jpg", // Sugestão de novo caminho
    descricao: "Conhecido como Água Mineral, o parque protege ecossistemas do Cerrado e abriga as famosas piscinas de água corrente, além de duas trilhas para caminhada.",
    destaque: true,
  },
  {
    id: "2",
    uuid: PARQUE_NACIONAL_CHAPADA_VEADEIROS_ID,
    nome: "Parque Nacional da Chapada dos Veadeiros",
    estado: "Goiás",
    localizacao: "Alto Paraíso de Goiás, GO",
    area: "240.611 hectares",
    trilhas: 1,
    visitantes: "80k/ano",
    rating: 4.9,
    imagem: "/images/parques/chapada.jpg",
    descricao: "Patrimônio Mundial Natural da UNESCO, famoso por seus cânions, cachoeiras espetaculares e formações de quartzo com mais de um bilhão de anos.",
    destaque: true,
  },
  {
    id: "3",
    uuid: PARQUE_NACIONAL_SERRA_CANASTRA_ID,
    nome: "Parque Nacional da Serra da Canastra",
    estado: "Minas Gerais",
    localizacao: "São Roque de Minas, MG",
    area: "71.525 hectares",
    trilhas: 0, // 0 pois não há trilhas mockadas com este ID
    visitantes: "180k/ano",
    rating: 4.8,
    imagem: "/images/parques/canastra.jpg",
    descricao: "Nascente do Rio São Francisco e paisagens únicas do cerrado, com cachoeiras como a Casca d'Anta.",
    destaque: false,
  },
  {
    id: "4",
    uuid: PARQUE_NACIONAL_IGUACU_ID,
    nome: "Parque Nacional do Iguaçu",
    estado: "Paraná",
    localizacao: "Foz do Iguaçu, PR",
    area: "185.262 hectares",
    trilhas: 0,
    visitantes: "1.8M/ano",
    rating: 4.9,
    imagem: "/images/parques/iguacu.jpg",
    descricao: "Lar das famosas Cataratas do Iguaçu, uma das Sete Maravilhas Naturais do Mundo.",
    destaque: true,
  },
  {
    id: "5",
    uuid: PARQUE_ESTADUAL_PIRENEUS_ID,
    nome: "Parque Estadual dos Pireneus",
    estado: "Goiás",
    localizacao: "Pirenópolis, GO",
    area: "2.833 hectares",
    trilhas: 1,
    visitantes: "50k/ano",
    rating: 4.8,
    imagem: "/images/parques/pireneus.jpg",
    descricao: "Unidade de conservação que protege o ponto mais alto da região, com mirantes, formações rochosas e vegetação de cerrado rupestre.",
    destaque: false,
  },
];

// --- DADOS DAS TRILHAS ---
export const featuredTrails: Trilhas[] = [
  // ... (Seus dados de trilhas existentes, conforme você enviou)
  {
    id: "6b97fd34-dd97-45d6-a825-84f2a9001771",
    parque_id: PARQUE_NACIONAL_BRASILIA_ID,
    name: "Trilha da Cachoeira do Tororó",
    location: "Santa Maria, Distrito Federal",
    description: "Uma trilha encantadora que leva a uma das cachoeiras mais bonitas do DF. O percurso é de dificuldade moderada e termina em uma queda d'água refrescante, perfeita para um mergulho após a caminhada.",
    imageUrl: "/images/trilhas/tororo.jpg",
    difficulty: "Moderado",
    distance: 5.2,
    duration: "2-3 horas",
    elevation: 180,
    rating: 4.7,
    coordinates: { lat: -15.9647, lng: -47.9977 },
    path: [ { lat: -15.9647, lng: -47.9977 }, { lat: -15.9657, lng: -47.9967 }, { lat: -15.9667, lng: -47.9957 }, { lat: -15.9677, lng: -47.9947 }, { lat: -15.9687, lng: -47.9937 }, { lat: -15.9697, lng: -47.9927 }, ],
    reviews: [ { id: "review-uuid-001", user: { name: "Marcelo Alves", avatar: "/placeholder-images/avatar-marcelo.jpg", }, rating: 5, date: "12 de março de 2024", content: "Trilha incrível! A cachoeira no final compensa todo o esforço. Recomendo ir cedo para evitar o movimento que aumenta bastante nos finais de semana. A água estava deliciosa e conseguimos aproveitar bastante.", photos: [ "/placeholder-images/review-tororo-1.jpg", "/placeholder-images/review-tororo-2.jpg", ], }, { id: "review-uuid-002", user: { name: "Juliana Costa", avatar: "/placeholder-images/avatar-juliana.jpg", }, rating: 4, date: "28 de fevereiro de 2024", content: "Trilha bem sinalizada e de dificuldade média. Alguns trechos são um pouco íngremes, mas nada muito difícil. A cachoeira é linda e vale cada passo. Leve água e protetor solar!", }, ],
  },
  {
    id: "ba2b1c8c-4045-4a42-8475-89b135960ae6",
    parque_id: PARQUE_NACIONAL_BRASILIA_ID,
    name: "Trilha da Chapada Imperial",
    location: "Brazlândia, Distrito Federal",
    description: "A maior reserva particular do DF oferece diversas trilhas em meio à vegetação preservada do cerrado. Com várias cachoeiras e mirantes, é possível observar uma rica biodiversidade durante o percurso.",
    imageUrl: "/images/trilhas/imperial.jpg",
    difficulty: "Fácil",
    distance: 3.8,
    duration: "1-2 horas",
    elevation: 120,
    rating: 4.8,
    coordinates: { lat: -15.7801, lng: -48.1223 },
    path: [ /* Adicione o path da trilha aqui */ ],
    reviews: [ { id: "review-uuid-003", user: { name: "Pedro Mendes", avatar: "/placeholder-images/avatar-pedro.jpg", }, rating: 5, date: "15 de janeiro de 2024", content: "Lugar maravilhoso! As trilhas são bem cuidadas e os guias são muito atenciosos. Vimos várias espécies de pássaros e até um tamanduá! As cachoeiras são lindas e a vista do mirante é de tirar o fôlego. Recomendo para toda a família.", }, ],
  },
  {
    id: "5f23719b-13d0-401f-809e-9b218800b5dd",
    parque_id: PARQUE_NACIONAL_BRASILIA_ID,
    name: "Trilha do Poço Azul",
    location: "Brazlândia, Distrito Federal",
    description: "Uma das trilhas mais populares do DF, o Poço Azul encanta com suas águas cristalinas de cor azul intensa. A trilha é relativamente curta, mas o terreno irregular exige atenção. A recompensa é um mergulho refrescante.",
    imageUrl: "/images/trilhas/pocoazul.jpg",
    difficulty: "Moderado",
    distance: 2.5,
    duration: "1 hora",
    elevation: 90,
    rating: 4.6,
    coordinates: { lat: -15.7721, lng: -48.1982 },
    path: [ /* Adicione o path da trilha aqui */ ],
    reviews: [ { id: "review-uuid-004", user: { name: "Camila Rodrigues", avatar: "/placeholder-images/avatar-camila.jpg", }, rating: 5, date: "22 de dezembro de 2023", content: "O Poço Azul é simplesmente incrível! A cor da água é surreal, parece uma piscina natural. A trilha é curta mas tem algumas partes escorregadias, então é bom ir com calçado adequado. Fomos em um dia de semana e estava tranquilo, conseguimos aproveitar bastante.", }, ],
  },
  {
    id: "0548f4dd-e29c-4121-8415-b1c114befab1",
    parque_id: PARQUE_ESTADUAL_PIRENEUS_ID,
    name: "Trilha da Serra dos Pireneus (Pico)",
    location: "Pirenópolis, Goiás",
    description: "A apenas 150km de Brasília, esta trilha oferece vistas panorâmicas incríveis do alto da Serra dos Pireneus. O pico dos Pireneus é o ponto culminante da região e proporciona um nascer do sol inesquecível.",
    imageUrl: "/images/trilhas/pirineus.jpg",
    difficulty: "Difícil",
    distance: 8.5,
    duration: "4-5 horas",
    elevation: 520,
    rating: 4.9,
    coordinates: { lat: -15.7899, lng: -48.8292 },
    path: [ /* Adicione o path da trilha aqui */ ],
    reviews: [],
  },
  {
    id: "e8ecf5cc-4d24-409d-972b-96facb8ad024",
    parque_id: PARQUE_NACIONAL_CHAPADA_VEADEIROS_ID,
    name: "Trilha do Vale da Lua",
    location: "Alto Paraíso de Goiás, Chapada dos Veadeiros, Goiás",
    description: "Uma das atrações mais famosas da Chapada dos Veadeiros, o Vale da Lua impressiona com suas formações rochosas esculpidas pela água ao longo de milhões de anos. A trilha é curta mas o local é mágico.",
    imageUrl: "/images/trilhas/valedalua.jpg",
    difficulty: "Moderado",
    distance: 1.8,
    duration: "1 hora",
    elevation: 50,
    rating: 4.8,
    coordinates: { lat: -14.180, lng: -47.796 },
    path: [ /* Adicione o path da trilha aqui */ ],
    reviews: [],
  },
];

// --- FUNÇÕES PARA BUSCAR DADOS MOCKADOS ---

export function getParkById(id?: string) {
  if (!id) return undefined;
  return parques.find((parque) => parque.id === id);
}

export function getTrailsByParkId(parkUUID?: string) {
  if (!parkUUID) return [];
  return featuredTrails.filter((trail) => trail.parque_id === parkUUID);
}

export function getTrailById(id?: string): Trilhas | undefined {
  if (!id) return undefined;
  return featuredTrails.find((trail) => trail.id === id);
}

export function getNearbyTrails(userLat?: number | null, userLng?: number | null): Trilhas[] {
  if (userLat === undefined || userLat === null || userLng === undefined || userLng === null) {
    return featuredTrails
      .filter((trail) => trail.location.includes("Distrito Federal"))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  }
  return [...featuredTrails]
    .map((trail) => {
      if (trail.coordinates) {
        const realDistance = calculateDistance(userLat, userLng, trail.coordinates.lat, trail.coordinates.lng);
        return { ...trail, realDistance };
      }
      return { ...trail, realDistance: Infinity };
    })
    .sort((a, b) => a.realDistance - b.realDistance)
    .slice(0, 6);
}

export function getTopRatedTrails(): Trilhas[] {
  return [...featuredTrails].sort((a, b) => b.rating - a.rating).slice(0, 6);
}

export function getPopularTrails(): Trilhas[] {
  return [...featuredTrails].sort((a, b) => b.reviews.length - a.reviews.length).slice(0, 6);
}