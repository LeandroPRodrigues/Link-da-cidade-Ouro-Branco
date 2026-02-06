import React from 'react';
import { 
  MapPin, Calendar, Clock, Heart, MessageCircle, Share2, 
  MoreHorizontal, ChevronRight, Home, Briefcase, Car, Store 
} from 'lucide-react';

// Componente de Atalho Rápido (Estilo Stories/Apps)
const QuickAccessItem = ({ label, icon: Icon, color, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-2 min-w-[80px] group transition-transform active:scale-95"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-all ${color}`}>
      <Icon size={24} />
    </div>
    <span className="text-xs font-semibold text-slate-600 group-hover:text-indigo-600">{label}</span>
  </button>
);

// Componente de Cartão de Feed (Base)
const FeedCard = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6 ${className}`}>
    {children}
  </div>
);

// Cabeçalho do Cartão (Avatar + Nome + Data)
const CardHeader = ({ category, date, title, isEvent }) => (
  <div className="p-4 flex justify-between items-start">
    <div className="flex gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-sm
        ${isEvent ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-blue-500 to-cyan-500'}`}
      >
        {isEvent ? 'EV' : 'NT'}
      </div>
      <div>
        <h3 className="font-bold text-sm text-slate-800 leading-tight">
          {isEvent ? 'Agenda Ouro Branco' : 'Redação Link da Cidade'}
        </h3>
        <p className="text-xs text-slate-400 flex items-center gap-1">
          {new Date(date).toLocaleDateString('pt-BR')} • 
          <span className={`font-semibold ${isEvent ? 'text-purple-600' : 'text-blue-600'}`}>
            {category || (isEvent ? 'Evento' : 'Notícia')}
          </span>
        </p>
      </div>
    </div>
    <button className="text-slate-400 hover:bg-slate-100 p-1 rounded-full">
      <MoreHorizontal size={20} />
    </button>
  </div>
);

// Rodapé de Ações (Curtir, Comentar)
const CardActions = () => (
  <div className="px-4 py-3 border-t border-slate-50 flex items-center justify-between">
    <div className="flex gap-4">
      <button className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 text-sm font-medium transition group">
        <Heart size={18} className="group-hover:fill-red-500 transition"/> 
        <span className="hidden sm:inline">Curtir</span>
      </button>
      <button className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 text-sm font-medium transition">
        <MessageCircle size={18} />
        <span className="hidden sm:inline">Comentar</span>
      </button>
    </div>
    <button className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 text-sm font-medium transition">
      <Share2 size={18} />
      <span>Compartilhar</span>
    </button>
  </div>
);

export default function HomePage({ navigate, newsData, onNewsClick, eventsData }) {
  
  // Mistura Notícias e Eventos e ordena por data (do mais recente para o antigo)
  // Criamos uma lista unificada para o Feed
  const feedItems = [
    ...newsData.map(n => ({ ...n, type: 'news' })),
    ...eventsData.map(e => ({ ...e, type: 'event' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="animate-in fade-in max-w-2xl mx-auto md:mx-0 w-full">
      
      {/* 1. SEÇÃO DE "STORIES" / ATALHOS RÁPIDOS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
        <div className="flex justify-between items-center px-2">
          <QuickAccessItem 
            label="Imóveis" 
            icon={Home} 
            color="bg-gradient-to-tr from-emerald-400 to-emerald-600" 
            onClick={() => navigate('real_estate')}
          />
          <QuickAccessItem 
            label="Empregos" 
            icon={Briefcase} 
            color="bg-gradient-to-tr from-blue-400 to-blue-600" 
            onClick={() => navigate('jobs')}
          />
          <QuickAccessItem 
            label="Veículos" 
            icon={Car} 
            color="bg-gradient-to-tr from-orange-400 to-orange-600" 
            onClick={() => navigate('vehicles')}
          />
          <QuickAccessItem 
            label="Guia" 
            icon={Store} 
            color="bg-gradient-to-tr from-purple-400 to-purple-600" 
            onClick={() => navigate('guide')}
          />
        </div>
      </div>

      {/* 2. BARRA DE "O QUE VOCÊ ESTÁ PENSANDO?" (Fake Input para Engajamento) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition" onClick={() => navigate('guide')}>
        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
            EU
          </div>
        </div>
        <div className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-slate-500 text-sm">
          O que você está procurando em Ouro Branco?
        </div>
      </div>

      {/* 3. FEED INFINITO */}
      <div className="space-y-6">
        {feedItems.length > 0 ? feedItems.map((item) => {
          
          // --- CARD DE NOTÍCIA ---
          if (item.type === 'news') {
            return (
              <FeedCard key={`news-${item.id}`}>
                <CardHeader category={item.category} date={item.date} title={item.title} isEvent={false} />
                
                <div className="px-4 pb-2">
                  <h2 
                    onClick={() => onNewsClick(item)}
                    className="text-lg font-bold text-slate-900 mb-2 cursor-pointer hover:text-indigo-600 leading-snug"
                  >
                    {item.title}
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-3">
                    {item.summary}
                  </p>
                </div>

                {/* Imagem Grande (Estilo Facebook) */}
                <div 
                  onClick={() => onNewsClick(item)}
                  className="w-full h-64 sm:h-80 bg-slate-100 cursor-pointer relative group"
                >
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition duration-500 group-hover:opacity-95" />
                </div>

                <CardActions />
              </FeedCard>
            );
          }

          // --- CARD DE EVENTO ---
          if (item.type === 'event') {
            return (
              <FeedCard key={`event-${item.id}`}>
                <CardHeader category="Evento Oficial" date={item.date} title={item.title} isEvent={true} />
                
                <div className="relative">
                  {/* Imagem do Evento com Blur no fundo se for pequena, ou cover */}
                  <div className="w-full h-56 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                    <img src={item.image} className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm" alt=""/>
                    <img src={item.image} className="relative z-10 h-full object-contain shadow-xl" alt={item.title}/>
                  </div>
                  
                  {/* Badge de Data Flutuante */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-800 rounded-xl p-2 shadow-lg text-center min-w-[60px]">
                    <span className="block text-xs font-bold uppercase text-red-500">
                      {new Date(item.date + 'T00:00:00').toLocaleString('pt-BR', { month: 'short' })}
                    </span>
                    <span className="block text-2xl font-black leading-none">
                      {new Date(item.date + 'T00:00:00').getDate()}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h2 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h2>
                  
                  <div className="flex flex-col gap-2 mt-3 mb-4">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <Clock size={16} className="text-indigo-500"/>
                      <span>{item.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <MapPin size={16} className="text-indigo-500"/>
                      <span>{item.location}</span>
                    </div>
                  </div>

                  <button className="w-full py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg text-sm hover:bg-indigo-100 transition border border-indigo-100">
                    Ver detalhes do evento
                  </button>
                </div>

                <CardActions />
              </FeedCard>
            );
          }
          return null;
        }) : (
          // Estado Vazio (Skeleton ou Mensagem)
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400">Nenhuma publicação no feed ainda.</p>
          </div>
        )}

        {/* --- RODAPÉ DO FEED (FIM) --- */}
        <div className="text-center py-8 text-slate-400 text-sm">
          <p>Você chegou ao fim das atualizações.</p>
          <div className="w-2 h-2 bg-slate-300 rounded-full mx-auto mt-2"></div>
        </div>
      </div>

    </div>
  );
}