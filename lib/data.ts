// lib/data.ts
import type { Trilhas, Parque } from "./types";
import { calculateDistance } from "./weather-service";

// --- IDs DOS PARQUES ---
const PARQUE_NACIONAL_BRASILIA_ID = "7a103b3b-d434-4da6-88df-687df60043da";
const PARQUE_NACIONAL_CHAPADA_VEADEIROS_ID = "f99ad11e-4242-4024-86b6-1ba840b55c25";
const PARQUE_ESTADUAL_PIRENEUS_ID = "33d94de9-008d-4337-a300-62637c8ba278";
const PARQUE_ECOLOGICO_BERNARDO_SAYAO_ID = "b1234567-d434-4da6-88df-687df60043da";
const JARDIM_BOTANICO_BRASILIA_ID = "c9876543-d434-4da6-88df-687df60043db";
const RESERVA_CHAPADA_IMPERIAL_ID = "d5678901-d434-4da6-88df-687df60043dc";
const RESERVA_BIOLOGICA_CONTAGEM_ID = "e2345678-d434-4da6-88df-687df60043dd";
const PARQUE_MUNICIPAL_ITIQUIRA_ID = "f3456789-d434-4da6-88df-687df60043de"; 
const RESERVA_PICO_RONCADOR_ID = "a4567890-d434-4da6-88df-687df60043df"; 
const PARQUE_DA_CIDADE_SARAH_KUBITSCHEK_ID = "parque-da-cidade-sarah-kubitschek";
const PARQUE_ECOLOGICO_AGUAS_CLARAS_ID = "parque-ecologico-aguas-claras";
const PARQUE_BURLE_MARX_ID = "parque-burle-marx";
const PARQUE_BOSQUE_SUDOESTE_ID = "parque-bosque-sudoeste";
const PARQUE_CHICO_MENDES_ID = "parque-chico-mendes";
const LAGO_DO_DESCOBERTO_ID = "lago-do-descoberto";
const LAGO_PARANOA_ID = "lago-paranoa";
const PARQUE_ESTADUAL_TERRA_RONCA_ID = "terra-ronca-id";

// --- DADOS DOS PARQUES ---
export const parques: Parque[] = [
    {
        id: "1",
        uuid: PARQUE_NACIONAL_BRASILIA_ID,
        nome: "Parque Nacional de Brasília",
        estado: "Distrito Federal",
        localizacao: "Brasília, DF",
        area: "42.389 hectares",
        trilhas: 6,
        visitantes: "150k/ano",
        rating: 4.7,
        imagem: "/images/parques/parquenacional.jpg",
        descricao: "Conhecido como Água Mineral, protege ecossistemas do Cerrado e abriga piscinas de água corrente e trilhas como a Cristal Água e Capivara.",
        destaque: true,
    },
    {
        id: "2",
        uuid: PARQUE_NACIONAL_CHAPADA_VEADEIROS_ID,
        nome: "Parque Nacional da Chapada dos Veadeiros",
        estado: "Goiás",
        localizacao: "Alto Paraíso de Goiás, GO",
        area: "240.611 hectares",
        trilhas: 8,
        visitantes: "70k/ano",
        rating: 4.9,
        imagem: "/images/parques/chapada.jpg",
        descricao: "Patrimônio Mundial Natural da UNESCO. Lar de cânions, cachoeiras impressionantes e trilhas desafiadoras como as Sete Quedas.",
        destaque: true,
    },
    {
        id: "3",
        uuid: PARQUE_ECOLOGICO_BERNARDO_SAYAO_ID,
        nome: "Parque Ecológico Bernardo Sayão",
        estado: "Distrito Federal",
        localizacao: "Lago Sul, DF",
        area: "1.600 hectares",
        trilhas: 1,
        visitantes: "20k/ano",
        rating: 4.5,
        imagem: "/images/trilhas/aguamineral.jpg", // Placeholder realista
        descricao: "Localizado no Lago Sul, oferece trilhas em meio à mata de galeria e cerrado, com nascentes e fauna local preservada.",
        destaque: false,
    },
    {
        id: "4",
        uuid: JARDIM_BOTANICO_BRASILIA_ID,
        nome: "Jardim Botânico de Brasília",
        estado: "Distrito Federal",
        localizacao: "Lago Sul, DF",
        area: "5.000 hectares",
        trilhas: 1,
        visitantes: "100k/ano",
        rating: 4.8,
        imagem: "/images/trilhas/aguamineral.jpg", 
        descricao: "Área preservada com jardins temáticos e trilhas ecológicas educativas. Excelente para caminhadas leves e piqueniques.",
        destaque: false,
    },
    {
        id: "5",
        uuid: RESERVA_CHAPADA_IMPERIAL_ID,
        nome: "Reserva Chapada Imperial",
        estado: "Distrito Federal",
        localizacao: "Brazlândia, DF",
        area: "Reserva Particular",
        trilhas: 1,
        visitantes: "Limitado",
        rating: 4.8,
        imagem: "/images/trilhas/imperial.jpg",
        descricao: "Santuário ecológico particular com mais de 30 cachoeiras e trilhas que passam por diversos biomas do cerrado.",
        destaque: true,
    },
    {
        id: "6",
        uuid: PARQUE_ESTADUAL_PIRENEUS_ID,
        nome: "Parque Estadual dos Pireneus",
        estado: "Goiás",
        localizacao: "Pirenópolis, GO",
        area: "2.833 hectares",
        trilhas: 1,
        visitantes: "High season",
        rating: 4.9,
        imagem: "/images/trilhas/pirineus.jpg",
        descricao: "Abriga o Pico dos Pireneus, ponto culminante da região, com formações rochosas de quartzito e vegetação rupestre.",
        destaque: false,
    },
    {
        id: "7",
        uuid: RESERVA_BIOLOGICA_CONTAGEM_ID,
        nome: "Reserva Biológica da Contagem",
        estado: "Distrito Federal",
        localizacao: "Sobradinho/Fercal, DF",
        area: "3.460 hectares",
        trilhas: 1, 
        visitantes: "Moderado",
        rating: 4.5,
        imagem: "/images/trilhas/pocoazul.jpg",
        descricao: "Região de relevo acidentado e grande beleza cênica, onde se localiza o atrativo do Poço Azul.",
        destaque: false,
    },
    {
        id: "8",
        uuid: PARQUE_MUNICIPAL_ITIQUIRA_ID,
        nome: "Região do Itiquira / Formosa",
        estado: "Goiás",
        localizacao: "Formosa, GO",
        area: "Vasta",
        trilhas: 1,
        visitantes: "Alto",
        rating: 4.7,
        imagem: "/images/trilhas/aguamineral.jpg", 
        descricao: "Região famosa pelo Salto do Itiquira e diversas outras cachoeiras como a do Indaiá, com trilhas para todos os níveis.",
        destaque: false,
    },
    {
        id: "9",
        uuid: PARQUE_DA_CIDADE_SARAH_KUBITSCHEK_ID,
        nome: "Parque da Cidade Sarah Kubitschek",
        estado: "Distrito Federal",
        localizacao: "Asa Sul, Brasília",
        area: "420 hectares",
        trilhas: 2,
        visitantes: "Muito Alto",
        rating: 4.8,
        imagem: "/images/trilhas/aguamineral.jpg",
        descricao: "Um dos maiores parques urbanos do mundo, ideal para lazer, esportes e caminhadas.",
        destaque: false,
    }
];

// --- DADOS DAS TRILHAS (CATÁLOGO COMPLETO ATUALIZADO) ---
export const featuredTrails: Trilhas[] = [
  // --- NÍVEL FÁCIL ---

  // 1. Trilha Bernardo Sayão
  {
    id: "bernardo-sayao",
    parque_id: PARQUE_ECOLOGICO_BERNARDO_SAYAO_ID,
    name: "Trilha Bernardo Sayão",
    location: "Parque Ecológico Bernardo Sayão, Lago Sul",
    description: "A trilha, ideal para iniciantes, passa por áreas planas com curvas e rampas leves, oferecendo uma introdução ao estilo 'singletrack'. Atenção aos galhos e troncos! O parque preserva fauna e flora do Cerrado e abriga a nascente do Córrego Rasgado.",
    imageUrl: "/images/trilhas/aguamineral.jpg", 
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Fácil",
    distance: 12.0,
    duration: "Cerca de 2 horas",
    elevation: 29,
    rating: 4.5,
    reviews: [],
    coordinates: { lat: -15.867000, lng: -47.830000 },
    
    bestSeason: "Ano todo",
    terrainType: "Terra batida e singletrack",
    mobileSignal: "Bom",
    tips: "Ótima para quem está começando no Mountain Bike. Cuidado com raízes expostas em alguns trechos de mata fechada. Leve repelente.",

    path: [ 
        { lat: -15.867000, lng: -47.830000 }, { lat: -15.867500, lng: -47.830500 }, { lat: -15.868000, lng: -47.831000 },
        { lat: -15.868500, lng: -47.831500 }, { lat: -15.869000, lng: -47.832000 }, { lat: -15.869500, lng: -47.832500 },
        { lat: -15.870000, lng: -47.833000 }, { lat: -15.870500, lng: -47.833500 }, { lat: -15.871000, lng: -47.834000 },
        { lat: -15.871500, lng: -47.834500 }, { lat: -15.872000, lng: -47.835000 }, { lat: -15.871500, lng: -47.835500 },
        { lat: -15.871000, lng: -47.836000 }, { lat: -15.870500, lng: -47.836500 }, { lat: -15.870000, lng: -47.837000 },
        { lat: -15.869500, lng: -47.836500 }, { lat: -15.869000, lng: -47.836000 }, { lat: -15.868500, lng: -47.835500 },
        { lat: -15.868000, lng: -47.835000 }, { lat: -15.867000, lng: -47.834000 }, { lat: -15.867000, lng: -47.830000 }
    ]
  },

  // 2. Trilha Cristal Água
  {
    id: "cristal-agua",
    parque_id: PARQUE_NACIONAL_BRASILIA_ID,
    name: "Trilha Cristal Água",
    location: "Parque Nacional de Brasília",
    description: "Percurso plano com estrada de terra; possibilidade de trecho escorregadio entre os km 10 e 12. Ideal para iniciantes, com paradas para contemplação na beira do córrego Cristal e possibilidade de banho nas piscinas naturais do parque.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Fácil",
    distance: 18.0,
    duration: "3 horas",
    elevation: 293,
    rating: 4.6,
    reviews: [],
    coordinates: { lat: -15.715000, lng: -47.940000 },

    bestSeason: "Maio a Setembro",
    terrainType: "Estrada de terra e areia",
    mobileSignal: "Parcial",
    tips: "A trilha é longa, então leve bastante água (pelo menos 2L). Há trechos com areia fofa que exigem mais esforço físico se estiver de bicicleta. Chegue cedo para aproveitar o banho nas piscinas depois.",

    path: [
        { lat: -15.715000, lng: -47.940000 }, { lat: -15.714000, lng: -47.941000 }, { lat: -15.713000, lng: -47.942000 },
        { lat: -15.712000, lng: -47.943000 }, { lat: -15.711000, lng: -47.944000 }, { lat: -15.710000, lng: -47.945000 },
        { lat: -15.709000, lng: -47.946000 }, { lat: -15.708000, lng: -47.947000 }, { lat: -15.707000, lng: -47.948000 },
        { lat: -15.706000, lng: -47.949000 }, { lat: -15.705000, lng: -47.950000 }, { lat: -15.704000, lng: -47.949000 },
        { lat: -15.703000, lng: -47.948000 }, { lat: -15.702000, lng: -47.947000 }, { lat: -15.701000, lng: -47.946000 },
        { lat: -15.700000, lng: -47.945000 }, { lat: -15.701000, lng: -47.944000 }, { lat: -15.702000, lng: -47.943000 },
        { lat: -15.703000, lng: -47.942000 }, { lat: -15.704000, lng: -47.941000 }, { lat: -15.705000, lng: -47.940000 },
        { lat: -15.706000, lng: -47.939000 }, { lat: -15.707000, lng: -47.938000 }, { lat: -15.708000, lng: -47.937000 },
        { lat: -15.715000, lng: -47.940000 }
    ]
  },

  // 3. Trilha do Santuário Dom Bosco
  {
    id: "dom-bosco",
    parque_id: "santuario-dom-bosco", 
    name: "Trilha do Santuário Dom Bosco",
    location: "Santuário Dom Bosco, Asa Sul",
    description: "Caminhada simples até o Santuário Dom Bosco, com vistas para o Lago Paranoá.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Fácil",
    distance: 3.0,
    duration: "1-2 horas",
    elevation: 20,
    rating: 4.4,
    reviews: [],
    coordinates: { lat: -15.830000, lng: -47.900000 },

    bestSeason: "Ano todo",
    terrainType: "Calçada e terra batida",
    mobileSignal: "Excelente",
    tips: "Ideal para um passeio de fim de tarde para ver o pôr do sol no lago. Muito acessível e segura.",

    path: [
        { lat: -15.830000, lng: -47.900000 }, { lat: -15.830500, lng: -47.900500 }, { lat: -15.831000, lng: -47.901000 },
        { lat: -15.831500, lng: -47.901500 }, { lat: -15.832000, lng: -47.902000 }, { lat: -15.832500, lng: -47.902500 },
        { lat: -15.833000, lng: -47.903000 }, { lat: -15.833500, lng: -47.903500 }, { lat: -15.834000, lng: -47.904000 },
        { lat: -15.834500, lng: -47.904500 }, { lat: -15.835000, lng: -47.905000 }, { lat: -15.834500, lng: -47.905500 },
        { lat: -15.834000, lng: -47.906000 }, { lat: -15.833500, lng: -47.905500 }, { lat: -15.833000, lng: -47.905000 },
        { lat: -15.832500, lng: -47.904500 }, { lat: -15.832000, lng: -47.904000 }, { lat: -15.831500, lng: -47.903500 },
        { lat: -15.831000, lng: -47.903000 }, { lat: -15.830500, lng: -47.902500 }, { lat: -15.830000, lng: -47.900000 }
    ]
  },

  // 4. Trilha Jardim Botânico
  {
    id: "jardim-botanico",
    parque_id: JARDIM_BOTANICO_BRASILIA_ID,
    name: "Trilha Jardim Botânico",
    location: "Jardim Botânico de Brasília",
    description: "Trilha plana, ideal para iniciantes e crianças, com pequenas subidas e trechos escorregadios quando úmido. O trajeto percorre o cerrado preservado do Jardim Botânico. Entrada gratuita para ciclistas entre 7h30 e 8h50; taxa de R$5 após esse horário.",
    imageUrl: "/images/trilhas/aguamineral.jpg", 
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Fácil",
    distance: 13.0,
    duration: "2 horas",
    elevation: 50,
    rating: 4.7,
    reviews: [],
    coordinates: { lat: -15.875000, lng: -47.850000 },

    bestSeason: "Ano todo (Manhã)",
    terrainType: "Terra batida",
    mobileSignal: "Bom",
    tips: "Aproveite para tomar café da manhã no bistrô do Jardim Botânico após a trilha. Chegue cedo para evitar o sol forte e aproveitar a entrada gratuita para ciclistas.",

    path: [
        { lat: -15.875000, lng: -47.850000 }, { lat: -15.876000, lng: -47.851000 }, { lat: -15.877000, lng: -47.852000 },
        { lat: -15.878000, lng: -47.853000 }, { lat: -15.879000, lng: -47.854000 }, { lat: -15.880000, lng: -47.855000 },
        { lat: -15.881000, lng: -47.856000 }, { lat: -15.882000, lng: -47.857000 }, { lat: -15.883000, lng: -47.858000 },
        { lat: -15.884000, lng: -47.859000 }, { lat: -15.885000, lng: -47.860000 }, { lat: -15.884000, lng: -47.861000 },
        { lat: -15.883000, lng: -47.862000 }, { lat: -15.882000, lng: -47.861000 }, { lat: -15.881000, lng: -47.860000 },
        { lat: -15.880000, lng: -47.859000 }, { lat: -15.879000, lng: -47.858000 }, { lat: -15.878000, lng: -47.857000 },
        { lat: -15.877000, lng: -47.856000 }, { lat: -15.876000, lng: -47.855000 }, { lat: -15.875000, lng: -47.854000 },
        { lat: -15.874000, lng: -47.853000 }, { lat: -15.875000, lng: -47.850000 }
    ]
  },

  // 5. Trilha Tororó
  {
    id: "tororo-001",
    parque_id: PARQUE_NACIONAL_BRASILIA_ID,
    name: "Trilha Tororó",
    location: "Setor Habitacional Tororó",
    description: "Trilha em estrada de terra com terreno plano, ideal para iniciantes. Passa por chácaras e plantações, com visual cerrado. Possui um acesso a pé para a cachoeira do Tororó, recomendada para descanso e contemplação. Localizado a cerca de 50 km de Brasília, este ponto é ideal para quem gosta de rapel e mountain bike. A trilha que leva à cachoeira de 18 metros é curta e rica em biodiversidade, fazendo dela uma ótima opção para famílias e aventureiros. Melhor época: Durante a seca.",
    imageUrl: "/images/trilhas/tororo.jpg",
    images: ["/images/trilhas/tororo.jpg", "/images/trilhas/tororo.jpg", "/images/trilhas/tororo.jpg"],
    difficulty: "Fácil",
    distance: 19.0,
    duration: "2 a 3 horas",
    elevation: 120,
    rating: 4.6,
    reviews: [],
    coordinates: { lat: -15.980155, lng: -47.829761 },
    
    bestSeason: "Maio a Setembro (Seca)",
    terrainType: "Cascalho solto e pedras irregulares",
    mobileSignal: "Parcial",
    tips: "A descida final é íngreme e escorregadia devido ao cascalho solto. Use botas de trilha ou tênis com boa aderência. Evite ir em dias de chuva forte pois as pedras ficam muito lisas. Leve água, não há comércio no local.",

    path: [
        { lat: -15.980155, lng: -47.829761 }, { lat: -15.980130, lng: -47.829800 }, { lat: -15.980100, lng: -47.829900 },
        { lat: -15.980080, lng: -47.830000 }, { lat: -15.980060, lng: -47.830200 }, { lat: -15.980042, lng: -47.830513 },
        { lat: -15.980020, lng: -47.830471 }, { lat: -15.979993, lng: -47.830421 }, { lat: -15.979969, lng: -47.830381 },
        { lat: -15.979938, lng: -47.830343 }, { lat: -15.979900, lng: -47.830300 }, { lat: -15.979850, lng: -47.830250 },
        { lat: -15.979800, lng: -47.830200 }, { lat: -15.979750, lng: -47.830150 }, { lat: -15.979700, lng: -47.830100 },
        { lat: -15.979650, lng: -47.830050 }, { lat: -15.979600, lng: -47.830000 }, { lat: -15.979550, lng: -47.829950 },
        { lat: -15.979500, lng: -47.829900 }, { lat: -15.979450, lng: -47.829850 }, { lat: -15.979400, lng: -47.829800 },
        { lat: -15.979350, lng: -47.829750 }, { lat: -15.979300, lng: -47.829700 }, { lat: -15.979250, lng: -47.829650 },
        { lat: -15.979200, lng: -47.829600 }, { lat: -15.979150, lng: -47.829550 }, { lat: -15.979100, lng: -47.829500 },
        { lat: -15.979050, lng: -47.829450 }, { lat: -15.979000, lng: -47.829400 }, { lat: -15.978950, lng: -47.829350 }
    ]
  },

  // 6. Trilha do Parque Nacional de Brasília (Trilha das Árvores Gigantes)
  {
    id: "pnb-arvores-gigantes",
    parque_id: PARQUE_NACIONAL_BRASILIA_ID,
    name: "Trilha das Árvores Gigantes",
    location: "Parque Nacional de Brasília",
    description: "Trilha curta e fácil, com destaque para grandes árvores nativas do cerrado. Entrada pelo Jardim Botânico de Brasília.",
    imageUrl: "/images/parques/parquenacional.jpg",
    images: ["/images/parques/parquenacional.jpg", "/images/parques/parquenacional.jpg"],
    difficulty: "Fácil",
    distance: 2.0,
    duration: "1-2 horas",
    elevation: 30,
    rating: 4.5,
    reviews: [],
    coordinates: { lat: -15.720000, lng: -47.930000 },

    bestSeason: "Ano todo",
    terrainType: "Terra plana",
    mobileSignal: "Bom",
    tips: "Excelente para levar crianças e idosos. As árvores gigantes são fotogênicas. Leve água.",

    path: [
        { lat: -15.720000, lng: -47.930000 }, { lat: -15.721000, lng: -47.931000 }, { lat: -15.722000, lng: -47.932000 },
        { lat: -15.723000, lng: -47.933000 }, { lat: -15.722000, lng: -47.934000 }, { lat: -15.721000, lng: -47.935000 },
        { lat: -15.720000, lng: -47.930000 }
    ]
  },

  // 7. Trilha do Parque da Cidade Sarah Kubitschek
  {
    id: "parque-da-cidade",
    parque_id: PARQUE_DA_CIDADE_SARAH_KUBITSCHEK_ID,
    name: "Trilha do Parque da Cidade",
    location: "Parque da Cidade, Asa Sul",
    description: "Caminhada simples e acessível dentro do parque urbano, ideal para iniciantes.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Fácil",
    distance: 3.0,
    duration: "1 hora",
    elevation: 10,
    rating: 4.3,
    reviews: [],
    coordinates: { lat: -15.790000, lng: -47.900000 },

    bestSeason: "Ano todo",
    terrainType: "Asfalto e terra batida",
    mobileSignal: "Excelente",
    tips: "Muito movimentado nos fins de semana. Ótimo para treinos rápidos.",

    path: [
        { lat: -15.790000, lng: -47.900000 }, { lat: -15.791000, lng: -47.901000 }, { lat: -15.792000, lng: -47.902000 },
        { lat: -15.793000, lng: -47.903000 }, { lat: -15.792000, lng: -47.904000 }, { lat: -15.791000, lng: -47.905000 },
        { lat: -15.790000, lng: -47.900000 }
    ]
  },

  // 8. Trilha do Parque Ecológico de Águas Claras
  {
    id: "aguas-claras",
    parque_id: PARQUE_ECOLOGICO_AGUAS_CLARAS_ID,
    name: "Trilha do Parque de Águas Claras",
    location: "Águas Claras",
    description: "Trilha curta e plana, ideal para iniciantes, com fauna e flora do cerrado.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Fácil",
    distance: 2.0,
    duration: "1-2 horas",
    elevation: 15,
    rating: 4.4,
    reviews: [],
    coordinates: { lat: -15.835000, lng: -48.020000 },

    bestSeason: "Ano todo",
    terrainType: "Terra plana",
    mobileSignal: "Excelente",
    tips: "Cuidado com capivaras que às vezes circulam pelo parque.",

    path: [
        { lat: -15.835000, lng: -48.020000 }, { lat: -15.836000, lng: -48.021000 }, { lat: -15.837000, lng: -48.022000 },
        { lat: -15.836000, lng: -48.023000 }, { lat: -15.835000, lng: -48.024000 }, { lat: -15.834000, lng: -48.022000 },
        { lat: -15.835000, lng: -48.020000 }
    ]
  },

  // 9. Trilha do Parque Burle Marx
  {
    id: "burle-marx",
    parque_id: PARQUE_BURLE_MARX_ID,
    name: "Trilha do Parque Burle Marx",
    location: "Parque Burle Marx, Asa Sul",
    description: "Trilha curta e fácil, ideal para iniciantes e famílias, com paisagens agradáveis de área verde urbana.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Fácil",
    distance: 2.0,
    duration: "1 hora",
    elevation: 10,
    rating: 4.2,
    reviews: [],
    coordinates: { lat: -15.750000, lng: -47.880000 },

    bestSeason: "Ano todo",
    terrainType: "Terra e grama",
    mobileSignal: "Excelente",
    tips: "Leve canga para piquenique.",

    path: [
        { lat: -15.750000, lng: -47.880000 }, { lat: -15.751000, lng: -47.881000 }, { lat: -15.752000, lng: -47.882000 },
        { lat: -15.751000, lng: -47.883000 }, { lat: -15.750000, lng: -47.880000 }
    ]
  },

  // 10. Trilha do Parque Bosque do Sudoeste
  {
    id: "bosque-sudoeste",
    parque_id: PARQUE_BOSQUE_SUDOESTE_ID,
    name: "Trilha do Bosque do Sudoeste",
    location: "Parque Bosque do Sudoeste",
    description: "Trilha tranquila dentro do parque urbano, perfeita para caminhadas leves e lazer.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Fácil",
    distance: 3.0,
    duration: "1-2 horas",
    elevation: 10,
    rating: 4.3,
    reviews: [],
    coordinates: { lat: -15.800000, lng: -47.920000 },

    bestSeason: "Ano todo",
    terrainType: "Terra batida",
    mobileSignal: "Excelente",
    tips: "Muitas sombras, bom para dias quentes.",

    path: [
        { lat: -15.800000, lng: -47.920000 }, { lat: -15.801000, lng: -47.921000 }, { lat: -15.802000, lng: -47.922000 },
        { lat: -15.801000, lng: -47.923000 }, { lat: -15.800000, lng: -47.920000 }
    ]
  },

  // 11. Trilha do Parque Chico Mendes
  {
    id: "chico-mendes",
    parque_id: PARQUE_CHICO_MENDES_ID,
    name: "Trilha do Parque Chico Mendes",
    location: "Parque Chico Mendes, Guará",
    description: "Trilha simples e curta, com boa infraestrutura para caminhadas leves.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Fácil",
    distance: 3.0,
    duration: "1-2 horas",
    elevation: 10,
    rating: 4.2,
    reviews: [],
    coordinates: { lat: -15.820000, lng: -47.980000 },

    bestSeason: "Ano todo",
    terrainType: "Terra batida",
    mobileSignal: "Excelente",
    tips: "Ótimo para caminhadas matinais.",

    path: [
        { lat: -15.820000, lng: -47.980000 }, { lat: -15.821000, lng: -47.981000 }, { lat: -15.822000, lng: -47.982000 },
        { lat: -15.821000, lng: -47.983000 }, { lat: -15.820000, lng: -47.980000 }
    ]
  },

  // 12. Trilha do Lago do Descoberto
  {
    id: "lago-descoberto",
    parque_id: LAGO_DO_DESCOBERTO_ID,
    name: "Trilha do Lago do Descoberto",
    location: "Lago do Descoberto (BR-020)",
    description: "Trilha tranquila ao redor da represa, com vistas agradáveis e fácil acesso. Aproximadamente 40 km de Brasília.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Fácil",
    distance: 4.0,
    duration: "1-2 horas",
    elevation: 20,
    rating: 4.5,
    reviews: [],
    coordinates: { lat: -15.600000, lng: -48.050000 },

    bestSeason: "Ano todo",
    terrainType: "Terra",
    mobileSignal: "Bom",
    tips: "Acesso pode ser restrito em algumas áreas da represa, verifique antes.",

    path: [
        { lat: -15.600000, lng: -48.050000 }, { lat: -15.601000, lng: -48.051000 }, { lat: -15.602000, lng: -48.052000 },
        { lat: -15.603000, lng: -48.053000 }, { lat: -15.602000, lng: -48.054000 }, { lat: -15.601000, lng: -48.055000 },
        { lat: -15.600000, lng: -48.050000 }
    ]
  },

  // 13. Trilha da Prainha do Lúcio Costa
  {
    id: "prainha-lucio-costa",
    parque_id: LAGO_PARANOA_ID,
    name: "Trilha da Prainha do Lúcio Costa",
    location: "Lúcio Costa, Lago Paranoá",
    description: "Caminhada tranquila ao redor da prainha, com vistas agradáveis do lago, perto da Ponte JK.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Fácil",
    distance: 2.0,
    duration: "1-2 horas",
    elevation: 10,
    rating: 4.4,
    reviews: [],
    coordinates: { lat: -15.810000, lng: -47.830000 },

    bestSeason: "Ano todo",
    terrainType: "Areia e grama",
    mobileSignal: "Excelente",
    tips: "Leve roupa de banho se quiser entrar no lago.",

    path: [
        { lat: -15.810000, lng: -47.830000 }, { lat: -15.811000, lng: -47.831000 }, { lat: -15.812000, lng: -47.832000 },
        { lat: -15.811000, lng: -47.833000 }, { lat: -15.810000, lng: -47.830000 }
    ]
  },

  // 14. Trilha do Lago do Parque da Cidade
  {
    id: "lago-parque-da-cidade",
    parque_id: PARQUE_DA_CIDADE_SARAH_KUBITSCHEK_ID,
    name: "Trilha do Lago do Parque da Cidade",
    location: "Parque da Cidade, Brasília",
    description: "Trilha plana, rodeada por vegetação típica do Cerrado e que contorna o lago. Possui áreas de piquenique e é ótima para iniciantes ou caminhadas em família.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Fácil",
    distance: 4.0,
    duration: "1-2 horas",
    elevation: 10,
    rating: 4.6,
    reviews: [],
    coordinates: { lat: -15.795000, lng: -47.905000 },

    bestSeason: "Ano todo",
    terrainType: "Asfalto e calçada",
    mobileSignal: "Excelente",
    tips: "Ótimo local para piqueniques após a caminhada.",

    path: [
        { lat: -15.795000, lng: -47.905000 }, { lat: -15.796000, lng: -47.906000 }, { lat: -15.797000, lng: -47.907000 },
        { lat: -15.796000, lng: -47.908000 }, { lat: -15.795000, lng: -47.905000 }
    ]
  },

  // 15. Trilha do Poço Azul (Fácil)
  {
    id: "poco-azul-facil",
    parque_id: RESERVA_BIOLOGICA_CONTAGEM_ID,
    name: "Trilha do Poço Azul",
    location: "Brazlândia",
    description: "Caminho curto e fácil, levando ao Poço Azul, um ponto turístico ideal para nadar. Trilha acessível, mas com volume de água viável de acordo com a estação do ano.",
    imageUrl: "/images/trilhas/pocoazul.jpg",
    images: ["/images/trilhas/pocoazul.jpg", "/images/trilhas/pocoazul.jpg"],
    difficulty: "Fácil",
    distance: 1.0,
    duration: "30-40 min",
    elevation: 30,
    rating: 4.5,
    reviews: [],
    coordinates: { lat: -15.6020, lng: -48.1550 },

    bestSeason: "Maio a Setembro (Seca para água mais azul)",
    terrainType: "Terra com pedras",
    mobileSignal: "Ruim",
    tips: "Chegue cedo, o local lota nos fins de semana. A água é fria!",

    path: [
        { lat: -15.5980, lng: -48.1500 }, { lat: -15.5990, lng: -48.1510 }, { lat: -15.6000, lng: -48.1520 },
        { lat: -15.6020, lng: -48.1550 }
    ]
  },

  // 16. Trilha do Capão da Onça
  {
    id: "capao-da-onca",
    parque_id: PARQUE_NACIONAL_BRASILIA_ID,
    name: "Trilha do Capão da Onça",
    location: "Parque Nacional de Brasília",
    description: "Trilha fácil e agradável, com trechos de vegetação densa e pequenos riachos. Ideal para quem quer ter contato com o Cerrado sem esforço físico intenso.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Fácil",
    distance: 1.5,
    duration: "1 hora",
    elevation: 20,
    rating: 4.4,
    reviews: [],
    coordinates: { lat: -15.725000, lng: -47.935000 },

    bestSeason: "Ano todo",
    terrainType: "Terra batida",
    mobileSignal: "Bom",
    tips: "Leve repelente, muitos insetos na mata ciliar.",

    path: [
        { lat: -15.725000, lng: -47.935000 }, { lat: -15.726000, lng: -47.936000 }, { lat: -15.727000, lng: -47.937000 },
        { lat: -15.725000, lng: -47.935000 }
    ]
  },

  // 17. Trilha do Mirante do Centro de Visitantes
  {
    id: "mirante-centro-visitantes",
    parque_id: PARQUE_NACIONAL_BRASILIA_ID,
    name: "Trilha do Mirante do Centro de Visitantes",
    location: "Parque Nacional de Brasília, Asa Norte",
    description: "Trilha curta e bem demarcada, com leve inclinação e mirante ao final, onde é possível observar a fauna e flora do Cerrado. A trilha é autoguiada e apropriada para iniciantes.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Fácil",
    distance: 1.3,
    duration: "1 hora",
    elevation: 30,
    rating: 4.5,
    reviews: [],
    coordinates: { lat: -15.730000, lng: -47.920000 },

    bestSeason: "Ano todo",
    terrainType: "Terra batida",
    mobileSignal: "Bom",
    tips: "Ótima vista panorâmica do parque.",

    path: [
        { lat: -15.730000, lng: -47.920000 }, { lat: -15.731000, lng: -47.921000 }, { lat: -15.732000, lng: -47.922000 },
        { lat: -15.730000, lng: -47.920000 }
    ]
  },

  // --- NÍVEL MÉDIO ---

  // 18. Trilha do Parque (PNB)
  {
    id: "trilha-do-parque",
    parque_id: PARQUE_NACIONAL_BRASILIA_ID,
    name: "Trilha do Parque",
    location: "Parque Nacional de Brasília, EPIA",
    description: "A trilha passa por vegetação do cerrado, com paisagens ricas em fauna e flora.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Moderado",
    distance: 7.0,
    duration: "2-3 horas",
    elevation: 50,
    rating: 4.6,
    reviews: [],
    coordinates: { lat: -15.710000, lng: -47.950000 },

    bestSeason: "Maio a Setembro",
    terrainType: "Terra com raízes",
    mobileSignal: "Bom",
    tips: "Fique atento aos macacos-prego, não alimente os animais.",

    path: [
        { lat: -15.710000, lng: -47.950000 }, { lat: -15.712000, lng: -47.952000 }, { lat: -15.714000, lng: -47.954000 },
        { lat: -15.716000, lng: -47.956000 }, { lat: -15.714000, lng: -47.958000 }, { lat: -15.712000, lng: -47.960000 },
        { lat: -15.710000, lng: -47.950000 }
    ]
  },

  // 19. Trilha do Vale do Frade
  {
    id: "vale-do-frade",
    parque_id: PARQUE_NACIONAL_BRASILIA_ID,
    name: "Trilha do Vale do Frade",
    location: "Parque Nacional de Brasília, EPIA",
    description: "Trilha que leva ao Vale do Frade, uma região mais isolada, com vegetação de cerrado e vistas panorâmicas.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Moderado",
    distance: 5.0,
    duration: "3 horas",
    elevation: 80,
    rating: 4.7,
    reviews: [],
    coordinates: { lat: -15.700000, lng: -47.960000 },

    bestSeason: "Seca",
    terrainType: "Terra e pedras soltas",
    mobileSignal: "Parcial",
    tips: "Leve boné e protetor solar, pouca sombra no percurso.",

    path: [
        { lat: -15.700000, lng: -47.960000 }, { lat: -15.702000, lng: -47.962000 }, { lat: -15.704000, lng: -47.964000 },
        { lat: -15.706000, lng: -47.966000 }, { lat: -15.700000, lng: -47.960000 }
    ]
  },

  // 20. Trilha dos Macacos
  {
    id: "trilha-dos-macacos",
    parque_id: PARQUE_NACIONAL_BRASILIA_ID,
    name: "Trilha dos Macacos",
    location: "Parque Nacional de Brasília, EPIA",
    description: "Caminhada por áreas de cerrado e mata ciliar, com avistamentos de macacos e outros animais locais.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Moderado",
    distance: 6.0,
    duration: "2-3 horas",
    elevation: 60,
    rating: 4.5,
    reviews: [],
    coordinates: { lat: -15.715000, lng: -47.945000 },

    bestSeason: "Ano todo",
    terrainType: "Terra úmida em partes",
    mobileSignal: "Bom",
    tips: "Ótima para observação de aves e macacos.",

    path: [
        { lat: -15.715000, lng: -47.945000 }, { lat: -15.717000, lng: -47.947000 }, { lat: -15.719000, lng: -47.949000 },
        { lat: -15.721000, lng: -47.951000 }, { lat: -15.715000, lng: -47.945000 }
    ]
  },

  // 21. Trilha Buritis
  {
    id: "trilha-buritis",
    parque_id: "solar-da-aguia",
    name: "Trilha Buritis",
    location: "Solar da Águia Restaurante e Turismo Rural",
    description: "Percurso majoritariamente em estrada de terra com descidas até o km 13, seguido de subidas e cascalho. O caminho inclui córregos e uma pequena cachoeira, além de uma bica de água mineral. A vegetação nativa do cerrado, especialmente a palmeira Buriti, está presente ao longo do trajeto.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Moderado",
    distance: 21.0,
    duration: "2 a 3 horas",
    elevation: 200,
    rating: 4.6,
    reviews: [],
    coordinates: { lat: -15.650000, lng: -47.800000 },

    bestSeason: "Maio a Setembro",
    terrainType: "Estrada de terra e cascalho",
    mobileSignal: "Ruim",
    tips: "Leve kit de reparo para bicicleta, há trechos com pedras pontiagudas.",

    path: [
        { lat: -15.650000, lng: -47.800000 }, { lat: -15.652000, lng: -47.805000 }, { lat: -15.654000, lng: -47.810000 },
        { lat: -15.656000, lng: -47.815000 }, { lat: -15.650000, lng: -47.800000 }
    ]
  },

  // 22. Trilha Catingueiro
  {
    id: "trilha-catingueiro",
    parque_id: "vila-boa-vista",
    name: "Trilha Catingueiro",
    location: "Vila Boa Vista",
    description: "Essa trilha passa pela região da Vila Boa Vista e é caracterizada por subidas e descidas que oferecem um bom treino de resistência.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Moderado",
    distance: 27.0,
    duration: "3 horas",
    elevation: 250,
    rating: 4.7,
    reviews: [],
    coordinates: { lat: -15.680000, lng: -47.850000 },

    bestSeason: "Ano todo",
    terrainType: "Terra batida com desníveis",
    mobileSignal: "Parcial",
    tips: "Exige bom preparo físico devido às subidas constantes.",

    path: [
        { lat: -15.680000, lng: -47.850000 }, { lat: -15.682000, lng: -47.852000 }, { lat: -15.684000, lng: -47.854000 },
        { lat: -15.680000, lng: -47.850000 }
    ]
  },

  // 23. Trilha da Mata Ciliar (PNB)
  {
    id: "mata-ciliar",
    parque_id: PARQUE_NACIONAL_BRASILIA_ID,
    name: "Trilha da Mata Ciliar",
    location: "Parque Nacional de Brasília, EPIA",
    description: "Trilha curta e fácil, passando por vegetação de mata ciliar e com boa oportunidade de observação de fauna.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Moderado",
    distance: 3.0,
    duration: "1-2 horas",
    elevation: 40,
    rating: 4.4,
    reviews: [],
    coordinates: { lat: -15.720000, lng: -47.940000 },

    bestSeason: "Ano todo",
    terrainType: "Terra úmida e vegetação densa",
    mobileSignal: "Bom",
    tips: "Use calças compridas para evitar arranhões na vegetação.",

    path: [
        { lat: -15.720000, lng: -47.940000 }, { lat: -15.721000, lng: -47.941000 }, { lat: -15.720000, lng: -47.940000 }
    ]
  },

  // --- NÍVEL MODERADO (NOVA SEÇÃO DO PDF) ---

  // 24. Trilha do Itiquira (Cerca do PNB)
  {
    id: "itiquira-cerca-pnb",
    parque_id: PARQUE_MUNICIPAL_ITIQUIRA_ID,
    name: "Trilha do Itiquira",
    location: "Próximo a Formosa, GO",
    description: "Trilha que leva até a famosa Cachoeira Itiquira, com 168 metros de queda d´água.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Moderado",
    distance: 8.0,
    duration: "3-4 horas",
    elevation: 200,
    rating: 4.8,
    reviews: [],
    coordinates: { lat: -15.380000, lng: -47.450000 },

    bestSeason: "Ano todo (Volume de água maior na chuva)",
    terrainType: "Calçada (parte) e trilha natural",
    mobileSignal: "Inexistente",
    tips: "A parte pavimentada é fácil, mas a trilha até o topo é exigente. Não é permitido nadar na queda principal (perigo de impacto da água).",

    path: [
        { lat: -15.380000, lng: -47.450000 }, { lat: -15.382000, lng: -47.452000 }, { lat: -15.380000, lng: -47.450000 }
    ]
  },

  // 25. Trilha do Morro da Capelinha
  {
    id: "morro-capelinha",
    parque_id: "planaltina",
    name: "Trilha do Morro da Capelinha",
    location: "Planaltina, DF",
    description: "Caminho com subidas acentuadas e pontos de observação panorâmica. Ideal para quem busca um pouco mais de desafio físico.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Moderado",
    distance: 8.0,
    duration: "3-4 horas",
    elevation: 300,
    rating: 4.6,
    reviews: [],
    coordinates: { lat: -15.600000, lng: -47.650000 },

    bestSeason: "Páscoa (Via Sacra) ou Seca",
    terrainType: "Terra íngreme",
    mobileSignal: "Bom",
    tips: "Local da Via Sacra. A subida é forte, vá devagar.",

    path: [
        { lat: -15.600000, lng: -47.650000 }, { lat: -15.602000, lng: -47.652000 }, { lat: -15.600000, lng: -47.650000 }
    ]
  },

  // 26. Trilha do Jerivá
  {
    id: "trilha-jeriva",
    parque_id: PARQUE_NACIONAL_CHAPADA_VEADEIROS_ID,
    name: "Trilha do Jerivá",
    location: "Alto Paraíso, GO",
    description: "Caminhada entre vegetação densa e campo aberto, com mirantes naturais. Trilha com algumas subidas e descidas e paisagens de tirar o fôlego.",
    imageUrl: "/images/parques/chapada.jpg",
    images: ["/images/parques/chapada.jpg", "/images/parques/chapada.jpg"],
    difficulty: "Moderado",
    distance: 10.0,
    duration: "4 horas",
    elevation: 250,
    rating: 4.7,
    reviews: [],
    coordinates: { lat: -14.140000, lng: -47.750000 },

    bestSeason: "Maio a Outubro",
    terrainType: "Pedras e terra",
    mobileSignal: "Inexistente",
    tips: "Leve bastão de caminhada para auxiliar nas descidas.",

    path: [
        { lat: -14.140000, lng: -47.750000 }, { lat: -14.142000, lng: -47.752000 }, { lat: -14.140000, lng: -47.750000 }
    ]
  },

  // 27. Trilha da Janela e Abismo
  {
    id: "janela-abismo",
    parque_id: PARQUE_NACIONAL_CHAPADA_VEADEIROS_ID,
    name: "Trilha da Janela e Abismo",
    location: "Alto Paraíso, GO",
    description: "Trilha difícil e icônica da Chapada dos Veadeiros, com vista para o Vale dos Macacos e cachoeiras. Exige preparo físico e cuidado devido à elevação e às pedras no trajeto.",
    imageUrl: "/images/parques/chapada.jpg",
    images: ["/images/parques/chapada.jpg", "/images/parques/chapada.jpg"],
    difficulty: "Moderado",
    distance: 8.0,
    duration: "4-5 horas",
    elevation: 350,
    rating: 4.9,
    reviews: [],
    coordinates: { lat: -14.120000, lng: -47.780000 },

    bestSeason: "Seca (para ver a cachoeira do Abismo sem água excessiva)",
    terrainType: "Pedras grandes e desníveis",
    mobileSignal: "Parcial (topo)",
    tips: "A vista da Janela para os Saltos do Rio Preto é a mais clássica da Chapada. Cuidado nas bordas.",

    path: [
        { lat: -14.120000, lng: -47.780000 }, { lat: -14.122000, lng: -47.782000 }, { lat: -14.120000, lng: -47.780000 }
    ]
  },

  // 28. Trilha da Cachoeira do Salto do Corumbá
  {
    id: "salto-corumba",
    parque_id: "corumba-de-goias",
    name: "Trilha do Salto do Corumbá",
    location: "Corumbá de Goiás",
    description: "Caminho com terreno variado, incluindo subidas e áreas de mata, levando até uma cachoeira. Recomendada para trilheiros experientes.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Moderado",
    distance: 5.0,
    duration: "2-3 horas",
    elevation: 150,
    rating: 4.5,
    reviews: [],
    coordinates: { lat: -15.900000, lng: -48.800000 },

    bestSeason: "Ano todo (Cachoeira sempre com volume)",
    terrainType: "Terra e pedras escorregadias",
    mobileSignal: "Parcial",
    tips: "A cachoeira é muito forte, cuidado ao se aproximar da queda. Há estrutura de camping perto.",

    path: [
        { lat: -15.900000, lng: -48.800000 }, { lat: -15.902000, lng: -48.802000 }, { lat: -15.900000, lng: -48.800000 }
    ]
  },

  // --- NÍVEL DIFÍCIL E MUITO DIFÍCIL ---

  // 29. Trilha da Pedra Fundamental
  {
    id: "pedra-fundamental",
    parque_id: "planaltina",
    name: "Trilha da Pedra Fundamental",
    location: "Planaltina, DF",
    description: "Trilha com subidas e descidas acentuadas, levando a um mirante com vista panorâmica. Exige preparo físico e é recomendada para trilheiros experientes.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Difícil",
    distance: 10.0,
    duration: "4-5 horas",
    elevation: 400,
    rating: 4.6,
    reviews: [],
    coordinates: { lat: -15.610000, lng: -47.660000 },

    bestSeason: "Inverno (Céu limpo)",
    terrainType: "Terra e cascalho",
    mobileSignal: "Bom",
    tips: "Marco histórico de Brasília. Local isolado, vá em grupo.",

    path: [
        { lat: -15.610000, lng: -47.660000 }, { lat: -15.612000, lng: -47.662000 }, { lat: -15.610000, lng: -47.660000 }
    ]
  },

  // 30. Trilha da Cachoeira do Itiquira
  {
    id: "cachoeira-itiquira",
    parque_id: PARQUE_MUNICIPAL_ITIQUIRA_ID,
    name: "Trilha da Cachoeira do Itiquira",
    location: "Formosa, GO",
    description: "Trilha com terrenos acidentados e inclinações acentuadas, levando a uma das cachoeiras mais altas do Brasil. É necessário preparo físico, pois o trajeto é longo e desafiador.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Difícil",
    distance: 13.0,
    duration: "5-6 horas",
    elevation: 500,
    rating: 4.9,
    reviews: [],
    coordinates: { lat: -15.385000, lng: -47.455000 },

    bestSeason: "Ano todo",
    terrainType: "Trilha técnica",
    mobileSignal: "Inexistente",
    tips: "Esta trilha (topo) é diferente da turística (base). Requer guia experiente.",

    path: [
        { lat: -15.385000, lng: -47.455000 }, { lat: -15.387000, lng: -47.457000 }, { lat: -15.385000, lng: -47.455000 }
    ]
  },

  // 31. Trilha Cachoeira do Indaiá (Difícil)
  {
    id: "cachoeira-indaia-dificil",
    parque_id: PARQUE_MUNICIPAL_ITIQUIRA_ID,
    name: "Cachoeira do Indaiá",
    location: "Formosa, GO",
    description: "Passando por diferentes tipos de vegetação e travessia de riachos, o trajeto inclui subidas e descidas íngremes e um longo caminho até a cachoeira. É recomendado para trilheiros experientes.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Difícil",
    distance: 12.0,
    duration: "5-6 horas",
    elevation: 400,
    rating: 4.8,
    reviews: [],
    coordinates: { lat: -15.400000, lng: -47.400000 },

    bestSeason: "Maio a Setembro",
    terrainType: "Pedras e travessia de rio",
    mobileSignal: "Inexistente",
    tips: "Cuidado com cabeças d'água nas travessias de rio.",

    path: [
        { lat: -15.400000, lng: -47.400000 }, { lat: -15.402000, lng: -47.402000 }, { lat: -15.400000, lng: -47.400000 }
    ]
  },

  // 32. Trilha Pico do Roncador
  {
    id: "pico-roncador",
    parque_id: RESERVA_PICO_RONCADOR_ID,
    name: "Trilha Pico do Roncador",
    location: "São João da Aliança, GO",
    description: "Uma das trilhas mais difíceis da região, com subidas íngremes e paisagens deslumbrantes. Leva ao Pico do Roncador, ponto alto com vista espetacular. Para quem tem experiência e preparo físico.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Difícil",
    distance: 15.0,
    duration: "6 a 7 horas",
    elevation: 600,
    rating: 4.9,
    reviews: [],
    coordinates: { lat: -14.700000, lng: -47.500000 },

    bestSeason: "Inverno (menos chuva e risco)",
    terrainType: "Escalada em rocha e trilha íngreme",
    mobileSignal: "Inexistente",
    tips: "Exige guia credenciado. Não tente subir sem equipamento e experiência.",

    path: [
        { lat: -14.700000, lng: -47.500000 }, { lat: -14.702000, lng: -47.502000 }, { lat: -14.700000, lng: -47.500000 }
    ]
  },

  // 33. Trilha das Sete Quedas
  {
    id: "sete-quedas",
    parque_id: PARQUE_NACIONAL_CHAPADA_VEADEIROS_ID,
    name: "Trilha das Sete Quedas",
    location: "Chapada dos Veadeiros (Cavalcante)",
    description: "Trilha extremamente desafiadora que exige pernoite e envolve travessias de rios, subidas íngremes e longas caminhadas. Leva até uma série de cachoeiras conhecidas como Sete Quedas. É indicada para trilheiros experientes.",
    imageUrl: "/images/trilhas/aguamineral.jpg",
    images: ["/images/trilhas/aguamineral.jpg", "/images/trilhas/aguamineral.jpg"],
    difficulty: "Extrema",
    distance: 23.0,
    duration: "2 dias",
    elevation: 800,
    rating: 5.0,
    reviews: [],
    coordinates: { lat: -14.000000, lng: -47.500000 },

    bestSeason: "Junho a Outubro (Seca)",
    terrainType: "Travessias de rio e pedras",
    mobileSignal: "Inexistente",
    tips: "Obrigatório agendamento prévio e pernoite no parque. Leve barraca e comida suficiente para 2 dias.",

    path: [
        { lat: -14.000000, lng: -47.500000 }, { lat: -14.002000, lng: -47.502000 }, { lat: -14.000000, lng: -47.500000 }
    ]
  },

  // 34. Trilha do Vale do Macaco
  {
    id: "vale-do-macaco",
    parque_id: PARQUE_NACIONAL_CHAPADA_VEADEIROS_ID,
    name: "Trilha do Vale do Macaco",
    location: "São Jorge, Alto Paraíso",
    description: "Trilha com grande elevação, terreno rochoso e desafios naturais. O destino é um vale isolado com piscinas naturais e cachoeiras.",
    imageUrl: "/images/parques/chapada.jpg",
    images: ["/images/parques/chapada.jpg", "/images/parques/chapada.jpg"],
    difficulty: "Difícil",
    distance: 10.0,
    duration: "6 horas",
    elevation: 400,
    rating: 4.8,
    reviews: [],
    coordinates: { lat: -14.110000, lng: -47.660000 },

    bestSeason: "Maio a Setembro",
    terrainType: "Cânion com pedras grandes",
    mobileSignal: "Inexistente",
    tips: "A descida para o vale é muito íngreme (paredão). Requer bom preparo de joelhos e pernas.",

    path: [
        { lat: -14.110000, lng: -47.660000 }, { lat: -14.112000, lng: -47.662000 }, { lat: -14.110000, lng: -47.660000 }
    ]
  }
];

// --- FUNÇÕES DE BUSCA ---
export function getParkById(id?: string): Parque | undefined {
    if (!id) return undefined;
    return parques.find((parque) => parque.id === id);
}

export function getTrailsByParkId(parkUUID?: string): Trilhas[] {
    if (!parkUUID) return [];
    return featuredTrails.filter((trail) => trail.parque_id === parkUUID);
}

export function getTrailById(id?: string): Trilhas | undefined {
    if (!id) return undefined;
    return featuredTrails.find((trail) => trail.id === id);
}

export function getTopRatedTrails(): Trilhas[] {
  return [...featuredTrails].sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

export function getPopularTrails(): Trilhas[] {
  return featuredTrails;
}

export function getNearbyTrails(latitude: number | null, longitude: number | null): Trilhas[] {
  if (!latitude || !longitude) return [];
  const trailsWithDistance = featuredTrails.map(trail => {
    if (trail.coordinates) {
      const distance = calculateDistance(latitude, longitude, trail.coordinates.lat, trail.coordinates.lng);
      return { ...trail, distancia_usuario: distance };
    }
    return { ...trail, distancia_usuario: Infinity };
  });
  return trailsWithDistance.sort((a, b) => a.distancia_usuario - b.distancia_usuario);
}