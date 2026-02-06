import React, { useState } from 'react';
import { Search, Calendar, Filter, ChevronRight, Tag } from 'lucide-react';
import { NEWS_CATEGORIES } from '../data/mockData';

export default function NewsPage({ newsData, onNewsClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Lista de Categorias para o Filtro (Adiciona "Todas" no início)
  const categoriesList = ['Todas', ...Object.keys(NEWS_CATEGORIES)];

  const filteredNews = newsData.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-in fade-in pb-12">
      
      {/* CABEÇALHO FIXO / CONTROLES */}
      <div className="bg-white p-4 rounded-b-2xl md:rounded-2xl shadow-sm border border-slate-100 mb-6 sticky top-[70px] z-30">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Explorar Notícias</h2>
            <p className="text-xs text-slate-400">Fique por dentro do que acontece em Ouro Branco</p>
          </div>
          
          {/* Barra de Busca */}
          <div className="relative w-full md:w-80">
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar assunto..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-300 rounded-xl text-sm transition-all outline-none"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18}/>
          </div>
        </div>

        {/* Filtros Horizontais (Estilo Youtube/Instagram) */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {categoriesList.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all
                ${selectedCategory === cat 
                  ? 'bg-slate-900 text-white shadow-md transform scale-105' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-200 border border-slate-100'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GRID DE NOTÍCIAS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-0 md:px-0">
        {filteredNews.length > 0 ? filteredNews.map((news) => (
          <div 
            key={news.id} 
            onClick={() => onNewsClick(news)} 
            className="group bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
          >
            {/* Imagem com Overlay de Categoria */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={news.image} 
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110" 
                alt={news.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                {news.category}
              </span>
            </div>

            {/* Conteúdo */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-3 font-medium uppercase tracking-wide">
                <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(news.date).toLocaleDateString('pt-BR')}</span>
                <span>•</span>
                <span>{news.author || 'Redação'}</span>
              </div>

              <h3 className="font-bold text-slate-800 text-lg leading-tight mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {news.title}
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                {news.summary}
              </p>

              <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                <span className="text-xs font-bold text-indigo-600 group-hover:underline flex items-center gap-1">
                  Ler matéria completa <ChevronRight size={14}/>
                </span>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center text-slate-400">
            <Filter size={48} className="mx-auto mb-3 opacity-20"/>
            <p>Nenhuma notícia encontrada para este filtro.</p>
          </div>
        )}
      </div>
    </div>
  );
}