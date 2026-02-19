import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, TrendingUp, Tag, Loader, ExternalLink, AlertTriangle } from 'lucide-react';

// === SEUS DADOS DE AFILIADO DO MERCADO LIVRE ===
const AFFILIATE_TOOL_ID = '76548994'; 
const AFFILIATE_WORD = 'forjadomago';

// === CATEGORIAS OFICIAIS DO MERCADO LIVRE (IDs REAIS) ===
const CATEGORIES = [
  { id: 'bestsellers', label: 'Mais procurados', query: 'ofertas', icon: TrendingUp },
  { id: 'supermercado', label: 'Supermercado', categoryId: 'MLB1403' },
  { id: 'tecnologia', label: 'Tecnologia (Celulares)', categoryId: 'MLB1051' },
  { id: 'informatica', label: 'Informática', categoryId: 'MLB1648' },
  { id: 'casa', label: 'Casa e Móveis', categoryId: 'MLB1574' },
  { id: 'eletro', label: 'Eletrodomésticos', categoryId: 'MLB5726' },
  { id: 'esportes', label: 'Esportes e Fitness', categoryId: 'MLB1276' },
  { id: 'ferramentas', label: 'Ferramentas', categoryId: 'MLB407134' },
  { id: 'construcao', label: 'Construção', categoryId: 'MLB1500' },
  { id: 'industria', label: 'Indústria e Comércio', categoryId: 'MLB1499' },
  { id: 'pet', label: 'Pet Shop', categoryId: 'MLB1071' },
  { id: 'saude', label: 'Saúde', categoryId: 'MLB409431' },
  { id: 'veiculos', label: 'Acessórios Veículos', categoryId: 'MLB5672' },
  { id: 'beleza', label: 'Beleza e Cuidado', categoryId: 'MLB1246' },
  { id: 'moda', label: 'Moda', categoryId: 'MLB1430' },
  { id: 'bebes', label: 'Bebês', categoryId: 'MLB1384' },
  { id: 'brinquedos', label: 'Brinquedos', categoryId: 'MLB1132' },
];

export default function OffersPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Adiciona o código de comissão no link do produto
  const makeAffiliateLink = (originalUrl) => {
    if (!originalUrl) return '#';
    const cleanUrl = originalUrl.split('#')[0]; 
    const separator = cleanUrl.includes('?') ? '&' : '?';
    return `${cleanUrl}${separator}matt_tool=${AFFILIATE_TOOL_ID}&matt_word=${AFFILIATE_WORD}`;
  };

  // Busca na API (Sem bloqueios de segurança do navegador)
  const fetchProducts = async (categoryObj) => {
    setLoading(true);
    setError(null);
    
    // Monta a URL inteligente baseada na ID oficial da categoria ou na busca
    let mlUrl = `https://api.mercadolibre.com/sites/MLB/search?limit=24`;
    if (categoryObj.categoryId) mlUrl += `&category=${categoryObj.categoryId}`;
    if (categoryObj.query) mlUrl += `&q=${encodeURIComponent(categoryObj.query)}`;

    try {
      // Requisição direta e simples
      const response = await fetch(mlUrl);
      
      if (!response.ok) throw new Error("O Mercado Livre não respondeu corretamente.");
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const formattedProducts = data.results.map(item => {
          // Pega imagem em alta resolução
          const highResImage = item.thumbnail ? item.thumbnail.replace('I.jpg', 'W.jpg') : 'https://placehold.co/400x400?text=Sem+Foto';
          
          return {
            id: item.id,
            title: item.title || 'Produto',
            price: item.price || 0,
            originalPrice: item.original_price, 
            image: highResImage,
            link: makeAffiliateLink(item.permalink),
            installments: item.installments ? `${item.installments.quantity}x de R$ ${item.installments.amount.toFixed(2)}` : null,
            freeShipping: item.shipping?.free_shipping || false
          };
        });
        setProducts(formattedProducts);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Erro na busca de produtos:", err);
      setError("Houve um problema de conexão com o catálogo de ofertas.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Dispara a busca toda vez que clicar em uma categoria no menu
  useEffect(() => {
    fetchProducts(activeCategory);
  }, [activeCategory]);

  // Função para a barra de pesquisa manual
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setActiveCategory({ id: 'busca', label: `Resultados para: ${searchTerm}`, query: searchTerm });
    }
  };

  return (
    <div className="animate-in fade-in pb-12 flex flex-col md:flex-row gap-6">
      
      {/* MENU LATERAL ESQUERDO */}
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

      {/* ÁREA CENTRAL DE PRODUTOS */}
      <div className="flex-1">
        {/* Banner amarelo estilo ML */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-6 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-900">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <ShoppingCart size={28} /> Shopping Link da Cidade
            </h2>
            <p className="text-sm font-medium opacity-80 mt-1">
              As melhores ofertas atualizadas automaticamente para você.
            </p>
          </div>
          
          {/* Barra de Pesquisa */}
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

        <div className="flex justify-between items-center mb-4">
           <h3 className="text-xl font-bold text-slate-800">{activeCategory.label}</h3>
           {error && (
              <button onClick={() => fetchProducts(activeCategory)} className="text-xs bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-full hover:bg-indigo-200 transition">
                Tentar Novamente
              </button>
           )}
        </div>

        {/* FEEDBACKS (Carregando / Erro) */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-indigo-600">
            <Loader size={48} className="animate-spin mb-4" />
            <p className="font-medium animate-pulse">Buscando o catálogo ao vivo...</p>
          </div>
        ) : error ? (
          <div className="col-span-full py-12 text-center text-red-500 bg-red-50 rounded-2xl flex flex-col items-center">
            <AlertTriangle size={40} className="mb-3 opacity-50"/>
            <p className="font-medium">{error}</p>
          </div>
        ) : (
          /* GRID DE PRODUTOS */
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.length > 0 ? products.map(product => (
              <a 
                key={product.id} 
                href={product.link} 
                target="_blank" 
                rel="noreferrer"
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col h-full"
              >
                <div className="h-48 p-4 bg-white flex items-center justify-center border-b border-slate-50 relative">
                  <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
                
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