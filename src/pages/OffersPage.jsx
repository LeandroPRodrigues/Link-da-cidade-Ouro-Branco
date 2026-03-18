import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingBag, Search, Percent, ChevronDown, Zap, Grid, Filter, List } from 'lucide-react';
import { createSlug } from '../App'; // Importa a função de slug do App para consistência

export default function OffersPage({ offersData, onOfferClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Estado dos filtros. Pode ser 'all', 'daily', 'group', 'category'
  const [activeFilter, setActiveFilter] = useState({ type: 'all', group: null, category: null });

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleCloseMenu = () => setIsMenuOpen(false);
    if (isMenuOpen) { window.addEventListener('click', handleCloseMenu); }
    return () => window.removeEventListener('click', handleCloseMenu);
  }, [isMenuOpen]);

  // 1. Extrai Estrutura Dinâmica (Lê o banco de dados e organiza em hierarchy)
  const menuStructure = useMemo(() => {
    const data = (offersData || []).filter(o => o.status !== 'inactive');
    const structure = {};
    
    // Lista de grupos e categorias que não devem aparecer no menu flutuante (pois já são fixos)
    const excludeCategories = ['bestsellers', 'ofertas do dia', 'ofertas-do-dia'];

    data.forEach(offer => {
      const gName = offer.group || offer.grupo;
      const cName = offer.category || offer.categoria;
      
      // Ignora se for ofertas do dia ou se faltar dados
      if (!gName || !cName || excludeCategories.includes(cName.toLowerCase()) || excludeCategories.includes(createSlug(cName))) return;

      if (!structure[gName]) {
        structure[gName] = new Set();
      }
      structure[gName].add(cName);
    });

    // Converte Sets para Arrays ordenados
    return Object.keys(structure).sort().map(group => ({
      group,
      categories: Array.from(structure[group]).sort()
    }));
  }, [offersData]);

  // 2. Aplica os Filtros
  const filteredOffers = useMemo(() => {
    const data = (offersData || []).filter(o => o.status !== 'inactive');
    
    return data.filter(offer => {
      // Busca (Título ou Descrição)
      const matchSearch = offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          offer.description?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;

      const offerGroup = offer.group || offer.grupo;
      const offerCategory = offer.category || offer.categoria;

      // Filtros do Menu
      switch (activeFilter.type) {
        case 'all': return true;
        case 'daily': 
          // Checa se é bestsellers (ou as variações de texto)
          const isDaily = offerCategory && (offerCategory.toLowerCase() === 'bestsellers' || offerCategory.toLowerCase() === 'ofertas do dia' || createSlug(offerCategory) === 'ofertas-do-dia');
          return isDaily;
        case 'group': return offerGroup === activeFilter.group;
        case 'category': return offerGroup === activeFilter.group && offerCategory === activeFilter.category;
        default: return true;
      }
    });
  }, [offersData, searchTerm, activeFilter]);

  // Texto amigável para o breadcrumb
  const getFilterText = () => {
    switch (activeFilter.type) {
      case 'all': return 'Todas as Ofertas';
      case 'daily': return 'Ofertas do Dia';
      case 'group': return `Departamento: ${activeFilter.group}`;
      case 'category': return `${activeFilter.group} > ${activeFilter.category}`;
      default: return '';
    }
  };

  return (
    <div className="animate-in fade-in pb-10">
      
      {/* HEADER DA PÁGINA (Limpo e Focado) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
             <ShoppingBag size={28} className="text-pink-600" /> Shopping
          </h1>
          <p className="text-slate-500 mt-1 max-w-xl text-sm font-medium">
             Os melhores produtos e descontos do comércio de Ouro Branco.
          </p>
        </div>
        
        <div className="relative w-full md:w-96 shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar produto, marca ou loja..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-slate-800 outline-none bg-slate-50 border border-slate-200 focus:border-pink-300 focus:bg-white focus:ring-1 focus:ring-pink-100 transition-all shadow-inner font-medium"
          />
        </div>
      </div>

      {/* NOVO MENU DE NAVEGAÇÃO SECUNDÁRIA (Estilo Mercado Livre) */}
      <div className="bg-slate-100 rounded-full shadow-inner border border-slate-200 p-1 mb-6 max-w-4xl mx-auto flex items-center justify-center gap-1">
        
        {/* TODAS AS OFERTAS */}
        <button 
          onClick={() => { setActiveFilter({ type: 'all', group: null, category: null }); setSearchTerm(''); }}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-sm font-bold transition-colors ${
            activeFilter.type === 'all' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag size={18} /> Todas as Ofertas
        </button>

        <span className="text-slate-200">|</span>

        {/* OFERTAS DO DIA */}
        <button 
          onClick={() => { setActiveFilter({ type: 'daily', group: null, category: null }); setSearchTerm(''); }}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-sm font-bold transition-colors ${
            activeFilter.type === 'daily' 
              ? 'bg-yellow-400 text-slate-900 shadow-sm' 
              : 'text-slate-600 hover:text-yellow-600'
          }`}
        >
          <Zap size={18} /> Ofertas do Dia
        </button>

        <span className="text-slate-200">|</span>

        {/* BOTÃO DO MENU FLUTUANTE (CATEGORIAS) */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button 
            onMouseEnter={() => setIsMenuOpen(true)}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-sm font-bold transition-colors group ${
              (activeFilter.type === 'group' || activeFilter.type === 'category') || isMenuOpen
                ? 'bg-white text-pink-600 shadow-sm' 
                : 'text-slate-600 hover:text-pink-600'
            }`}
          >
            <Grid size={18} /> Categorias <ChevronDown size={16} className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* O MEGA MENU FLUTUANTE */}
          {isMenuOpen && (
            <div 
              onMouseLeave={() => setIsMenuOpen(false)}
              className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[80vw] max-w-6xl bg-white rounded-2xl shadow-xl border border-slate-100 p-8 z-50 animate-in slide-in-from-top-2"
            >
              <div className="flex items-center justify-between mb-6 pb-5 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <List size={16} className="text-pink-500" /> Explore as Categorias
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">{menuStructure.length} departamentos</p>
              </div>

              {menuStructure.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar pr-4">
                  {menuStructure.map(({ group, categories }) => (
                    <div key={group}>
                      {/* GRUPO (Negrito, serve de filtro de grupo) */}
                      <button 
                        onClick={() => { setActiveFilter({ type: 'group', group: group, category: null }); setIsMenuOpen(false); setSearchTerm(''); }}
                        className="font-bold text-slate-800 hover:text-pink-600 transition text-left mb-2.5 block text-sm"
                      >
                        {group}
                      </button>
                      
                      {/* CATEGORIAS (Subgrupos) */}
                      <div className="space-y-2">
                        {categories.map(category => (
                          <button
                            key={category}
                            onClick={() => { setActiveFilter({ type: 'category', group: group, category: category }); setIsMenuOpen(false); setSearchTerm(''); }}
                            className="block text-slate-600 hover:text-pink-600 text-left text-xs font-medium w-full transition"
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-sm">Nenhuma categoria cadastrada.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* BREADCRUMB / FEEDBACK DO FILTRO */}
      <div className="flex items-center gap-3 mb-6 px-1 text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">
        <Filter size={16} className="text-slate-400" /> 
        <span>{getFilterText()}</span>
        <span className="ml-auto text-xs bg-slate-100 text-slate-500 font-bold px-3 py-1.5 rounded-full border border-slate-200">
           {filteredOffers.length} produtos encontrados
        </span>
      </div>

      {/* GRID DE PRODUTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredOffers.length > 0 ? filteredOffers.map(offer => {
          const hasDiscount = offer.originalPrice && Number(offer.originalPrice) > Number(offer.price);
          const discountPercent = hasDiscount ? Math.round(((offer.originalPrice - offer.price) / offer.originalPrice) * 100) : 0;

          return (
            <div key={offer.id} onClick={() => onOfferClick(offer)} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer hover:border-pink-300 hover:shadow-md transition-all group flex flex-col">
              
              {/* IMAGEM DO PRODUTO */}
              <div className="w-full h-48 bg-white relative p-4 flex items-center justify-center border-b border-slate-50">
                <img src={offer.image || offer.photos?.[0]} alt={offer.title} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                
                {hasDiscount && (
                  <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[11px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Percent size={12} /> -{discountPercent}%
                  </span>
                )}
              </div>

              {/* INFORMAÇÕES DO PRODUTO */}
              <div className="p-4 flex flex-col flex-1">
                <div className="mb-auto">
                  <div className="flex items-center flex-wrap gap-1.5 mb-2">
                    {(offer.group || offer.grupo) && <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{offer.group || offer.grupo}</span>}
                    {(offer.group || offer.grupo) && (offer.category || offer.categoria) && <span className="text-slate-300 text-[9px]">•</span>}
                    {(offer.category || offer.categoria) && <span className="text-[9px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-100">{offer.category || offer.categoria}</span>}
                  </div>
                  <h3 className="font-bold text-slate-800 text-xs leading-snug line-clamp-2 group-hover:text-pink-600 transition-colors mb-2">
                    {offer.title}
                  </h3>
                </div>

                {/* PREÇOS */}
                <div className="mt-3 pt-3 border-t border-slate-50 flex items-end justify-between">
                  <div>
                    {hasDiscount ? (
                      <div className="flex flex-col">
                        <span className="text-[11px] text-slate-400 line-through font-medium">
                          {Number(offer.originalPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        <span className="text-lg font-black text-emerald-600 leading-none mt-0.5">
                          {Number(offer.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-black text-slate-800 block leading-tight">
                        {offer.price ? Number(offer.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Consulte'}
                      </span>
                    )}
                  </div>
                  <button className="bg-slate-900 text-white text-[9px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver Mais
                  </button>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500">
            <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">Nenhum produto encontrado</h3>
            <p className="text-sm">Tente limpar os filtros ou buscar por outro termo.</p>
          </div>
        )}
      </div>
    </div>
  );
}