import React, { useState } from 'react';
import { Search, MapPin, Phone, MessageCircle, ChevronRight, Store, ArrowLeft, Grid } from 'lucide-react';
import { GUIDE_CATEGORIES } from '../data/mockData';

export default function GuidePage({ guideData, onLocalClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredGuide = guideData.filter(item => {
    if (searchTerm) {
      return item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
             item.category.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (selectedCategory) return item.category === selectedCategory;
    return true;
  });

  const clearFilters = () => { setSearchTerm(''); setSelectedCategory(null); };

  // Componente de Item da Lista (Estilo App)
  const GuideListItem = ({ item }) => {
    const cleanPhone = item.phone.replace(/\D/g, '');
    const isMobile = cleanPhone.length >= 10 && cleanPhone.startsWith('319');

    return (
      <div className="p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition group flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 cursor-pointer" onClick={() => onLocalClick(item)}>
          <h3 className="font-bold text-slate-800 text-base group-hover:text-indigo-600 transition mb-1">
            {item.name}
          </h3>
          <p className="text-xs text-slate-500 mb-1">{item.description}</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <MapPin size={12}/> {item.address}
          </div>
        </div>

        <div className="w-full sm:w-auto flex gap-2">
           {isMobile ? (
              <a href={`https://wa.me/55${cleanPhone}`} target="_blank" rel="noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 px-4 py-2 rounded-lg text-xs font-bold transition">
                <MessageCircle size={14}/> WhatsApp
              </a>
           ) : (
              <a href={`tel:${cleanPhone}`}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-lg text-xs font-bold transition">
                <Phone size={14}/> Ligar
              </a>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in pb-12">
      
      {/* HEADER BUSCA */}
      <div className="bg-white p-6 rounded-b-2xl md:rounded-2xl shadow-sm border border-slate-100 mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Store className="text-indigo-600" size={24}/> Guia Comercial
        </h2>
        <div className="relative">
          <input 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar empresa, serviço ou categoria..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-base transition-all outline-none"
          />
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20}/>
        </div>
      </div>

      {/* BREADCRUMB */}
      {(selectedCategory || searchTerm) && (
        <div className="flex items-center gap-2 mb-4 px-2">
          <button onClick={clearFilters} className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm">
            <ArrowLeft size={12}/> Categorias
          </button>
          <ChevronRight size={12} className="text-slate-300"/>
          <span className="text-sm font-bold text-slate-800">
            {searchTerm ? `Busca: "${searchTerm}"` : selectedCategory}
          </span>
        </div>
      )}

      {/* MODO CATEGORIAS (GRID DE ÍCONES) */}
      {!selectedCategory && !searchTerm && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Grid size={14}/> Navegar por Categorias
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {GUIDE_CATEGORIES.sort().map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:scale-105 transition duration-200 group h-24 text-center border border-transparent hover:border-indigo-100"
              >
                <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-700 leading-tight">
                  {cat}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MODO LISTA DE RESULTADOS */}
      {(selectedCategory || searchTerm) && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[300px]">
          {filteredGuide.length > 0 ? (
            <div>
               <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                 {filteredGuide.length} Resultados encontrados
               </div>
               {filteredGuide.sort((a, b) => a.name.localeCompare(b.name)).map(item => (
                 <GuideListItem key={item.id} item={item} />
               ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Store size={48} className="mb-2 opacity-20"/>
              <p>Nenhum local encontrado.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}