import React, { useState } from 'react';
import { 
  MapPin, Calendar, Heart, MessageCircle, Share2, 
  MoreHorizontal, Home, Briefcase, Car, Store, 
  Send, ExternalLink
} from 'lucide-react';
import { db } from '../utils/database';

// Componente de Atalho Rápido
const QuickAccessItem = ({ label, icon: Icon, color, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 min-w-[80px] group transition-transform active:scale-95">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-all ${color}`}>
      <Icon size={24} />
    </div>
    <span className="text-xs font-semibold text-slate-600 group-hover:text-indigo-600">{label}</span>
  </button>
);

// Componente do Cartão de Evento (Carrossel Horizontal)
const EventCard = ({ event }) => (
  <div className="shrink-0 w-72 snap-start bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group cursor-pointer hover:shadow-md transition-all relative">
    {/* Imagem */}
    <div className="relative h-40 overflow-hidden">
      <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-lg px-2 py-1 text-center shadow-sm">
        <span className="block text-[10px] font-bold uppercase text-red-500">{new Date(event.date + 'T00:00:00').toLocaleString('pt-BR', { month: 'short' }).replace('.','')}</span>
        <span className="block text-xl font-black leading-none text-slate-900">{new Date(event.date + 'T00:00:00').getDate()}</span>
      </div>
    </div>
    
    {/* Dados */}
    <div className="p-3">
      <h3 className="font-bold text-slate-800 text-base truncate mb-1">{event.title}</h3>
      <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
        <MapPin size={12} className="text-indigo-500"/>
        <span className="truncate">{event.location}</span>
      </div>
      
      {/* Botão de Ação (Link) */}
      {event.link && (
        <a 
          href={event.link} 
          target="_blank" 
          rel="noreferrer" 
          className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-100 transition"
          onClick={(e) => e.stopPropagation()} // Para não abrir o modal se tiver
        >
          <ExternalLink size={12}/> Ingressos / Mais Info
        </a>
      )}
      
      {/* Descrição em Hover (Efeito Netflix) */}
      {event.description && (
        <div className="hidden group-hover:flex absolute inset-0 bg-white/95 p-4 flex-col animate-in fade-in">
          <p className="font-bold text-sm text-slate-800 mb-2 border-b pb-2">Sobre o evento</p>
          <p className="text-xs text-slate-600 leading-relaxed overflow-y-auto flex-1">{event.description}</p>
        </div>
      )}
    </div>
  </div>
);

// Componente de Cartão de Feed (Notícias)
const FeedCard = ({ item, user, onNewsClick }) => {
  const [likes, setLikes] = useState(item.likes || []);
  const [comments, setComments] = useState(item.comments || []);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const isLiked = user && likes.includes(user.id);

  const handleLike = async () => {
    if (!user) { alert("Faça login para curtir!"); return; }
    
    // Atualização Otimista (Muda na tela antes de ir pro servidor)
    const newLikes = isLiked ? likes.filter(id => id !== user.id) : [...likes, user.id];
    setLikes(newLikes);

    await db.toggleLike('news', item.id, user.id);
  };

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

    const newCommentsList = [...comments, newComment];
    setComments(newCommentsList);
    setCommentText('');
    
    await db.addComment('news', item.id, newComment);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
      {/* Header do Post */}
      <div className="p-4 flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-sm bg-gradient-to-br from-blue-500 to-cyan-500">
            NT
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 leading-tight">Redação Link da Cidade</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              {new Date(item.date).toLocaleDateString('pt-BR')} • <span className="font-semibold text-blue-600">{item.category}</span>
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:bg-slate-100 p-1 rounded-full"><MoreHorizontal size={20} /></button>
      </div>

      {/* Texto e Título */}
      <div className="px-4 pb-3">
        <h2 onClick={() => onNewsClick(item)} className="text-lg font-bold text-slate-900 mb-2 cursor-pointer hover:text-indigo-600 leading-snug">
          {item.title}
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 cursor-pointer" onClick={() => onNewsClick(item)}>
          {item.summary}
        </p>
      </div>

      {/* Imagem Grande */}
      <div onClick={() => onNewsClick(item)} className="w-full h-64 sm:h-80 bg-slate-100 cursor-pointer relative group">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition duration-500 group-hover:opacity-95" />
      </div>

      {/* Barra de Ações (Curtir/Comentar) */}
      <div className="px-4 py-3 border-t border-slate-50 flex items-center justify-between select-none">
        <div className="flex gap-4">
          <button 
            onClick={handleLike} 
            className={`flex items-center gap-1.5 text-sm font-medium transition group ${isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}
          >
            <Heart size={20} className={`transition-transform active:scale-75 ${isLiked ? 'fill-red-500' : ''}`}/> 
            <span>{likes.length}</span>
          </button>
          <button 
            onClick={() => setShowComments(!showComments)} 
            className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 text-sm font-medium transition"
          >
            <MessageCircle size={20} />
            <span>{comments.length}</span>
          </button>
        </div>
        <button className="text-slate-400 hover:text-indigo-600 transition">
          <Share2 size={20} />
        </button>
      </div>

      {/* Seção de Comentários */}
      {showComments && (
        <div className="bg-slate-50 p-4 border-t border-slate-100 animate-in slide-in-from-top-2">
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
            {comments.map((c, idx) => (
              <div key={idx} className="text-xs bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                <span className="font-bold text-slate-800 block mb-0.5">{c.userName}</span>
                <span className="text-slate-600">{c.text}</span>
              </div>
            ))}
            {comments.length === 0 && <p className="text-xs text-slate-400 italic text-center">Nenhum comentário ainda. Seja o primeiro!</p>}
          </div>
          
          <form onSubmit={handleComment} className="flex gap-2 items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
              {user ? user.name[0] : '?'}
            </div>
            <input 
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Escreva um comentário..." 
              className="flex-1 input bg-white border-slate-200 py-2 text-xs rounded-full px-4 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
            <button disabled={!commentText.trim()} className="bg-indigo-600 disabled:bg-slate-300 text-white p-2 rounded-full hover:bg-indigo-700 transition">
              <Send size={14}/>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default function HomePage({ navigate, newsData, onNewsClick, eventsData, user }) {
  
  // Ordena eventos por data (mais próximos primeiro)
  const upcomingEvents = [...eventsData].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Ordena feed de notícias (mais recentes primeiro)
  const feedItems = [...newsData].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="animate-in fade-in max-w-2xl mx-auto md:mx-0 w-full pb-10">
      
      {/* 1. ATALHOS RÁPIDOS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-8">
        <div className="flex justify-between items-center px-2">
          <QuickAccessItem label="Imóveis" icon={Home} color="bg-gradient-to-tr from-emerald-400 to-emerald-600" onClick={() => navigate('real_estate')}/>
          <QuickAccessItem label="Empregos" icon={Briefcase} color="bg-gradient-to-tr from-blue-400 to-blue-600" onClick={() => navigate('jobs')}/>
          <QuickAccessItem label="Veículos" icon={Car} color="bg-gradient-to-tr from-orange-400 to-orange-600" onClick={() => navigate('vehicles')}/>
          <QuickAccessItem label="Guia" icon={Store} color="bg-gradient-to-tr from-purple-400 to-purple-600" onClick={() => navigate('guide')}/>
        </div>
      </div>

      {/* 2. CARROSSEL DE EVENTOS (NOVA POSIÇÃO) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide">
            <Calendar size={18} className="text-purple-600"/> Agenda Ouro Branco
          </h2>
          <button onClick={() => navigate('events')} className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition">
            Ver calendário completo
          </button>
        </div>
        
        {/* Scroll Horizontal */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x px-1 -mx-4 md:mx-0 px-4 md:px-0">
          {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
            <EventCard key={event.id} event={event} />
          )) : (
            <div className="w-full text-center py-10 bg-white rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
              Nenhum evento próximo agendado.
            </div>
          )}
        </div>
      </div>

      {/* 3. BARRA DE BUSCA / "O QUE VOCÊ PROCURA" */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-8 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition transform hover:scale-[1.01]" onClick={() => navigate('guide')}>
        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
            {user ? user.name[0] : 'VC'}
          </div>
        </div>
        <div className="flex-1 bg-slate-100 rounded-full px-5 py-3 text-slate-500 text-sm">
          O que você está procurando em Ouro Branco?
        </div>
      </div>

      {/* 4. FEED DE NOTÍCIAS */}
      <div className="space-y-6">
        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-4 px-1">Últimas Atualizações</h3>
        
        {feedItems.length > 0 ? feedItems.map((item) => (
          <FeedCard 
            key={item.id} 
            item={item} 
            user={user} 
            onNewsClick={onNewsClick}
          />
        )) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400">Nenhuma notícia publicada ainda.</p>
          </div>
        )}

        <div className="text-center py-8 text-slate-400 text-xs uppercase tracking-widest font-semibold opacity-50">
          Fim do conteúdo
        </div>
      </div>

    </div>
  );
}