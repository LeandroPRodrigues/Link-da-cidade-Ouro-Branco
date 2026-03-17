import React, { useMemo } from 'react';
import { Search, List, Store, Briefcase, Home, Car, Calendar, ShoppingBag } from 'lucide-react';

const normalizeText = (text) => text ? text.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

export default function SearchPage({ 
  query, newsData, guideData, jobsData, propertiesData, vehiclesData, eventsData, offersData, 
  onNewsClick, onGuideClick, onJobClick, onPropertyClick, onVehicleClick, onEventClick, onOfferClick 
}) {
  
  const results = useMemo(() => {
    if (!query) return { news: [], guide: [], jobs: [], properties: [], vehicles: [], events: [], offers: [], total: 0 };
    
    const q = normalizeText(query);
    const match = (text) => normalizeText(text).includes(q);
    
    const news = (newsData || []).filter(n => match(n.title) || match(n.summary) || match(n.category));
    const guide = (guideData || []).filter(g => match(g.name) || match(g.category) || match(g.description));
    const jobs = (jobsData || []).filter(j => match(j.title) || match(j.company) || match(j.category) || match(j.description));
    const properties = (propertiesData || []).filter(p => match(p.title) || match(p.description));
    const vehicles = (vehiclesData || []).filter(v => match(v.title) || match(v.description));
    const events = (eventsData || []).filter(e => match(e.title) || match(e.location) || match(e.description));
    const offers = (offersData || []).filter(o => match(o.title) || match(o.category));

    return {
      news, guide, jobs, properties, vehicles, events, offers,
      total: news.length + guide.length + jobs.length + properties.length + vehicles.length + events.length + offers.length
    };
  }, [query, newsData, guideData, jobsData, propertiesData, vehiclesData, eventsData, offersData]);

  if (!query) return (
    <div className="max-w-4xl mx-auto py-20 px-4 text-center animate-in fade-in">
      <Search size={64} className="mx-auto text-slate-200 mb-6"/>
      <h2 className="text-2xl font-black text-slate-800">O que você está procurando?</h2>
      <p className="text-slate-500 mt-2">Digite algo na barra de pesquisa acima para encontrar no portal.</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0 py-8 animate-in fade-in">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Resultados da Busca</h1>
        <p className="text-slate-500 font-medium mt-2">
          Encontramos <strong className="text-indigo-600">{results.total} resultados</strong> para "{query}"
        </p>
      </div>

      {results.total === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
           <Search size={48} className="mx-auto text-slate-300 mb-4"/>
           <h3 className="text-xl font-bold text-slate-700">Nenhum resultado encontrado</h3>
           <p className="text-slate-500 mt-2">Tente buscar por outras palavras-chave.</p>
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* NOTÍCIAS */}
          {results.news.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-lg font-black text-slate-800 uppercase tracking-wide mb-4 border-b border-slate-100 pb-2"><List className="text-indigo-500"/> Notícias ({results.news.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.news.map(item => (
                  <div key={item.id} onClick={() => onNewsClick(item)} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 cursor-pointer hover:border-indigo-300 transition-colors group">
                    {item.image && <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-lg shrink-0"/>}
                    <div>
                      <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 line-clamp-2">{item.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 uppercase font-semibold text-indigo-500">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* GUIA COMERCIAL */}
          {results.guide.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-lg font-black text-slate-800 uppercase tracking-wide mb-4 border-b border-slate-100 pb-2"><Store className="text-orange-500"/> Guia Comercial ({results.guide.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {results.guide.map(item => (
                  <div key={item.id} onClick={() => onGuideClick(item)} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center cursor-pointer hover:border-orange-300 transition-colors">
                    <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="w-16 h-16 object-cover rounded-full mb-3 border border-slate-100"/>
                    <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{item.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-1 rounded mt-2">{item.category}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* VAGAS DE EMPREGO */}
          {results.jobs.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-lg font-black text-slate-800 uppercase tracking-wide mb-4 border-b border-slate-100 pb-2"><Briefcase className="text-blue-500"/> Vagas ({results.jobs.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.jobs.map(item => (
                  <div key={item.id} onClick={() => onJobClick(item)} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-300 transition-colors">
                    <h3 className="font-bold text-slate-800">{item.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{item.company}</p>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded inline-block mt-2">{item.type}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* IMÓVEIS */}
          {results.properties.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-lg font-black text-slate-800 uppercase tracking-wide mb-4 border-b border-slate-100 pb-2"><Home className="text-emerald-500"/> Imóveis ({results.properties.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {results.properties.map(item => (
                  <div key={item.id} onClick={() => onPropertyClick(item)} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden cursor-pointer hover:border-emerald-300 transition-colors">
                    <img src={item.photos?.[0] || item.image} alt={item.title} className="w-full h-32 object-cover"/>
                    <div className="p-3">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">{item.type}</span>
                      <h3 className="font-bold text-slate-800 text-sm mt-1 truncate">{item.title}</h3>
                      <p className="font-black text-slate-900 mt-1">{Number(item.price).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* VEÍCULOS */}
          {results.vehicles.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-lg font-black text-slate-800 uppercase tracking-wide mb-4 border-b border-slate-100 pb-2"><Car className="text-red-500"/> Veículos ({results.vehicles.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {results.vehicles.map(item => (
                  <div key={item.id} onClick={() => onVehicleClick(item)} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden cursor-pointer hover:border-red-300 transition-colors">
                    <img src={item.photos?.[0] || item.image} alt={item.title} className="w-full h-32 object-cover"/>
                    <div className="p-3">
                      <h3 className="font-bold text-slate-800 text-sm truncate">{item.title}</h3>
                      <p className="font-black text-red-600 mt-1">{Number(item.price).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  );
}