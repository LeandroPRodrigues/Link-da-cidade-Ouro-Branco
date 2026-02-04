// --- DADOS INICIAIS (SEED) ---

export const INITIAL_NEWS = [
    { 
      id: 1, 
      title: "Festival da Batata confirmado para Outubro com atrações nacionais", 
      category: "Eventos & Cultura", 
      subcategory: "Festas tradicionais e religiosas",
      image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800", 
      date: "2026-10-12",
      author: "Redação Link",
      summary: "Prefeitura confirma datas e promete estrutura inédita para o maior evento gastronômico da região.",
      tags: "Turismo, Gastronomia, Shows",
      content: [
        { type: 'paragraph', value: 'A prefeitura confirmou nesta manhã a realização do tradicional Festival da Batata. O evento promete movimentar a economia local e trazer turistas de toda a região.' },
        { type: 'image', value: 'https://images.unsplash.com/photo-1572573216839-8435e98544c7?auto=format&fit=crop&q=80&w=800' },
        { type: 'subtitle', value: 'Atrações Confirmadas' },
        { type: 'paragraph', value: 'Entre os nomes cotados estão artistas do cenário sertanejo e pop rock nacional. A lista completa será divulgada na próxima semana.' }
      ]
    },
    { 
      id: 2, 
      title: "Gerdau abre programa de estágio para estudantes da região", 
      category: "Economia & Comércio Local", 
      subcategory: "Indústria e empregos",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800", 
      date: "2026-05-20",
      author: "Assessoria",
      summary: "Oportunidades para engenharia, administração e áreas técnicas. Inscrições abertas até o fim do mês.",
      tags: "Emprego, Estágio, Indústria",
      content: [
        { type: 'paragraph', value: 'Oportunidade para estudantes de engenharia e administração. As inscrições vão até o dia 30.' }
      ]
    },
    { 
      id: 3, 
      title: "Prefeitura anuncia recapeamento na Avenida Mariza de Souza Mendes", 
      category: "Política & Administração Pública", 
      subcategory: "Projetos e obras públicas",
      image: "https://images.unsplash.com/photo-1621905251189-fc015acafd31?auto=format&fit=crop&q=80&w=800", 
      date: "2026-05-19",
      author: "João da Silva",
      summary: "Obras começam na próxima segunda-feira e devem durar duas semanas. Trânsito será desviado.",
      tags: "Obras, Trânsito, Prefeitura",
      content: []
    },
    { 
      id: 4, 
      title: "Campus local da UFSJ abre inscrições para mestrado", 
      category: "Educação", 
      subcategory: "Escolas e universidades locais",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800", 
      date: "2026-05-18",
      author: "Redação Conecta",
      summary: "Programa de pós-graduação oferece 20 vagas para pesquisadores em tecnologias sustentáveis.",
      tags: "Educação, Universidade, Pesquisa",
      content: []
    },
  ];
  
  export const INITIAL_PROPERTIES = [
    { id: '1', title: "Casa Alto Padrão no Belvedere", type: "Venda", price: "850000", bedrooms: 4, bathrooms: 3, garage: 2, area: 250, address: "Rua das Flores, 123", privacy: 'exact', status: 'active', userId: 'admin_master', userName: 'Imobiliária Modelo', contactPhone: '31999999999', contactEmail: 'contato@imobmodelo.com.br', createdAt: new Date().toISOString(), expiresAt: new Date(2030,1,1).toISOString(), photos: ["https://images.unsplash.com/photo-1600596542815-22b8c86eb609?auto=format&fit=crop&q=80&w=800"], location: { lat: -20.523, lng: -43.701 } },
    { id: '2', title: "Apartamento Centro", type: "Aluguel", price: "1200", bedrooms: 2, bathrooms: 1, garage: 1, area: 70, address: "Av. Mariza, 500", privacy: 'approx', status: 'active', userId: 'user_1', userName: 'João Silva', contactPhone: '31988888888', contactEmail: 'joao@email.com', createdAt: new Date().toISOString(), expiresAt: new Date(2030,1,1).toISOString(), photos: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"], location: { lat: -20.535, lng: -43.695 } }
  ];
  
  export const EVENTS_DATA = [
    { 
      id: 1, 
      title: "Festival da Batata 2026", 
      date: "2026-10-12",
      time: "20:00",
      location: "Praça de Eventos", 
      image: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&q=80&w=600",
      category: "Gastronomia",
      description: "O maior evento gastronômico da região, com shows nacionais, praça de alimentação típica e muita diversão para toda a família."
    },
    { 
      id: 2, 
      title: "Show de Rock na Serra", 
      date: "2026-11-15", 
      time: "16:00",
      location: "Parque Estadual", 
      image: "https://images.unsplash.com/photo-1459749411177-8c4750bb0e8e?auto=format&fit=crop&q=80&w=600",
      category: "Música",
      description: "As melhores bandas de rock da região se reúnem em um cenário inesquecível. Traga sua canga e curta o som na grama."
    },
    { 
      id: 3, 
      title: "Feira de Artesanato Local", 
      date: "2026-10-15", 
      time: "09:00",
      location: "Centro Histórico", 
      image: "https://images.unsplash.com/photo-1459908676235-d5f02a50184b?auto=format&fit=crop&q=80&w=600",
      category: "Cultura",
      description: "Valorize o produtor local. Peças únicas de cerâmica, tecido e madeira feitas pelos artesãos de Ouro Branco."
    },
    { 
      id: 4, 
      title: "Cinema ao Ar Livre", 
      date: "2026-10-20", 
      time: "19:30",
      location: "Praça da Matriz", 
      image: "https://images.unsplash.com/photo-1517604931442-710c8ed63fb8?auto=format&fit=crop&q=80&w=600",
      category: "Lazer",
      description: "Exibição gratuita de clássicos do cinema nacional. Pipoca liberada para as crianças!"
    },
    { 
      id: 5, 
      title: "Corrida da Inconfidência", 
      date: "2026-11-02", 
      time: "07:00",
      location: "Av. Mariza", 
      image: "https://images.unsplash.com/photo-1552674605-5d2178b85608?auto=format&fit=crop&q=80&w=600",
      category: "Esportes",
      description: "5km e 10km pelas ruas históricas da cidade. Inscreva-se e garanta seu kit com camiseta e medalha."
    }
  ];
  
  export const COMMERCIAL_CATEGORIES = [
    { name: "Gastronomia", icon: "utensils", count: 45 },
    { name: "Saúde", icon: "heart", count: 32 },
    { name: "Construção", icon: "hammer", count: 28 },
    { name: "Tecnologia", icon: "laptop", count: 15 },
    { name: "Hotéis", icon: "bed", count: 12 },
    { name: "Veículos", icon: "car", count: 20 },
  ];
  
  export const NEWS_CATEGORIES = {
    "Política & Administração Pública": [
      "Prefeitura e Câmara Municipal",
      "Projetos e obras públicas",
      "Decisões e políticas locais"
    ],
    "Economia & Comércio Local": [
      "Comércio e serviços da cidade",
      "Indústria e empregos",
      "Agricultura e produção regional"
    ],
    "Eventos & Cultura": [
      "Festas tradicionais e religiosas",
      "Shows, teatro e música",
      "Exposições e feiras"
    ],
    "Esportes Locais": [
      "Futebol amador e ligas regionais",
      "Corridas, ciclismo e esportes de rua",
      "Destaques de atletas da cidade",
      "Futebol mineiro profissional"
    ],
    "Educação": [
      "Escolas e universidades locais",
      "Projetos educacionais",
      "Concursos e oportunidades de formação"
    ],
    "Saúde & Bem-estar": [
      "Hospitais e postos de saúde",
      "Campanhas de vacinação",
      "Qualidade de vida e prevenção"
    ],
    "Segurança & Justiça": [
      "Ocorrências policiais",
      "Trânsito e mobilidade urbana",
      "Ações da guarda municipal"
    ],
    "Meio Ambiente & Sustentabilidade": [
      "Preservação de áreas verdes",
      "Projetos ambientais",
      "Questões de saneamento e água"
    ],
    "Turismo & Lazer": [
      "Pontos turísticos da cidade",
      "Trilhas e natureza",
      "Gastronomia local"
    ],
    "Comunidade & Sociedade": [
      "Histórias de moradores",
      "Projetos sociais",
      "Voluntariado e associações"
    ]
  };
  
  export const JOBS_DATA = [
    { 
      id: 1, 
      title: "Vendedor Interno", 
      company: "Moda Center", 
      category: "Comércio & Vendas",
      subcategory: "Vendedor", 
      type: "CLT", 
      salary: "R$ 1.412 + Comissão", 
      location: "Centro",
      description: "Procuramos profissional comunicativo para atendimento ao cliente e organização de loja.",
      requirements: "Ensino Médio completo. Experiência em vendas é um diferencial.",
      contact: "envie seu currículo para rh@modacenter.com.br ou zap (31) 9999-9999",
      createdAt: "2026-02-01",
      expiresAt: "2026-03-01" 
    },
    { 
      id: 2, 
      title: "Auxiliar Administrativo", 
      company: "Escritório Contábil Silva", 
      category: "Administrativo & Financeiro",
      subcategory: "Auxiliar", 
      type: "Estágio", 
      salary: "R$ 900,00", 
      location: "Bairro Pioneiros",
      description: "Vaga para estudantes de Administração ou Contabilidade. Auxílio em rotinas de escritório e arquivo.",
      requirements: "Cursando ensino superior. Conhecimento básico em Excel.",
      contact: "contato@silvacontabil.com.br",
      createdAt: "2026-02-02",
      expiresAt: "2026-02-17" 
    },
  ];
  
  export const JOB_CATEGORIES = {
    "Comércio & Vendas": ["Vendedor", "Caixa", "Atendente", "Gerente de Loja", "Repositor"],
    "Alimentação & Gastronomia": ["Cozinheiro", "Garçom", "Auxiliar de Cozinha", "Padeiro", "Entregador"],
    "Administrativo & Financeiro": ["Auxiliar Adm.", "Secretária", "Recepcionista", "Contador", "RH"],
    "Serviços Gerais & Manutenção": ["Limpeza", "Pedreiro", "Eletricista", "Mecânico", "Jardineiro"],
    "Saúde & Cuidados": ["Enfermeiro", "Técnico de Enfermagem", "Cuidador de Idosos", "Farmacêutico"],
    "Indústria & Logística": ["Operador de Máquinas", "Auxiliar de Produção", "Motorista", "Estoquista"],
    "Educação": ["Professor", "Monitor", "Pedagogo"],
    "Tecnologia & Marketing": ["Suporte Técnico", "Designer", "Social Media", "Programador"]
  };
  
  // --- NOVOS DADOS DE VEÍCULOS ---
  export const VEHICLES_DATA = [
    {
      id: 1,
      title: "Fiat Strada Volcano 1.3",
      brand: "Fiat",
      model: "Strada",
      year: 2023,
      price: 115000,
      km: 15000,
      color: "Cinza",
      fuel: "Flex",
      transmission: "Automático",
      plateEnd: "5",
      description: "Carro de único dono, todas revisões na concessionária. Completo com capota marítima.",
      photos: [
        "https://images.unsplash.com/photo-1678907379282-3208728a4546?q=80&w=800",
        "https://images.unsplash.com/photo-1533473359331-0135ef1bcfb0?q=80&w=800"
      ],
      contactPhone: "31999998888",
      userId: "user_1",
      status: "active",
      createdAt: "2026-02-01"
    },
    {
      id: 2,
      title: "Honda Civic Touring",
      brand: "Honda",
      model: "Civic",
      year: 2021,
      price: 145000,
      km: 42000,
      color: "Branco",
      fuel: "Gasolina",
      transmission: "Automático",
      plateEnd: "9",
      description: "Civic Touring impecável. Teto solar, bancos em couro claro. Sem detalhes.",
      photos: [
        "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=800"
      ],
      contactPhone: "31988887777",
      userId: "admin_master",
      status: "active",
      createdAt: "2026-02-03"
    }
  ];
  // --- GUIA COMERCIAL DE OURO BRANCO ---

export const GUIDE_CATEGORIES = [
  "Saúde & Bem-estar",
  "Emergência & Serviços Públicos",
  "Educação & Ensino",
  "Supermercados & Alimentação",
  "Automotivo & Transportes",
  "Construção & Casa",
  "Bancos & Financeiro",
  "Hotéis & Pousadas",
  "Religião & Igrejas",
  "Esportes & Academias",
  "Beleza & Estética",
  "Outros"
];

// Imagens genéricas para categorias
const IMAGES = {
  health: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=400",
  public: "https://images.unsplash.com/photo-1555529733-0e670560f7e1?auto=format&fit=crop&q=80&w=400",
  edu: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400",
  food: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=400",
  auto: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=400",
  build: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=400",
  bank: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&q=80&w=400",
  hotel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400",
  church: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=400",
  gym: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400",
  beauty: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=400"
};

export const GUIDE_DATA = [
  // SAÚDE & BEM-ESTAR
  { id: 1, name: "Hospital Raymundo Campos (Policlínica)", category: "Saúde & Bem-estar", phone: "(31) 3741-6119", address: "Praça Sagrados Corações, Centro", description: "Hospital / Urgência", image: IMAGES.health },
  { id: 2, name: "Hospital FOB (Fundação Ouro Branco)", category: "Saúde & Bem-estar", phone: "(31) 3749-6111", address: "Rod. Gov. Aureliano Chaves, 199", description: "Hospital Geral", image: IMAGES.health },
  { id: 3, name: "Secretaria Municipal de Saúde", category: "Saúde & Bem-estar", phone: "(31) 3741-4323", address: "Praça Sagrados Corações, 200", description: "Administração Saúde Pública", image: IMAGES.public },
  { id: 4, name: "UBS Centro (Maria Lúcia Barbosa)", category: "Saúde & Bem-estar", phone: "(31) 3938-1120", address: "Travessa Dom Silvério, 7, Centro", description: "Unidade Básica de Saúde", image: IMAGES.health },
  { id: 5, name: "UBS Pioneiros", category: "Saúde & Bem-estar", phone: "(31) 3938-1106", address: "Av. Intendente Câmara, 381", description: "Unidade Básica de Saúde", image: IMAGES.health },
  { id: 6, name: "UBS Siderurgia", category: "Saúde & Bem-estar", phone: "(31) 3938-1108", address: "Av. Consider, 626", description: "Unidade Básica de Saúde", image: IMAGES.health },
  { id: 7, name: "UBS Dom Orione", category: "Saúde & Bem-estar", phone: "(31) 3938-1085", address: "Rua das Flores, 400, Centro", description: "Unidade Básica de Saúde", image: IMAGES.health },
  { id: 8, name: "PSF Belvedere (José Silas Coelho)", category: "Saúde & Bem-estar", phone: "(31) 3938-1102", address: "Rua Ipê, 50, Belvedere", description: "Programa Saúde da Família", image: IMAGES.health },
  { id: 9, name: "PSF Luzia Augusta", category: "Saúde & Bem-estar", phone: "(31) 3938-1104", address: "Av. Macapá, 113A, Luzia Augusta", description: "Programa Saúde da Família", image: IMAGES.health },
  { id: 10, name: "PSF São Francisco", category: "Saúde & Bem-estar", phone: "(31) 3938-1107", address: "Rua Donato Severino, 81", description: "Programa Saúde da Família", image: IMAGES.health },
  { id: 11, name: "Farmácia Básica Municipal", category: "Saúde & Bem-estar", phone: "(31) 3938-1144", address: "Praça das Rotas, 4, Centro", description: "Medicamentos Gratuitos (SUS)", image: IMAGES.health },
  { id: 12, name: "Drogaria Santa Terezinha", category: "Saúde & Bem-estar", phone: "(31) 3741-1144", address: "Rua Santo Antônio, 759, Centro", description: "Farmácia e Perfumaria", image: IMAGES.health },
  { id: 13, name: "Drogaria Araujo", category: "Saúde & Bem-estar", phone: "(31) 3270-5000", address: "Rua Santo Antônio, Centro", description: "Farmácia", image: IMAGES.health },
  { id: 14, name: "Laboratório Carlos Chagas", category: "Saúde & Bem-estar", phone: "(31) 3742-2951", address: "Rua Benedito Valadares, 70, Centro", description: "Análises Clínicas", image: IMAGES.health },
  { id: 15, name: "Laboratório Vila Rica", category: "Saúde & Bem-estar", phone: "(31) 3741-1119", address: "Rua João XXIII, 445, Centro", description: "Análises Clínicas", image: IMAGES.health },
  { id: 16, name: "Laboratório FOB", category: "Saúde & Bem-estar", phone: "(31) 3749-6168", address: "Rua Aureliano Chaves, 199, Soledade", description: "Análises Clínicas", image: IMAGES.health },
  { id: 17, name: "Clínica OralDents", category: "Saúde & Bem-estar", phone: "(31) 99881-9780", address: "Rua Santo Antônio, 797, Centro", description: "Tratamento Odontológico", image: IMAGES.health },
  { id: 18, name: "Clínica Sorrisos", category: "Saúde & Bem-estar", phone: "(31) 3742-1100", address: "Av. Mariza de Souza Mendes, 1177", description: "Tratamento Odontológico", image: IMAGES.health },
  { id: 19, name: "Bichos e Caprichos", category: "Saúde & Bem-estar", phone: "(31) 3741-1000", address: "Intendente Câmara, 178, Pioneiros", description: "Clínica Veterinária e Pet Shop", image: IMAGES.health },
  { id: 20, name: "Centro de Bem Estar Animal", category: "Saúde & Bem-estar", phone: "(31) 3938-1083", address: "Rua da Fiel, 239, Siderurgia", description: "Atendimento Veterinário Público", image: IMAGES.health },

  // EMERGÊNCIA & SERVIÇOS PÚBLICOS
  { id: 21, name: "Prefeitura Municipal", category: "Emergência & Serviços Públicos", phone: "(31) 3749-6000", address: "Praça Sagrados Corações, 200", description: "Sede Administrativa", image: IMAGES.public },
  { id: 22, name: "Câmara Municipal", category: "Emergência & Serviços Públicos", phone: "(31) 3741-1225", address: "Praça Sagrados Corações, 200", description: "Poder Legislativo", image: IMAGES.public },
  { id: 23, name: "Polícia Militar (190)", category: "Emergência & Serviços Públicos", phone: "190", address: "Consultar Batalhão Local", description: "Segurança Pública", image: IMAGES.public },
  { id: 24, name: "Polícia Civil", category: "Emergência & Serviços Públicos", phone: "(31) 3741-1242", address: "Consultar Local", description: "Delegacia", image: IMAGES.public },
  { id: 25, name: "Cartório Eleitoral", category: "Emergência & Serviços Públicos", phone: "(31) 3741-1976", address: "Av. Patriótica, Centro", description: "Serviços Eleitorais", image: IMAGES.public },
  { id: 26, name: "Correios", category: "Emergência & Serviços Públicos", phone: "(31) 3741-1583", address: "Rua Santo Antônio, Centro", description: "Encomendas e Correspondências", image: IMAGES.public },
  { id: 27, name: "COPASA (Água)", category: "Emergência & Serviços Públicos", phone: "115", address: "Atendimento Virtual/Tel", description: "Abastecimento de Água e Esgoto", image: IMAGES.public },
  { id: 28, name: "CEMIG (Energia)", category: "Emergência & Serviços Públicos", phone: "116", address: "Atendimento Virtual/Tel", description: "Energia Elétrica", image: IMAGES.public },
  { id: 29, name: "Secretaria de Obras", category: "Emergência & Serviços Públicos", phone: "(31) 3749-6042", address: "Prefeitura (Anexo)", description: "Serviços Urbanos", image: IMAGES.public },
  { id: 30, name: "Secretaria de Educação", category: "Emergência & Serviços Públicos", phone: "(31) 3938-1170", address: "Praça Sagrados Corações, 200", description: "Gestão Educacional", image: IMAGES.public },
  { id: 31, name: "Secretaria Promoção Social", category: "Emergência & Serviços Públicos", phone: "(31) 3749-6034", address: "Prefeitura (Anexo)", description: "Assistência Social", image: IMAGES.public },

  // EDUCAÇÃO
  { id: 32, name: "IFMG Campus Ouro Branco", category: "Educação & Ensino", phone: "(31) 3938-1200", address: "R. Afonso Sardinha, 90, Pioneiros", description: "Ensino Técnico e Superior Público", image: IMAGES.edu },
  { id: 33, name: "UFSJ Campus Ouro Branco", category: "Educação & Ensino", phone: "(31) 3741-0000", address: "Rod. MG 443, KM 7", description: "Universidade Federal", image: IMAGES.edu },
  { id: 34, name: "Colégio Arquidiocesano", category: "Educação & Ensino", phone: "(31) 3742-1834", address: "Rua Comendador Carlos Wigg, 245", description: "Escola Particular", image: IMAGES.edu },
  { id: 35, name: "Wizard Idiomas", category: "Educação & Ensino", phone: "(31) 3742-1159", address: "Rua Dom Rodrigo J. Menezes, 222", description: "Escola de Inglês e Idiomas", image: IMAGES.edu },
  { id: 36, name: "E.M. Dom Luciano", category: "Educação & Ensino", phone: "(31) 3741-0240", address: "Bairro São Francisco", description: "Escola Municipal", image: IMAGES.edu },
  { id: 37, name: "E.E. Maria Corrêa Coutinho", category: "Educação & Ensino", phone: "(31) 3741-1576", address: "Consultar Endereço", description: "Escola Estadual", image: IMAGES.edu },

  // SUPERMERCADOS E ALIMENTAÇÃO
  { id: 38, name: "Supermercados BH", category: "Supermercados & Alimentação", phone: "(31) 3742-1576", address: "Rua Ivanilde Matias Bueno, 60", description: "Rede de Supermercados", image: IMAGES.food },
  { id: 39, name: "Supermercado Epa", category: "Supermercados & Alimentação", phone: "Local", address: "Av. Mariza de Souza Mendes", description: "Rede de Supermercados", image: IMAGES.food },
  { id: 40, name: "Restaurante Tureba", category: "Supermercados & Alimentação", phone: "(31) 98529-6536", address: "Rua Geraldo F. de Azevedo, 03", description: "Restaurante e Choperia", image: IMAGES.food },
  { id: 41, name: "Restaurante Malu", category: "Supermercados & Alimentação", phone: "(31) 3741-1556", address: "Praça São José, 04", description: "Self-service e Prato Feito", image: IMAGES.food },
  { id: 42, name: "Pizzaria Duas Irmãs", category: "Supermercados & Alimentação", phone: "(31) 3741-1411", address: "Rua Santo Antônio, 89", description: "Pizzaria Tradicional", image: IMAGES.food },
  { id: 43, name: "Dom Guilherme Pizzaria", category: "Supermercados & Alimentação", phone: "(31) 98351-9982", address: "Rua Peroba, 411, Belvedere", description: "Delivery e Salão", image: IMAGES.food },
  { id: 44, name: "Zema Eletro", category: "Supermercados & Alimentação", phone: "(31) 3742-3796", address: "Av. Mariza de Souza Mendes, 790", description: "Móveis e Eletrodomésticos", image: IMAGES.food }, // Deixei aqui pois o user agrupou, mas pode mover

  // AUTOMOTIVO
  { id: 45, name: "Guipare Bosch Car Service", category: "Automotivo & Transportes", phone: "(31) 3742-1774", address: "Av. Mariza de Souza Mendes, 95", description: "Oficina Mecânica Especializada", image: IMAGES.auto },
  { id: 46, name: "Posto Ipiranga", category: "Automotivo & Transportes", phone: "Local", address: "Av. Maria Firmina da Silva, 444", description: "Combustíveis e Conveniência", image: IMAGES.auto },
  { id: 47, name: "Posto Petrobras", category: "Automotivo & Transportes", phone: "Local", address: "Av. Mariza de Souza Mendes, 31", description: "Combustíveis", image: IMAGES.auto },
  { id: 48, name: "Localiza Aluguel de Carros", category: "Automotivo & Transportes", phone: "Local", address: "Av. Mariza de Souza Mendes, 173", description: "Locadora de Veículos", image: IMAGES.auto },

  // CONSTRUÇÃO
  { id: 49, name: "Depósito Real (Rede Construir)", category: "Construção & Casa", phone: "(31) 3741-4746", address: "Rua Prof. José Luiz Alves, 306", description: "Materiais de Construção", image: IMAGES.build },
  { id: 50, name: "Ouro Branco Madeiras", category: "Construção & Casa", phone: "(31) 99930-1811", address: "Travessa Macapá, 75, Alto do Chalé", description: "Madeireira e Materiais", image: IMAGES.build },

  // BANCOS
  { id: 51, name: "Banco do Brasil", category: "Bancos & Financeiro", phone: "(31) 3741-1056", address: "Rua Santo Antônio, 253, Centro", description: "Agência Bancária", image: IMAGES.bank },
  { id: 52, name: "Caixa Econômica Federal", category: "Bancos & Financeiro", phone: "(31) 3741-1035", address: "Rua Santo Antônio, 798, Centro", description: "Agência Bancária", image: IMAGES.bank },
  { id: 53, name: "Banco Santander", category: "Bancos & Financeiro", phone: "(31) 3741-1120", address: "Rua Santo Antônio, 557, Centro", description: "Agência Bancária", image: IMAGES.bank },
  { id: 54, name: "Banco Itaú", category: "Bancos & Financeiro", phone: "Local", address: "Rua Santo Antônio, 213, Centro", description: "Agência Bancária", image: IMAGES.bank },
  { id: 55, name: "Sicoob", category: "Bancos & Financeiro", phone: "4000-1111", address: "Consultar Agência Local", description: "Cooperativa de Crédito", image: IMAGES.bank },
  { id: 56, name: "Casa Lotérica", category: "Bancos & Financeiro", phone: "Local", address: "Rua Santo Antônio (Centro)", description: "Loterias e Pagamentos", image: IMAGES.bank },

  // HOTÉIS
  { id: 57, name: "Hotel Fazenda Pé do Morro", category: "Hotéis & Pousadas", phone: "(31) 3741-8181", address: "Rod. MG-129, Km 174", description: "Hotel Fazenda e Lazer", image: IMAGES.hotel },
  { id: 58, name: "Hotel Mirante da Serra", category: "Hotéis & Pousadas", phone: "(31) 3741-1100", address: "Rua Santo Antônio, 456, Centro", description: "Hospedagem", image: IMAGES.hotel },
  { id: 59, name: "Hotel Ouro de Minas", category: "Hotéis & Pousadas", phone: "(31) 3741-5181", address: "Rua José Fortunato Rodrigues, 168", description: "Hospedagem", image: IMAGES.hotel },
  { id: 60, name: "Hotel Verdes Mares", category: "Hotéis & Pousadas", phone: "(31) 3741-1240", address: "Rua Santo Antônio, 115, Centro", description: "Hospedagem", image: IMAGES.hotel },
  { id: 61, name: "Mirante Flat", category: "Hotéis & Pousadas", phone: "(31) 3741-4109", address: "Av. Maria Firmina da Silva, 239", description: "Hospedagem tipo Flat", image: IMAGES.hotel },
  { id: 62, name: "Serra Palace Hotel", category: "Hotéis & Pousadas", phone: "(31) 3742-3848", address: "Rua José Pereira Sobrinho, 350", description: "Hospedagem", image: IMAGES.hotel },
  { id: 63, name: "Pousada Estrada Real", category: "Hotéis & Pousadas", phone: "(31) 3741-2027", address: "Rua Santo Antônio, 567, Centro", description: "Pousada", image: IMAGES.hotel },

  // IGREJAS
  { id: 64, name: "Paróquia Santo Antônio", category: "Religião & Igrejas", phone: "(31) 3742-1007", address: "Praça Santa Cruz, 198, Centro", description: "Igreja Católica", image: IMAGES.church },
  { id: 65, name: "Paróquia Sagrada Família", category: "Religião & Igrejas", phone: "(31) 3742-1218", address: "Rua Amintas Jacques de Morais, 820", description: "Igreja Católica", image: IMAGES.church },
  { id: 66, name: "Igreja Universal", category: "Religião & Igrejas", phone: "(31) 99172-1775", address: "Rua Santo Antônio, 655, Centro", description: "Igreja Evangélica", image: IMAGES.church },

  // ACADEMIAS E BELEZA
  { id: 67, name: "Body Fit Academia", category: "Esportes & Academias", phone: "(31) 99907-7911", address: "Av. Mariza de Souza Mendes, 1614", description: "Musculação e Fitness", image: IMAGES.gym },
  { id: 68, name: "Contorno do Corpo", category: "Esportes & Academias", phone: "Local", address: "Ouro Branco", description: "Academia", image: IMAGES.gym },
  { id: 69, name: "Bella Hair Cosméticos", category: "Beleza & Estética", phone: "Local", address: "Rua Santo Antônio, 309, Centro", description: "Produtos de Beleza", image: IMAGES.beauty }
];