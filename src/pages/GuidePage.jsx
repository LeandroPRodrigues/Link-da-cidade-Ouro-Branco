import React, { useState } from 'react';
import { Search, MapPin, Phone, MessageCircle, ChevronRight, Store, ArrowLeft } from 'lucide-react';
import { GUIDE_CATEGORIES } from '../data/mockData';

export default function GuidePage({ guideData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Filtra os dados
  const filteredGuide = guideData.filter(item => {
    if (searchTerm) {
      return item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
             item.category.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (selectedCategory) {
      return item.category === selectedCategory;
    }
    return true;
  });

  // Função para limpar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
  };

  // Componente de Item da Lista (Estilo WebMotors / Telelista)
  const GuideListItem = ({ item }) => {
    const cleanPhone = item.phone.replace(/\D/g, '');
    const isMobile = cleanPhone.length >= 10 && cleanPhone.startsWith('319');

    return (
      <div className="py-6 border-b border-slate-200 first:pt-2 last:border-0 hover:bg-slate-50 transition -mx-4 px-4 md:mx-0 md:px-4 rounded-lg group">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          
          {/* Lado Esquerdo: Informações */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-blue-700 mb-1 group-hover:underline cursor-pointer">
              {item.name}
            </h3>
            <p className="text-sm text-slate-500 mb-2 font-medium">{item.description}</p>
            
            <div className="flex items-start gap-1.5 text-slate-500 text-sm">
              <MapPin size={16} className="shrink-0 mt-0.5 text-slate-400"/>
              <span>{item.address}</span>
            </div>
          </div>

          {/* Lado Direito: Contato (Botões Verdes) */}
          <div className="shrink-0 flex flex-col items-start md:items-end gap-2 min-w-[140px]">
            {isMobile ? (
              <a 
                href={`https://wa.me/55${cleanPhone}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-green-600 font-bold hover:text-green-700 hover:underline transition bg-green-50 px-3 py-1.5 rounded-lg w-full md:w-auto justify-center md:justify-end"
              >
                <MessageCircle size={18}/>
                WhatsApp
              </a>
            ) : (
              <a 
                href={`tel:${cleanPhone}`} 
                className="flex items-center gap-2 text-green-600 font-bold hover:text-green-700 hover:underline transition bg-green-50 px-3 py-1.5 rounded-lg w-full md:w-auto justify-center md:justify-end"
              >
                <Phone size={18}/>
                Ligar agora
              </a>
            )}
            
            <span className="text-xs text-slate-400 hidden md:block">
              {isMobile ? '(Celular/Zap)' : '(Telefone Fixo)'}
            </span>
            <span className="text-xs font-medium text-slate-600 md:text-right w-full block select-all">
              {item.phone}
            </span>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="px-4 md:px-0 pb-12 animate-in fade-in min-h-screen bg-white">
      
      {/* HEADER DE BUSCA */}
      <div className="bg-slate-50 border-b pt-8 pb-8 px-4 -mx-4 md:mx-0 md:rounded-t-2xl mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Guia Comercial</h2>
        <p className="text-slate-500 mb-6">Encontre empresas, serviços e telefones úteis em Ouro Branco.</p>
        
        <div className="relative max-w-3xl">
          <input 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="O que você está procurando? (Ex: Pizzaria, Mecânico, Farmácia...)" 
            className="w-full p-4 pl-12 rounded-xl border border-slate-300 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition text-lg"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24}/>
        </div>
      </div>

      {/* Título da Seção Atual + Botão Voltar */}
      {(selectedCategory || searchTerm) && (
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button onClick={clearFilters} className="flex items-center gap-1 text-blue-600 hover:underline font-bold">
            <ArrowLeft size={16}/> Voltar para Categorias
          </button>
          <ChevronRight size={16} className="text-slate-300"/>
          <span className="font-bold text-slate-800 text-lg">
            {searchTerm ? `Resultados para "${searchTerm}"` : selectedCategory}
          </span>
          <span className="ml-auto text-slate-400 bg-slate-100 px-2 py-1 rounded-full text-xs">
            {filteredGuide.length} resultados
          </span>
        </div>
      )}

      {/* --- MODO 1: LISTA DE CATEGORIAS (Grid Inicial) --- */}
      {!selectedCategory && !searchTerm && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-2">
            <Store size={20} className="text-blue-600"/> Categorias
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
            {GUIDE_CATEGORIES.sort().map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="group flex items-center justify-between text-left py-3 px-3 rounded-lg hover:bg-blue-50 transition border border-transparent hover:border-blue-100"
              >
                <span className="text-slate-600 font-medium group-hover:text-blue-700 transition">
                  {cat}
                </span>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition"/>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- MODO 2: LISTA DE RESULTADOS (Estilo Diretório) --- */}
      {(selectedCategory || searchTerm) && (
        <div className="animate-in fade-in">
          {filteredGuide.length > 0 ? (
            <div className="bg-white rounded-xl">
              {filteredGuide.sort((a, b) => a.name.localeCompare(b.name)).map(item => (
                <GuideListItem key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <Store size={48} className="mx-auto text-slate-300 mb-4"/>
              <p className="text-slate-500 text-lg font-medium">Nenhum local encontrado.</p>
              <button onClick={clearFilters} className="text-blue-600 font-bold mt-2 hover:underline">
                Voltar e ver todas as categorias
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}