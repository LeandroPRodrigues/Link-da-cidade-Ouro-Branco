import React from 'react';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';

export default function NewsDetailPage({ news, onBack }) {
  if (!news) return null;

  return (
    <div className="bg-white min-h-screen pb-12 animate-in fade-in">
      {/* Imagem de Capa Gigante */}
      <div className="relative h-96 w-full">
        <img 
          src={news.image} 
          className="w-full h-full object-cover" 
          alt={news.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        
        <button 
          onClick={onBack} 
          className="absolute top-6 left-6 bg-white/20 hover:bg-white/40 backdrop-blur text-white p-2 rounded-full transition z-20"
        >
          <ArrowLeft size={24} />
        </button>
        
        {/* Informações na Capa (Título, Categoria e Subgrupo) */}
        <div className="absolute bottom-0 left-0 p-8 max-w-4xl z-10">
          <div className="flex flex-col items-start gap-2 mb-3">
             <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wide shadow-sm">
              {news.category}
            </span>
            {news.subcategory && (
              <span className="bg-white/20 backdrop-blur border border-white/30 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                {news.subcategory}
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {news.title}
          </h1>
          
          <div className="flex items-center gap-6 text-slate-300 text-sm font-medium">
            <span className="flex items-center gap-2">
              <Calendar size={16}/> {new Date(news.date).toLocaleDateString('pt-BR')}
            </span>
            <span className="flex items-center gap-2">
              <User size={16}/> {news.author}
            </span>
          </div>
        </div>
      </div>

      {/* Conteúdo da Notícia */}
      <div className="max-w-3xl mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-slate-100">
          {/* Resumo/Lead */}
          {news.summary && (
            <p className="text-xl text-slate-600 font-medium italic mb-8 border-l-4 border-blue-600 pl-4 leading-relaxed">
              {news.summary}
            </p>
          )}

          {/* Renderização dos Blocos de Conteúdo */}
          <div className="space-y-6 text-lg text-slate-800 leading-relaxed">
            {news.content && news.content.map((block, index) => {
              if (block.type === 'paragraph') {
                return <p key={index}>{block.value}</p>;
              }
              if (block.type === 'subtitle') {
                return <h3 key={index} className="text-2xl font-bold text-slate-900 mt-8 mb-4">{block.value}</h3>;
              }
              if (block.type === 'image') {
                return (
                  <figure key={index} className="my-8">
                    <img src={block.value} alt="Ilustração da matéria" className="w-full rounded-xl shadow-md" />
                  </figure>
                );
              }
              return null;
            })}
          </div>

          {/* Tags */}
          {news.tags && (
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-2">
              {news.tags.split(',').map(tag => (
                <span key={tag} className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                  <Tag size={12}/> {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}