import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, TrendingUp, Tag, Loader, ExternalLink } from 'lucide-react';

// === SEUS DADOS DE AFILIADO DO MERCADO LIVRE ===
const AFFILIATE_TOOL_ID = '76548994'; 
const AFFILIATE_WORD = 'forjadomago';

// Lista de Categorias baseada na sua imagem
const CATEGORIES = [
  { id: 'bestsellers', label: 'Mais procurados', query: 'ofertas', icon: TrendingUp },
  { id: 'supermercado', label: 'Supermercado', query: 'supermercado ofertas' },
  { id: 'tecnologia', label: 'Tecnologia', query: 'tecnologia' },
  { id: 'casa', label: 'Casa e Móveis', query: 'casa e moveis' },
  { id: 'eletro', label: 'Eletrodomésticos', query: 'eletrodomésticos' },
  { id: 'esportes', label: 'Esportes e Fitness', query: 'esportes e fitness' },
  { id: 'ferramentas', label: 'Ferramentas', query: 'ferramentas' },
  { id: 'construcao', label: 'Construção', query: 'construção' },
  { id: 'industria', label: 'Indústria e Comércio', query: 'industria e comercio' },
  { id: 'negocio', label: 'Para seu Negócio', query: 'equipamentos para comercio' },
  { id: 'pet', label: 'Pet Shop', query: 'pet shop' },
  { id: 'saude', label: 'Saúde', query: 'saúde' },
  { id: 'veiculos', label: 'Acessórios para Veículos', query: 'acessórios para veículos' },
  { id: 'beleza', label: 'Beleza e Cuidado Pessoal', query: 'beleza e cuidado pessoal' },
  { id: 'moda', label: 'Moda', query: 'moda' },
  { id: 'bebes', label: 'Bebês', query: 'bebês' },
  { id: 'brinquedos', label: 'Brinquedos', query: 'brinquedos' },
];

export default function OffersPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Função para injetar os seus dados de afiliado no link do produto
  const makeAffiliateLink = (originalUrl) => {
    const cleanUrl = originalUrl.split('#')[0]; 
    // Verifica se a URL já tem um '?' para não quebrar a estrutura do link
    const separator = cleanUrl.includes('?') ? '&' : '?';
    
    // Adiciona os seus códigos de rastreio no final do link de qualquer produto
    return `${cleanUrl}${separator}matt_tool=${AFFILIATE_TOOL_ID}&matt_word=${AFFILIATE_WORD}`;
  };

  // Função para buscar produtos na API Pública do Mercado Livre
  const fetchProducts = async (queryText) => {
    setLoading(true);
    try {
      // Usamos a API de busca do Brasil (MLB) ordenando por relevância
      const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(queryText)}&limit=24`);
      const data = await response.json();
      
      if (data.results) {
        // Formatando os dados recebidos
        const formattedProducts = data.results.map(item => {
          // A API do ML retorna uma foto pequena (thumbnail com final 'I.jpg'). Trocamos para 'W.jpg' para alta resolução
          const highResImage = item.thumbnail.replace('I.jpg', 'W.jpg');
          
          return {
            id: item.id,
            title: item.title,
            price: item.price,
            originalPrice: item.original_price, // Pode ser null se não tiver desconto
            image: highResImage,
            link: makeAffiliateLink(item.permalink),
            installments: item.installments ? `${item.installments.quantity}x de R$ ${item.installments.amount.toFixed(2)}` : null,
            freeShipping: item.shipping?.free_shipping || false
          };
        });
        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error("Erro ao buscar ofertas do Mercado Livre:", error);
    } finally {
      setLoading(false);
    }
  };

  // Dispara a busca automática sempre que a categoria muda
  useEffect(() => {
    fetchProducts(activeCategory.query);
  }, [activeCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchProducts(searchTerm);
      setActiveCategory({ id: 'busca', label: `Resultados para: ${searchTerm}`, query: searchTerm });
    }
  };

  return (
    <div className="animate-in fade-in pb-12 flex flex-col md:flex-row gap-6">
      
      {/* MENU LATERAL DE CATEGORIAS */}
      <aside className="w-full md:w-64 shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 h-fit sticky top-24 z-10">
        <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
          <Tag className="text-indigo-600" size={20} />
          Categorias
        </h3>
        <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible scrollbar-hide pb-2 md:pb-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat); setSearchTerm(''); }}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap md:whitespace-normal text-left
                ${activeCategory.id === cat.id 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm border-l-4 border-indigo-600' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'}`}
            >
              {cat.icon && <cat.icon size={16} />}
              {cat.label}
            </button>
          ))}
        </div>
      </aside>

      {/* ÁREA DE PRODUTOS */}
      <div className="flex-1">
        {/* Cabeçalho e Barra de Busca */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-6 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-900">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <ShoppingCart size={28} /> Shopping Link da Cidade
            </h2>
            <p className="text-sm font-medium opacity-80 mt-1">
              As melhores ofertas atualizadas automaticamente para você.
            </p>
          </div>
          
          <form onSubmit={handleSearch} className="w-full md:w-auto relative flex-1 max-w-md">
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar produtos..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-indigo-600 outline-none text-sm"
            />
            <Search className="absolute left-3 top-3 text-slate-400" size={20}/>
          </form>
        </div>

        {/* Título da Seção Atual */}
        <h3 className="text-xl font-bold text-slate-800 mb-4">{activeCategory.label}</h3>

        {/* Grid de Produtos */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-indigo-600">
            <Loader size={48} className="animate-spin mb-4" />
            <p className="font-medium animate-pulse">Buscando as melhores ofertas ao vivo...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.length > 0 ? products.map(product => (
              <a 
                key={product.id} 
                href={product.link} 
                target="_blank" 
                rel="noreferrer"
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col h-full"
              >
                {/* Imagem do Produto */}
                <div className="h-48 p-4 bg-white flex items-center justify-center border-b border-slate-50 relative">
                  <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                  {/* Etiqueta de Desconto */}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
                
                {/* Dados do Produto */}
                <div className="p-4 flex flex-col flex-1">
                  <h4 className="text-xs text-slate-600 font-medium line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                    {product.title}
                  </h4>
                  
                  <div className="mt-auto">
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-[10px] text-slate-400 line-through mb-0.5">
                        {product.originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    )}
                    <p className="text-xl font-black text-slate-800 leading-none">
                      {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    
                    {product.installments && (
                      <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                        em {product.installments}
                      </p>
                    )}
                    
                    {product.freeShipping && (
                      <p className="text-[10px] font-bold text-emerald-600 mt-2 flex items-center gap-1 bg-emerald-50 w-fit px-1.5 py-0.5 rounded">
                        Frete grátis
                      </p>
                    )}
                  </div>
                </div>
              </a>
            )) : (
              <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                Nenhuma oferta encontrada para esta categoria no momento.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}