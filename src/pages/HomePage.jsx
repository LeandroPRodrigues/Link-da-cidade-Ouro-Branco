import React from 'react';
import { Briefcase, Store, ShoppingBag, TrendingUp, Home, Car } from 'lucide-react';
import { 
  AdsCarousel, MiniOffersCarousel, SidebarAd, MiniPropertiesCarousel, 
  HeroNewsGrid, QuickAccessItem, FeedCard 
} from '../components/HomeComponents';

// Exportando para não quebrar a importação no App.jsx
export { AdsCarousel, MiniOffersCarousel, SidebarAd, MiniPropertiesCarousel };

export default function HomePage({ navigate, newsData, onNewsClick, eventsData, jobsData, adsData, offersData, user, onJobClick, onCadastrarVagaClick }) {
  
  const feedItems = newsData || [];
  
  const featuredIds = new Set();
  if (feedItems.length > 0) {
    let m = feedItems.find(n => n.featuredPosition === 1);
    let s1 = feedItems.find(n => n.featuredPosition === 2);
    let s2 = feedItems.find(n => n.featuredPosition === 3);
    
    if (m) featuredIds.add(m.id);
    if (s1) featuredIds.add(s1.id);
    if (s2) featuredIds.add(s2.id);

    const rem = feedItems.filter(n => !featuredIds.has(n.id));
    if (!m && rem.length > 0) featuredIds.add(rem.shift().id);
    if (!s1 && rem.length > 0) featuredIds.add(rem.shift().id);
    if (!s2 && rem.length > 0) featuredIds.add(rem.shift().id);
  }

  const regularNews = feedItems.filter(n => !featuredIds.has(n.id)).slice(0, 3);

  const trendingNews = [...feedItems].map(news => {
    const views = news.views || 0;
    const likes = news.likes?.length || 0;
    const comments = news.comments?.length || 0;
    const score = views + (likes * 5) + (comments * 10);
    return { ...news, score };
  }).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.date) - new Date(a.date);
  }).slice(0, 5);

  const latestJobs = jobsData?.slice(0, 12) || [];
  const middleAd = adsData?.find(ad => ad.position === 'middle');

  return (
    <div className="animate-in fade-in w-full pb-10">
      
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

      {/* 2. DESTAQUES NOTÍCIAS */}
      <HeroNewsGrid news={feedItems} user={user} onNewsClick={onNewsClick} />

      {/* 3. RANKING EM ALTA */}
      {trendingNews.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-8">
          <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
            <h2 className="font-black text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
              <TrendingUp size={20} className="text-red-500"/> Notícias em Alta
            </h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mais Lidas</span>
          </div>
          
          <div className="flex flex-col gap-4">
            {trendingNews.map((news, index) => (
              <div key={news.id} onClick={() => onNewsClick(news)} className="flex items-center gap-5 cursor-pointer group">
                <span className="text-5xl font-black text-slate-100 group-hover:text-indigo-100 transition-colors w-10 text-center leading-none">{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1 block">{news.category}</span>
                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">{news.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. BARRA DE BUSCA RÁPIDA */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-8 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition transform hover:scale-[1.01]" onClick={() => navigate('guide')}>
        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">{user ? user.name[0] : 'VC'}</div>
        </div>
        <div className="flex-1 bg-slate-100 rounded-full px-5 py-3 text-slate-500 text-sm">O que você está procurando em Ouro Branco?</div>
      </div>

      {/* 5. FEED RESTANTE DAS NOTÍCIAS */}
      <div className="space-y-6 mb-8">
        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-4 px-1">Últimas Notícias</h3>
        {regularNews.length > 0 ? regularNews.map((item) => (
          <FeedCard key={item.id} item={item} user={user} onNewsClick={onNewsClick}/>
        )) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200"><p className="text-slate-400">Nenhuma notícia adicional publicada.</p></div>
        )}
        
        <div className="px-1">
           <button onClick={() => navigate('news')} className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-3.5 rounded-xl transition shadow-sm">
             Ver todas as Notícias
           </button>
        </div>
      </div>

      {/* 6. PUBLICIDADE FIXA DO MEIO DA PÁGINA */}
      <div className="mb-8 w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50 relative group">
        {middleAd ? (
          middleAd.link ? (
            <a href={middleAd.link} target="_blank" rel="noopener noreferrer" className="block w-full">
               <img src={middleAd.image} alt={middleAd.title || 'Publicidade'} className="w-full h-auto max-h-[350px] object-cover mx-auto" />
            </a>
          ) : (
            <div className="block w-full"><img src={middleAd.image} alt={middleAd.title || 'Publicidade'} className="w-full h-auto max-h-[350px] object-cover mx-auto" /></div>
          )
        ) : (
          <div className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl text-slate-400">
             <span className="font-bold uppercase tracking-widest text-sm">Banner Fixo (Meio da Página)</span>
             <span className="text-[10px]">Adicione no painel Adm para substituir</span>
          </div>
        )}
        {middleAd && <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider backdrop-blur-sm z-10 pointer-events-none">Publicidade</div>}
      </div>

      {/* 7. GRADE DE VAGAS DE EMPREGO */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide">
            <Briefcase size={18} className="text-blue-600"/> Vagas de Emprego
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 px-1">
          {latestJobs.length > 0 ? latestJobs.map(job => (
            <div key={job.id} onClick={() => onJobClick && onJobClick(job)} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <h4 className="font-bold text-slate-800 text-xs line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors mb-1">{job.title}</h4>
                <p className="text-[10px] text-slate-500 font-medium line-clamp-1">{job.company}</p>
              </div>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-50">
                <span className="text-[10px] text-slate-400 truncate max-w-[60%]">{job.location}</span>
                <span className="bg-blue-50 text-blue-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">{job.type}</span>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-6 bg-white rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
              Nenhuma vaga recente.
            </div>
          )}
        </div>
        
        <div className="flex gap-3 mt-4 px-1">
          <button onClick={onCadastrarVagaClick} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 rounded-xl transition shadow-sm">
            Cadastrar Vaga
          </button>
          <button onClick={() => navigate('jobs')} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold py-3 rounded-xl transition shadow-sm">
            Mais Vagas
          </button>
        </div>
      </div>

    </div>
  );
}