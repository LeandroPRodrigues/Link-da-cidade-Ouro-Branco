import React, { useState } from 'react';
import { Tag, Search, PlusCircle, MessageCircle, Clock, User } from 'lucide-react';

export default function ClassifiedsPage({ classifiedsData, onAddClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const categories = ['Todas', 'Eletrônicos & Celulares', 'Móveis & Decoração', 'Eletrodomésticos', 'Moda & Vestuário', 'Serviços Gerais', 'Ferramentas & Construção', 'Artigos Infantis', 'Outros'];

  // Filtra os itens ativos e que correspondem à busca e categoria
  const filteredItems = classifiedsData?.filter(item => {
    const matchSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
    return matchSearch && matchCategory;
  }) || [];

  return (
    <div className="animate-in fade-in pb-10">
      
      {/* HEADER DA PÁGINA (Estilo Comunidade) */}
      <div className="bg-indigo-600 rounded-2xl p-6 md:p-10 text-white mb-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
              <Tag size={32} /> Classificados da Comunidade
            </h1>
            <p className="text-indigo-100 max-w-xl text-sm md:text-base font-medium">
              Compre, venda e anuncie os seus serviços para toda a cidade de Ouro Branco. Um espaço livre, direto e seguro.
            </p>
          </div>
          <button onClick={onAddClick} className="bg-white text-indigo-600 px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition shadow-sm shrink-0">
            <PlusCircle size={20} /> Criar Anúncio Grátis
          </button>
        </div>
        
        {/* BARRA DE BUSCA */}
        <div className="relative mt-8 max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="O que você está procurando hoje?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm font-medium"
          />
        </div>
      </div>

      {/* FILTRO DE CATEGORIAS */}
      <div className="flex overflow-x-auto gap-2 pb-4 mb-6 scrollbar-hide">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              selectedCategory === cat 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID DE ANÚNCIOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredItems.length > 0 ? filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col group hover:border-indigo-300 transition-colors">
            
            {/* IMAGEM DO ANÚNCIO */}
            <div className="w-full h-48 bg-slate-100 relative">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300"><Tag size={48}/></div>
              )}
              <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                {item.category}
              </span>
            </div>
            
            {/* DADOS DO ANÚNCIO */}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-slate-800 leading-snug line-clamp-2 mb-1">{item.title}</h3>
              <p className="text-xl font-black text-emerald-600 mb-3">
                {item.price > 0 ? Number(item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'A Combinar'}
              </p>
              
              <div className="mt-auto pt-3 border-t border-slate-100 space-y-3">
                <div className="flex flex-col gap-1.5 text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5"><User size={14} className="text-slate-400"/> {item.ownerName}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400"/> Publicado em: {new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
                
                {/* BOTÃO DE CONTATO (WHATSAPP) */}
                <a 
                  href={`https://wa.me/55${item.contact?.replace(/\D/g, '')}?text=Olá! Vi o seu anúncio "${item.title}" nos Classificados do Link da Cidade.`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <MessageCircle size={14}/> Falar com Anunciante
                </a>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500">
            <Tag size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">Nenhum anúncio encontrado</h3>
            <p className="text-sm">Seja o primeiro a anunciar nesta categoria!</p>
          </div>
        )}
      </div>

    </div>
  );
}