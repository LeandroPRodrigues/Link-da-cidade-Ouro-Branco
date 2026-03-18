import React, { useState } from 'react';
import { ArrowLeft, Calendar, User, Tag, Heart, MessageCircle, Send } from 'lucide-react';
import { db } from '../utils/database';

export default function NewsDetailPage({ news, onBack, user }) {
  // Estados para gerir as interações em tempo real
  const [likes, setLikes] = useState(news?.likes || []);
  const [comments, setComments] = useState(news?.comments || []);
  const [commentText, setCommentText] = useState('');

  if (!news) return null;

  const isLiked = user && likes.includes(user.id);

  // Função para dar Like
  const handleLike = async () => {
    if (!user) { alert("Faça login para curtir!"); return; }
    const newLikes = isLiked ? likes.filter(id => id !== user.id) : [...likes, user.id];
    setLikes(newLikes);
    const colName = news._collection || 'news';
    await db.toggleLike(colName, news.id, user.id);
  };

  // Função para Comentar
  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) { alert("Faça login para comentar!"); return; }
    if (!commentText.trim()) return;
    
    const newComment = { 
      text: commentText, 
      userName: user.name, 
      userId: user.id, 
      date: new Date().toISOString() 
    };
    
    setComments([...comments, newComment]);
    setCommentText('');
    
    const colName = news._collection || 'news';
    await db.addComment(colName, news.id, newComment);
  };

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
                return <p key={index} className="whitespace-pre-wrap">{block.value}</p>;
              }
              if (block.type === 'subtitle') {
                return <h3 key={index} className="text-2xl font-bold text-slate-900 mt-8 mb-4">{block.value}</h3>;
              }
              if (block.type === 'image') {
                return (
                  <figure key={index} className="my-8 flex flex-col items-center">
                    <img src={block.value} alt={block.caption || "Ilustração da matéria"} className="w-full rounded-xl shadow-md" />
                    {/* AQUI ESTÁ A NOVA LEGENDA DA IMAGEM */}
                    {block.caption && (
                      <figcaption className="mt-3 text-sm text-slate-500 italic text-center border-b border-slate-100 pb-4 w-full">
                        {block.caption}
                      </figcaption>
                    )}
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

          {/* === SECÇÃO: CURTIDAS E COMENTÁRIOS === */}
          <div className="mt-12 pt-8 border-t border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6">O que você achou desta matéria?</h3>
            
            <div className="flex items-center gap-6 mb-8">
              <button 
                onClick={handleLike} 
                className={`flex items-center gap-2 text-lg font-bold transition ${isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}
              >
                <Heart size={24} className={`transition-transform active:scale-75 ${isLiked ? 'fill-red-500' : ''}`}/> 
                <span>{likes.length} Curtidas</span>
              </button>
              <div className="flex items-center gap-2 text-lg font-bold text-slate-500">
                <MessageCircle size={24} />
                <span>{comments.length} Comentários</span>
              </div>
            </div>

            {/* Lista de Comentários */}
            <div className="space-y-4 mb-8">
              {comments.map((c, idx) => (
                <div key={idx} className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                      {c.userName[0].toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block text-sm">{c.userName}</span>
                      <span className="text-xs text-slate-400">
                        {new Date(c.date).toLocaleDateString('pt-BR')} às {new Date(c.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{c.text}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-slate-400 italic text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Nenhum comentário ainda. Seja o primeiro a comentar!
                </p>
              )}
            </div>

            {/* Formulário de Comentário */}
            <form onSubmit={handleComment} className="flex gap-4 items-start bg-white border border-slate-200 p-2 pl-4 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
              <textarea 
                value={commentText} 
                onChange={e => setCommentText(e.target.value)} 
                placeholder={user ? "Escreva sua opinião..." : "Faça login para deixar um comentário..."}
                disabled={!user}
                className="flex-1 bg-transparent py-3 text-sm outline-none resize-none min-h-[50px] custom-scrollbar"
                rows="2"
              />
              <button 
                disabled={!commentText.trim() || !user} 
                className="mt-1 bg-indigo-600 disabled:bg-slate-200 disabled:text-slate-400 text-white p-3 rounded-xl hover:bg-indigo-700 transition"
              >
                <Send size={18}/>
              </button>
            </form>
          </div>
          {/* =========================================== */}

        </div>
      </div>
    </div>
  );
}