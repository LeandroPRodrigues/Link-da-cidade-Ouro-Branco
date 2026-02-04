import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { NEWS_CATEGORIES } from '../data/mockData';

const CITY_NAME = "Ouro Branco";

export default function NewsPage({ newsData, onNewsClick }) {
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [activeSubcategory, setActiveSubcategory] = useState('Todas');
  
  // Pegamos as chaves do objeto (Nomes dos Grupos Principais)
  const categories = ['Todas', ...Object.keys(NEWS_CATEGORIES)];
  
  // Se uma categoria estiver selecionada, pegamos os subgrupos dela
  const subcategories = activeCategory !== 'Todas' && NEWS_CATEGORIES[activeCategory] 
    ? ['Todas', ...NEWS_CATEGORIES[activeCategory]] 
    : [];

  // Filtragem Dupla
  const filteredNews = newsData.filter(n => {
    const matchCategory = activeCategory === 'Todas' ? true : n.category === activeCategory;
    const matchSubcategory = activeSubcategory === 'Todas' ? true : n.subcategory === activeSubcategory;
    return matchCategory && matchSubcategory;
  });

  return (
    <div className="px-4 md:px-0 pb-12">
      <div className="py-8 border-b mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Notícias</h2>
        <p className="text-slate-500 mt-2">Acompanhe tudo o que acontece em {CITY_NAME}</p>
      </div>

      {/* NÍVEL 1: Categorias Principais (Grupos) */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => { setActiveCategory(cat); setActiveSubcategory('Todas'); }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition ${
              activeCategory === cat 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* NÍVEL 2: Subcategorias (Só aparece se escolher um grupo) */}
      {activeCategory !== 'Todas' && (
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 animate-in slide-in-from-top-2">
          {subcategories.map(sub => (
            <button 
              key={sub} 
              onClick={() => setActiveSubcategory(sub)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                activeSubcategory === sub 
                  ? 'border-blue-600 text-blue-600 bg-blue-50' 
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Grid de Notícias */}
      <div className="grid md:grid-cols-3 gap-8">
        {filteredNews.map(news => (
          <div key={news.id} onClick={() => onNewsClick(news)} className="group cursor-pointer">
            <div className="h-56 overflow-hidden rounded-xl mb-4 relative">
              <img src={news.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={news.title} />
              <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
                <span className="bg-white/90 backdrop-blur text-blue-800 text-[10px] font-bold px-2 py-1 rounded uppercase shadow-sm">
                  {news.category}
                </span>
                {news.subcategory && (
                  <span className="bg-slate-900/80 backdrop-blur text-white text-[10px] font-medium px-2 py-1 rounded shadow-sm">
                    {news.subcategory}
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mb-2">
              <Calendar size={12}/> {new Date(news.date).toLocaleDateString('pt-BR')}
            </span>
            <h3 className="font-bold text-xl text-slate-800 group-hover:text-blue-600 transition leading-tight mb-2">
              {news.title}
            </h3>
            <p className="text-slate-500 text-sm line-clamp-3">
              {news.summary}
            </p>
          </div>
        ))}
        {filteredNews.length === 0 && (
          <div className="col-span-3 text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
            Nenhuma notícia encontrada nesta seção.
          </div>
        )}
      </div>
    </div>
  );
}