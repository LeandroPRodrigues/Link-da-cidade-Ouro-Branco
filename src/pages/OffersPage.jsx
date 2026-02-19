import React, { useState } from 'react';
import { ShoppingCart, Search, ExternalLink, Zap } from 'lucide-react';

// === SEUS DADOS DE AFILIADO DO MERCADO LIVRE ===
const AFFILIATE_TOOL_ID = '76548994'; 
const AFFILIATE_WORD = 'forjadomago';

// Função que gera o link de afiliado oficial apontando direto para a busca do ML
const getAffiliateUrl = (searchQuery) => {
  return `https://lista.mercadolivre.com.br/${encodeURIComponent(searchQuery)}?matt_tool=${AFFILIATE_TOOL_ID}&matt_word=${AFFILIATE_WORD}`;
};

// Categorias com imagens premium para a Vitrine
const CATEGORIES = [
  { id: 'bestsellers', label: 'Super Ofertas do Dia', query: 'ofertas', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&q=80' },
  { id: 'tecnologia', label: 'Celulares & Tecnologia', query: 'celulares e smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80' },
  { id: 'supermercado', label: 'Supermercado', query: 'supermercado', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80' },
  { id: 'informatica', label: 'Informática & PCs', query: 'informatica', image: 'https://images.unsplash.com/photo-1531297180b27-b55b06f5e00c?w=500&q=80' },
  { id: 'casa', label: 'Casa, Móveis e Decoração', query: 'casa e moveis', image: 'https://images.unsplash.com/photo-1583847268964-b28ce8f311eb?w=500&q=80' },
  { id: 'eletro', label: 'Eletrodomésticos', query: 'eletrodomesticos', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&q=80' },
  { id: 'esportes', label: 'Esportes e Fitness', query: 'esportes e fitness', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80' },
  { id: 'ferramentas', label: 'Ferramentas', query: 'ferramentas', image: 'https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?w=500&q=80' },
  { id: 'construcao', label: 'Material de Construção', query: 'materiais de construcao', image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=500&q=80' },
  { id: 'industria', label: 'Indústria e Comércio', query: 'industria e comercio', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80' },
  { id: 'veiculos', label: 'Acessórios para Veículos', query: 'acessorios para veiculos', image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500&q=80' },
  { id: 'beleza', label: 'Beleza e Cuidados', query: 'beleza e cuidado pessoal', image: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=500&q=80' },
  { id: 'moda', label: 'Moda e Roupas', query: 'moda', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80' },
  { id: 'pet', label: 'Pet Shop', query: 'pet shop', image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&q=80' },
  { id: 'saude', label: 'Saúde e Bem-estar', query: 'saude e bem estar', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500&q=80' },
  { id: 'bebes', label: 'Bebês e Crianças', query: 'bebes', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500&q=80' },
  { id: 'brinquedos', label: 'Brinquedos', query: 'brinquedos', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500&q=80' },
];

export default function OffersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Quando o usuário pesquisa algo, joga ele direto no ML com o link de afiliado
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.open(getAffiliateUrl(searchTerm), '_blank');
      setSearchTerm('');
    }
  };

  return (
    <div className="animate-in fade-in pb-12 flex flex-col gap-6">
      
      {/* BANNER PRINCIPAL */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-slate-900 w-full md:w-auto">
          <h2 className="text-3xl font-black flex items-center gap-3 mb-2">
            <ShoppingCart size={32} /> Shopping Link da Cidade
          </h2>
          <p className="text-base font-medium opacity-90 max-w-md">
            Compre no Mercado Livre ajudando nossa plataforma. Pesquise um produto ou escolha uma categoria abaixo!
          </p>
        </div>
        
        {/* BARRA DE PESQUISA */}
        <form onSubmit={handleSearch} className="w-full md:w-auto relative flex-1 max-w-xl">
          <input 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Ex: iPhone 15, Geladeira, Tênis..." 
            className="w-full pl-12 pr-4 py-4 rounded-xl border-none shadow-lg focus:ring-4 focus:ring-yellow-300 outline-none text-base font-medium"
          />
          <Search className="absolute left-4 top-4 text-slate-400" size={24}/>
          <button type="submit" className="hidden"></button>
        </form>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Zap className="text-indigo-600 fill-indigo-600" size={20} /> Categorias em Destaque
        </h3>
        <p className="text-slate-500 text-sm mt-1">Clique para ver as melhores promoções oficiais.</p>
      </div>

      {/* GRID DE VITRINE DE CATEGORIAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {CATEGORIES.map(category => (
          <a 
            key={category.id} 
            href={getAffiliateUrl(category.query)} 
            target="_blank" 
            rel="noreferrer"
            className="relative h-40 md:h-48 rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* IMAGEM DE FUNDO */}
            <img 
              src={category.image} 
              alt={category.label} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            {/* CAMADA ESCURA POR CIMA DA IMAGEM PARA DAR LEITURA */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent transition-colors group-hover:from-indigo-900/90"></div>
            
            {/* TEXTOS */}
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              <h4 className="text-white font-bold text-lg leading-tight mb-2 drop-shadow-md">
                {category.label}
              </h4>
              <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-400 uppercase tracking-wider">
                Ver Ofertas <ExternalLink size={12} />
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* AVISO DE CONFIANÇA */}
      <div className="mt-8 bg-slate-100 rounded-2xl p-6 text-center border border-slate-200">
        <p className="text-slate-500 text-sm">
          <strong>Compra 100% Segura:</strong> Ao clicar, você será redirecionado para o ambiente oficial do Mercado Livre. 
          Nós somos parceiros oficiais e você não paga nada a mais por isso!
        </p>
      </div>

    </div>
  );
}