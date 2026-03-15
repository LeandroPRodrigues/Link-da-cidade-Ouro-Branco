import React, { useState, useEffect } from 'react';
import { 
  MapPin, Calendar, Heart, MessageCircle, Share2, 
  MoreHorizontal, Home, Briefcase, Car, Store, 
  Send, ExternalLink, ShoppingBag, ChevronLeft, ChevronRight
} from 'lucide-react';
import { db } from '../utils/database';

// --- COMPONENTE CARROSSEL DE ANÚNCIOS ---
const AdsCarousel = ({ ads }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const safeAds = ads || [];

  useEffect(() => {
    if (safeAds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeAds.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [safeAds.length]);

  if (safeAds.length === 0) return null;

  return (
    <div className="w-full overflow-hidden rounded-2xl shadow-sm mb-6 relative group bg-slate-100">
      <div 
        className="flex transition-transform duration-700 ease-in-out h-32 md:h-48" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {safeAds.map((ad, idx) => (
          <div 
            key={ad.id || idx} 
            className="w-full h-full shrink-0 relative cursor-pointer" 
            onClick={() => {
              if (ad.link) window.open(ad.link, '_blank');
            }}
          >
            <img src={ad.image} alt={ad.title || "Publicidade"} className="w-full h-full object-cover" />
            <span className="absolute bottom-2 right-2 bg-black/40 text-white text-[9px] px-2 py-1 rounded backdrop-blur uppercase tracking-wider font-bold z-10">
              Patrocinado
            </span>
          </div>
        ))}
      </div>
      {safeAds.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
          {safeAds.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50 w-1.5'}`} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE MINI CARROSSEL DE OFERTAS ---
const MiniOffersCarousel = ({ offers, navigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const safeOffers = (offers || []).filter(o => o.status !== 'inactive').slice(0, 5);

  useEffect(() => {
    if (safeOffers.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeOffers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [safeOffers.length]);

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % safeOffers.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + safeOffers.length) % safeOffers.length);
  };

  if (safeOffers.length === 0) return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 text-center">
      <h3 className="font-bold text-slate-700 mb-2 text-sm uppercase tracking-wide flex items-center justify-center gap-2">
        <ShoppingBag size={16} className="text-pink-500"/> Ofertas do Dia
      </h3>
      <p className="text-xs text-slate-400">Nenhuma oferta no momento.</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide flex items-center gap-2">
          <ShoppingBag size={16} className="text-pink-500"/> Ofertas do Dia
        </h3>
        <button onClick={() => navigate('offers')} className="text-[10px] font-bold text-indigo-600 hover:underline">Ver todas</button>
      </div>
      
      <div className="relative w-full h-56 rounded-xl overflow-hidden group">
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {safeOffers.map((offer, idx) => {
            const hasDiscount = offer.originalPrice && Number(offer.originalPrice) > Number(offer.price);
            
            return (
              <div 
                key={offer.id || idx} 
                className="w-full h-full shrink-0 relative cursor-pointer bg-white" 
                onClick={() => navigate('offers')}
              >
                <img src={offer.image || offer.photos?.[0]} alt={offer.title} className="w-full h-full object-contain p-2 pb-16" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>
                
                {hasDiscount && (
                  <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-sm z-10">
                    -{Math.round(((offer.originalPrice - offer.price) / offer.originalPrice) * 100)}%
                  </span>
                )}

                <div className="absolute bottom-4 left-3 right-3 z-10">
                  <p className="text-white font-bold text-sm leading-tight line-clamp-2 mb-1">{offer.title}</p>
                  <div className="flex flex-col">
                    {hasDiscount && (
                      <span className="text-[10px] text-slate-300 line-through leading-none mb-0.5">
                        {Number(offer.originalPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    )}
                    {offer.price && (
                      <span className="text-emerald-400 font-black text-lg leading-none">
                        {Number(offer.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {safeOffers.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-black/40 hover:bg-black/70 backdrop-blur text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-20"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-black/40 hover:bg-black/70 backdrop-blur text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-20"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {safeOffers.length > 1 && (
          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1.5 z-20">
            {safeOffers.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50 w-1.5'}`} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- COMPONENTE INDIVIDUAL DO DESTAQUE ---
const HeroItem = ({ item, user, onNewsClick, isMain }) => {
  const [likes, setLikes] = useState(item.likes || []);
  const [comments] = useState(item.comments || []);

  const isLiked = user && likes.includes(user.id);

  const handleLike = async (e) => {
    e.stopPropagation(); 
    if (!user) { alert("Faça login para curtir!"); return; }
    const newLikes = isLiked ? likes.filter(id => id !== user.id) : [...likes, user.id];
    setLikes(newLikes);
    const colName = item._collection || 'news';
    await db.toggleLike(colName, item.id, user.id);
  };

  return (
    <div 
      className={`relative rounded-2xl overflow-hidden cursor-pointer group shadow-sm bg-slate-900 ${isMain ? 'md:col-span-2 h-64 md:h-[380px]' : 'h-48 md:h-[184px]'}`}
      onClick={() => onNewsClick(item)}
    >
      <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      
      <div className="absolute top-3 right-3 flex gap-2 z-20">
        <button onClick={handleLike} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur transition shadow-sm ${isLiked ? 'bg-red-500/90 text-white' : 'bg-black/40 text-white hover:bg-black/60'}`}>
          <Heart size={14} className={isLiked ? 'fill-white' : ''}/> {likes.length}
        </button>
        <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur bg-black/40 text-white hover:bg-black/60 transition shadow-sm">
          <MessageCircle size={14}/> {comments.length}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full z-10">
        <span className={`${isMain ? 'bg-red-600' : 'bg-indigo-600'} text-white text-[9px] md:text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block shadow-sm`}>
          {item.category}
        </span>
        <h2 className={`text-white font-bold leading-tight group-hover:underline decoration-2 underline-offset-4 line-clamp-3 ${isMain ? 'text-xl md:text-3xl' : 'text-sm md:text-base'}`}>
          {item.title}
        </h2>
      </div>
    </div>
  );
};

// --- COMPONENTE DE DESTAQUES ---
const HeroNewsGrid = ({ news, user, onNewsClick }) => {
  if (!news || news.length === 0) return null;
  const mainNews = news[0];
  const sideNews = news.slice(1, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 px-1 md:px-0">
      <HeroItem item={mainNews} user={user} onNewsClick={onNewsClick} isMain={true} />
      {sideNews.length > 0 && (
        <div className="flex flex-col gap-3">
          {sideNews.map((item, idx) => (
            <HeroItem key={item.id || idx} item={item} user={user} onNewsClick={onNewsClick} isMain={false} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE DE ATALHO RÁPIDO ---
const QuickAccessItem = ({ label, icon: Icon, color, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 min-w-[65px] md:min-w-[80px] shrink-0 group transition-transform active:scale-95">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-all ${color}`}>
      <Icon size={24} />
    </div>
    <span className="text-[10px] md:text-xs font-semibold text-slate-600 group-hover:text-indigo-600">{label}</span>
  </button>
);

// --- COMPONENTE DE CARTÃO DE EVENTO ---
const EventCard = ({ event }) => (
  <div className="shrink-0 w-72 snap-start bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group cursor-pointer hover:shadow-md transition-all relative">
    <div className="relative h-40 overflow-hidden">
      <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-lg px-2 py-1 text-center shadow-sm z-10">
        <span className="block text-[10px] font-bold uppercase text-red-500">{new Date(event.date + 'T00:00:00').toLocaleString('pt-BR', { month: 'short' }).replace('.','')}</span>
        <span className="block text-xl font-black leading-none text-slate-900">{new Date(event.date + 'T00:00:00').getDate()}</span>
      </div>
    </div>
    <div className="p-3">
      <h3 className="font-bold text-slate-800 text-base truncate mb-1">{event.title}</h3>
      <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
        <MapPin size={12} className="text-indigo-500"/>
        <span className="truncate">{event.location}</span>
      </div>
      {event.link && (
        <a href={event.link} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-100 transition" onClick={(e) => e.stopPropagation()}>
          <ExternalLink size={12}/> Ingressos / Mais Info
        </a>
      )}
    </div>
  </div>
);

// --- COMPONENTE DE CARTÃO DE FEED ---
const FeedCard = ({ item, user, onNewsClick }) => {
  const [likes, setLikes] = useState(item.likes || []);
  const [comments, setComments] = useState(item.comments || []);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const isLiked = user && likes.includes(user.id);

  const handleLike = async () => {
    if (!user) { alert("Faça login para curtir!"); return; }
    const newLikes = isLiked ? likes.filter(id => id !== user.id) : [...likes, user.id];
    setLikes(newLikes);
    const colName = item._collection || 'news';
    await db.toggleLike(colName, item.id, user.id);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) { alert("Faça login para comentar!"); return; }
    if (!commentText.trim()) return;
    const newComment = { text: commentText, userName: user.name, userId: user.id, date: new Date().toISOString() };
    setComments([...comments, newComment]);
    setCommentText('');
    const colName = item._collection || 'news';
    await db.addComment(colName, item.id, newComment);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
      <div className="p-4 flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-sm bg-gradient-to-br from-blue-500 to-cyan-500">NT</div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 leading-tight">{item.author || 'Redação Link da Cidade'}</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              {new Date(item.date).toLocaleDateString('pt-BR')} • <span className="font-semibold text-blue-600">{item.category}</span>
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:bg-slate-100 p-1 rounded-full"><MoreHorizontal size={20} /></button>
      </div>
      <div className="px-4 pb-3">
        <h2 onClick={() => onNewsClick(item)} className="text-lg font-bold text-slate-900 mb-2 cursor-pointer hover:text-indigo-600 leading-snug">{item.title}</h2>
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 cursor-pointer" onClick={() => onNewsClick(item)}>{item.summary}</p>
      </div>
      <div onClick={() => onNewsClick(item)} className="w-full h-64 sm:h-80 bg-slate-100 cursor-pointer relative group">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition duration-500 group-hover:opacity-95" />
      </div>
      <div className="px-4 py-3 border-t border-slate-50 flex items-center justify-between select-none">
        <div className="flex gap-4">
          <button onClick={handleLike} className={`flex items-center gap-1.5 text-sm font-medium transition group ${isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}>
            <Heart size={20} className={`transition-transform active:scale-75 ${isLiked ? 'fill-red-500' : ''}`}/> 
            <span>{likes.length}</span>
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 text-sm font-medium transition">
            <MessageCircle size={20} />
            <span>{comments.length}</span>
          </button>
        </div>
        <button className="text-slate-400 hover:text-indigo-600 transition"><Share2 size={20} /></button>
      </div>
      {showComments && (
        <div className="bg-slate-50 p-4 border-t border-slate-100 animate-in slide-in-from-top-2">
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
            {comments.map((c, idx) => (
              <div key={idx} className="text-xs bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                <span className="font-bold text-slate-800 block mb-0.5">{c.userName}</span>
                <span className="text-slate-600">{c.text}</span>
              </div>
            ))}
            {comments.length === 0 && <p className="text-xs text-slate-400 italic text-center">Nenhum comentário ainda.</p>}
          </div>
          <form onSubmit={handleComment} className="flex gap-2 items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">{user ? user.name[0] : '?'}</div>
            <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Escreva um comentário..." className="flex-1 input bg-white border-slate-200 py-2 text-xs rounded-full px-4 focus:ring-1 focus:ring-indigo-500 outline-none"/>
            <button disabled={!commentText.trim()} className="bg-indigo-600 disabled:bg-slate-300 text-white p-2 rounded-full hover:bg-indigo-700 transition"><Send size={14}/></button>
          </form>
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL HOMEPAGE ---
export default function HomePage({ navigate, newsData, onNewsClick, eventsData, offersData, user }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = [...eventsData]
    .filter(e => {
      const eventDate = new Date(e.date + 'T00:00:00');
      return eventDate >= today; 
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const feedItems = newsData || [];
  const topNews = feedItems.slice(0, 3);
  const regularNews = feedItems.slice(3);

  return (
    <div className="animate-in fade-in max-w-2xl mx-auto md:mx-0 w-full pb-10">
      
      {/* 1. ATALHOS RÁPIDOS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
        <div className="flex justify-between md:justify-around items-center px-1 overflow-x-auto scrollbar-hide gap-3 pb-2 md:pb-0">
          <QuickAccessItem label="Imóveis" icon={Home} color="bg-gradient-to-tr from-emerald-400 to-emerald-600" onClick={() => navigate('real_estate')}/>
          <QuickAccessItem label="Empregos" icon={Briefcase} color="bg-gradient-to-tr from-blue-400 to-blue-600" onClick={() => navigate('jobs')}/>
          <QuickAccessItem label="Veículos" icon={Car} color="bg-gradient-to-tr from-orange-400 to-orange-600" onClick={() => navigate('vehicles')}/>
          <QuickAccessItem label="Guia" icon={Store} color="bg-gradient-to-tr from-purple-400 to-purple-600" onClick={() => navigate('guide')}/>
          <QuickAccessItem label="Shopping" icon={ShoppingBag} color="bg-gradient-to-tr from-pink-400 to-pink-600" onClick={() => navigate('offers')}/>
        </div>
      </div>

      {/* 3. DESTAQUES */}
      {topNews.length > 0 && (
        <HeroNewsGrid news={topNews} user={user} onNewsClick={onNewsClick} />
      )}

      {/* 4. CARROSSEL DE EVENTOS */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide">
            <Calendar size={18} className="text-purple-600"/> Agenda Ouro Branco
          </h2>
          <button onClick={() => navigate('events')} className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition">Ver tudo</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x px-1 -mx-4 md:mx-0 px-4 md:px-0">
          {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
            <EventCard key={event.id} event={event} />
          )) : (
            <div className="w-full text-center py-10 bg-white rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">Nenhum evento futuro agendado.</div>
          )}
        </div>
      </div>

      {/* 5. BARRA "O QUE VOCÊ PROCURA" */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-8 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition transform hover:scale-[1.01]" onClick={() => navigate('guide')}>
        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">{user ? user.name[0] : 'VC'}</div>
        </div>
        <div className="flex-1 bg-slate-100 rounded-full px-5 py-3 text-slate-500 text-sm">O que você está procurando em Ouro Branco?</div>
      </div>

      {/* 6. FEED DE NOTÍCIAS */}
      <div className="space-y-6">
        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-4 px-1">Mais Notícias</h3>
        {regularNews.length > 0 ? regularNews.map((item) => (
          <FeedCard key={item.id} item={item} user={user} onNewsClick={onNewsClick}/>
        )) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200"><p className="text-slate-400">Nenhuma notícia adicional publicada.</p></div>
        )}
        <div className="text-center py-8 text-slate-400 text-xs uppercase tracking-widest font-semibold opacity-50">Fim do conteúdo</div>
      </div>

    </div>
  );
}

// Exportamos também o AdsCarousel para ser usado de forma global no App.jsx
export { MiniOffersCarousel, AdsCarousel };