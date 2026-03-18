import React, { useState, useMemo } from 'react';
import { ShoppingBag, Search, Percent, ChevronRight, Filter } from 'lucide-react';

export default function OffersPage({ offersData, onOfferClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('Todos');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // 1. Extrai Grupos Dinamicamente (Lê o que está salvo no seu banco de dados)
  const groups = useMemo(() => {
    const rawGroups = (offersData || []).map(o => o.group || o.grupo).filter(Boolean);
    if (rawGroups.length === 0) return ['Todos'];
    return ['Todos', ...new Set(rawGroups)].sort();
  }, [offersData]);

  // 2. Extrai Subgrupos (Categorias) baseadas no Grupo Selecionado
  const categories = useMemo(() => {
    let filtered = offersData || [];
    if (selectedGroup !== 'Todos') {
      filtered = filtered.filter(o => (o.group || o.grupo) === selectedGroup);
    }
    const rawCategories = filtered.map(o => o.category || o.categoria).filter(Boolean);
    if (rawCategories.length === 0) return ['Todas'];
    return ['Todas', ...new Set(rawCategories)].sort();
  }, [offersData, selectedGroup]);

  // 3. Aplica os Filtros
  const filteredOffers = useMemo(() => {
    return (offersData || []).filter(offer => {
      const matchSearch = offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          offer.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const offerGroup = offer.group || offer.grupo;
      const offerCategory = offer.category || offer.categoria;

      // Se o usuário selecionou um grupo específico, e o item não tem grupo, ele não aparece
      const matchGroup = selectedGroup === 'Todos' || offerGroup === selectedGroup;
      const matchCategory = selectedCategory === 'Todas' || offerCategory === selectedCategory;

      return matchSearch && matchGroup && matchCategory;
    });
  }, [offersData, searchTerm, selectedGroup, selectedCategory]);

  const handleGroupChange = (group) => {
    setSelectedGroup(group);
    setSelectedCategory('Todas'); // Reseta o subgrupo ao trocar de grupo
  };

  return (
    <div className="animate-in fade-in pb-10">
      
      {/* HEADER DA PÁGINA */}
      <div className="bg-pink-600 rounded-2xl p-6 md:p-10 text-white mb-6 shadow-sm">
        <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
          <ShoppingBag size={32} /> Shopping e Ofertas
        </h1>
        <p className="text-pink-100 mb-8 max-w-xl text-sm md:text-base">
          Encontre os melhores produtos, descontos e ofertas exclusivas do comércio de Ouro Branco.
        </p>
        
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Buscar por produto, marca ou loja..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-pink-300 shadow-sm font-medium"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* BARRA LATERAL DE FILTROS */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sticky top-40">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
              <h2 className="font-black text-slate-800 flex items-center gap-2">
                <Filter size={18} className="text-pink-500" /> Categorias
              </h2>
              <button 
                onClick={() => { setSelectedGroup('Todos'); setSelectedCategory('Todas'); setSearchTerm(''); }}
                className="text-[10px] font-bold text-slate-400 hover:text-pink-600 uppercase tracking-wider"
              >
                Limpar
              </button>
            </div>

            {/* LISTAGEM DE GRUPOS PRINCIPAIS */}
            {groups.length > 1 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Departamentos</h3>
                <div className="flex flex-col gap-1">
                  {groups.map(group => (
                    <button
                      key={group}
                      onClick={() => handleGroupChange(group)}
                      className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedGroup === group 
                          ? 'bg-pink-50 text-pink-700 font-bold' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* LISTAGEM DE SUB-GRUPOS (CATEGORIAS) */}
            {categories.length > 1 && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  {selectedGroup === 'Todos' ? 'Todas as Categorias' : `Filtros em ${selectedGroup}`}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors ${
                        selectedCategory === category 
                          ? 'bg-slate-800 text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* LISTAGEM DE PRODUTOS (VITRINE) */}
        <main className="flex-1 min-w-0">
          
          {/* BREADCRUMB (Caminho) */}
          <div className="flex items-center gap-2 mb-4 px-1 text-sm font-medium text-slate-500">
            <span className={selectedGroup === 'Todos' ? 'text-slate-800 font-bold' : ''}>{selectedGroup}</span>
            {selectedGroup !== 'Todos' && (
              <>
                <ChevronRight size={14} className="text-slate-300" />
                <span className={selectedCategory === 'Todas' ? 'text-slate-800 font-bold' : ''}>{selectedCategory}</span>
              </>
            )}
            <span className="ml-auto text-xs bg-pink-50 text-pink-600 font-bold px-3 py-1 rounded-full border border-pink-100">
              {filteredOffers.length} produtos
            </span>
          </div>

          {/* GRID DE PRODUTOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
                      <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-pink-600 transition-colors mb-2">
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
                            <span className="text-xl font-black text-emerald-600 leading-none mt-0.5">
                              {Number(offer.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xl font-black text-slate-800 block">
                            {offer.price ? Number(offer.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Consulte'}
                          </span>
                        )}
                      </div>
                      <button className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver Oferta
                      </button>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500">
                <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-700 mb-1">Nenhum produto encontrado</h3>
                <p className="text-sm">Tente remover os filtros ou buscar por outro termo.</p>
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}