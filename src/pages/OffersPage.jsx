import React, { useState } from 'react';
import { ShoppingCart, Search, TrendingUp, Tag, Smartphone } from 'lucide-react';

const CATEGORIES = [
  { id: 'bestsellers', label: 'Ofertas do dia', icon: TrendingUp },
  { 
    id: 'tecnologia', 
    label: 'Celulares e Tecnologia', 
    icon: Smartphone,
    subcategories: [
      { id: 'celulares', label: 'Celulares e Telefones' },
      { id: 'informatica', label: 'Informática' },
      { id: 'cameras', label: 'Câmeras e Acessórios' },
      { id: 'eletronicos', label: 'Áudio, Vídeo e Eletrônicos' },
      { id: 'games', label: 'Games e Consoles' },
      { id: 'tvs', label: 'Televisores' }
    ]
  },
  { id: 'casa', label: 'Casa e Móveis' },
  { id: 'supermercado', label: 'Supermercado' },
  { id: 'eletro', label: 'Eletrodomésticos' },
  { id: 'ferramentas', label: 'Ferramentas' },
  { id: 'construcao', label: 'Construção' },
  { id: 'moda', label: 'Moda e Beleza' }
];

export default function OffersPage({ offersData }) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [activeSubCategory, setActiveSubCategory] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setActiveSubCategory(null);
    setSearchTerm('');
  };

  const displayedOffers = (offersData || []).filter(offer => {
    if (searchTerm) return offer.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Mostra tudo se for Ofertas do dia
    if (activeCategory.id === 'bestsellers') return true; 
    
    // Lógica para subgrupos de Tecnologia
    if (activeCategory.subcategories) {
       if (activeSubCategory) {
          return offer.category === activeSubCategory.id;
       } else {
          return activeCategory.subcategories.some(sub => sub.id === offer.category) || offer.category === activeCategory.id;
       }
    }
    
    return offer.category === activeCategory.id;
  });

  return (
    <div className="animate-in fade-in pb-12 flex flex-col md:flex-row gap-6">
      
      {/* MENU LATERAL */}
      <aside className="w-full md:w-64 shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 h-fit sticky top-24 z-10">
        <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
          <Tag className="text-indigo-600" size={20} /> Categorias
        </h3>
        <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible scrollbar-hide pb-2 md:pb-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap md:whitespace-normal text-left
                ${activeCategory.id === cat.id && !searchTerm
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm border-l-4 border-indigo-600' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'}`}
            >
              {cat.icon && <cat.icon size={16} />} {cat.label}
            </button>
          ))}
        </div>
      </aside>

      {/* ÁREA DE PRODUTOS */}
      <div className="flex-1 w-full overflow-hidden">
        
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-6 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-900">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <ShoppingCart size={28} /> Shopping Link da Cidade
            </h2>
            <p className="text-sm font-medium opacity-80 mt-1">Ofertas atualizadas automaticamente para você.</p>
          </div>
          
          <div className="w-full md:w-auto relative flex-1 max-w-md">
            <input 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Pesquisar ofertas..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-indigo-600 outline-none text-sm"
            />
            <Search className="absolute left-3 top-3 text-slate-400" size={20}/>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-4">
          {searchTerm ? `Buscando por: "${searchTerm}"` : activeCategory.label}
        </h3>

        {/* === MENU DE SUBGRUPOS === */}
        {activeCategory.subcategories && !searchTerm && (
          <div className="flex flex-wrap gap-2 mb-6 pb-2">
            <button 
               onClick={() => setActiveSubCategory(null)}
               className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${!activeSubCategory ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Todos
            </button>
            {activeCategory.subcategories.map(sub => (
              <button 
                 key={sub.id}
                 onClick={() => setActiveSubCategory(sub)}
                 className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${activeSubCategory?.id === sub.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* GRID DE PRODUTOS */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedOffers.length > 0 ? displayedOffers.map(product => (
            <a key={product.id} href={product.link} target="_blank" rel="noreferrer" className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col h-full relative">
              
              <div className="h-48 p-4 bg-white flex items-center justify-center border-b border-slate-50 relative">
                <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" />
                
                {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                  <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                <h4 className="text-xs text-slate-600 font-medium line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                  {product.title}
                </h4>
                <div className="mt-auto">
                  {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                    <p className="text-[10px] text-slate-400 line-through mb-0.5">
                      {Number(product.originalPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  )}
                  <p className="text-xl font-black text-slate-800 leading-none">
                    {Number(product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                  {product.installments && (
                    <p className="text-[10px] text-emerald-600 font-semibold mt-1">{product.installments}</p>
                  )}
                </div>
              </div>
            </a>
          )) : (
            <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
              Nenhuma oferta encontrada para esta categoria no momento.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}