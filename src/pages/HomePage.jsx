import React from 'react';
import { MapPin, Calendar, Home, Briefcase, Store, Car, Clock } from 'lucide-react';

// Importando componentes
import SectionHeader from '../components/SectionHeader';

// Constantes Locais
const APP_BRAND = "Link da Cidade"; 
const CITY_NAME = "Ouro Branco";
const CITY_UF = "MG";

export default function HomePage({ navigate, newsData, onNewsClick, eventsData }) {
  // Pegamos apenas os próximos 3 eventos para mostrar na Home
  // Ordena por data antes de pegar os próximos
  const upcomingEvents = [...eventsData]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
<div className="space-y-12 pb-12">
      
      {/* HERO SECTION (Ajustada para não cortar a imagem) */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-lg mx-4 mt-6 md:mx-0 group">
        <img 
          src="/vista-ouro-branco.jpg" 
          alt={`Vista de ${CITY_NAME}`} 
          className="w-full h-auto max-h-[600px] object-cover group-hover:scale-105 transition duration-700 block" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded uppercase">Portal Oficial</span>
            <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded uppercase backdrop-blur-sm flex items-center gap-1">
              <MapPin size={10}/> {CITY_NAME} - {CITY_UF}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{APP_BRAND} {CITY_NAME}</h1>
          <p className="text-slate-200 text-lg max-w-xl">O seu portal completo para notícias, imóveis, vagas e eventos na cidade.</p>
        </div>
      </div>

      {/* SEÇÃO DE NOTÍCIAS */}
      <div className="px-4 md:px-0">
        <SectionHeader title="Últimas Notícias" link={() => navigate('news')} />
        <div className="grid md:grid-cols-4 gap-6">
          {newsData.slice(0, 4).map((news, idx) => (
            <div 
              key={news.id} 
              onClick={() => onNewsClick(news)} 
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden border border-slate-100 ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
            >
              <div className={`relative ${idx === 0 ? 'h-64' : 'h-40'}`}>
                <img src={news.image} className="w-full h-full object-cover" alt={news.title} />
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
                  {news.category}
                </span>
              </div>
              <div className="p-4">
                <span className="text-slate-400 text-xs flex items-center gap-1 mb-2">
                  <Calendar size={12}/> {new Date(news.date).toLocaleDateString('pt-BR')}
                </span>
                <h3 className={`font-bold text-slate-800 hover:text-blue-600 leading-tight ${idx === 0 ? 'text-2xl' : 'text-md'}`}>
                  {news.title}
                </h3>
                {idx === 0 && news.summary && (
                  <p className="text-slate-500 text-sm mt-2 line-clamp-2">{news.summary}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEÇÃO DE ATALHOS (SERVIÇOS) */}
      <div className="px-4 md:px-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div onClick={() => navigate('real_estate')} className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 cursor-pointer hover:bg-emerald-100 transition flex flex-col items-center justify-center text-center gap-3 group">
            <Home size={28} className="text-emerald-600" />
            <span className="font-bold text-emerald-900">Imóveis</span>
          </div>
          <div onClick={() => navigate('jobs')} className="bg-blue-50 p-6 rounded-xl border border-blue-100 cursor-pointer hover:bg-blue-100 transition flex flex-col items-center justify-center text-center gap-3 group">
            <Briefcase size={28} className="text-blue-600" />
            <span className="font-bold text-blue-900">Empregos</span>
          </div>
          <div onClick={() => navigate('vehicles')} className="bg-orange-50 p-6 rounded-xl border border-orange-100 cursor-pointer hover:bg-orange-100 transition flex flex-col items-center justify-center text-center gap-3 group">
            <Car size={28} className="text-orange-600" />
            <span className="font-bold text-orange-900">Veículos</span>
          </div>
          <div onClick={() => navigate('guide')} className="bg-purple-50 p-6 rounded-xl border border-purple-100 cursor-pointer hover:bg-purple-100 transition flex flex-col items-center justify-center text-center gap-3 group">
            <Store size={28} className="text-purple-600" />
            <span className="font-bold text-purple-900">Comércio</span>
          </div>
        </div>
      </div>

      {/* SEÇÃO DE AGENDA E UTILIDADE PÚBLICA */}
      <div className="grid md:grid-cols-3 gap-8 px-4 md:px-0">
        <div className="md:col-span-2">
          <SectionHeader title="Agenda da Cidade" link={() => navigate('events')} />
          <div className="space-y-4">
            {upcomingEvents.length === 0 ? (
               <p className="text-slate-500 text-sm bg-slate-50 p-4 rounded-lg border border-dashed text-center">Nenhum evento próximo agendado.</p>
            ) : (
              upcomingEvents.map(evt => (
                <div key={evt.id} className="flex bg-white p-4 rounded-xl shadow-sm border border-slate-100 items-center hover:border-blue-200 transition cursor-pointer">
                  {/* Data Box */}
                  <div className="flex flex-col items-center justify-center bg-slate-100 text-slate-600 rounded-lg p-3 min-w-[70px]">
                    <span className="text-xl font-bold">{new Date(evt.date + 'T00:00:00').getDate()}</span>
                    <span className="text-xs font-bold uppercase">{new Date(evt.date + 'T00:00:00').toLocaleString('pt-BR', { month: 'short' }).replace('.','')}</span>
                  </div>
                  
                  {/* Info */}
                  <div className="ml-4 flex-1">
                    <h4 className="font-bold text-slate-800 line-clamp-1">{evt.title}</h4>
                    <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1"><MapPin size={12}/> {evt.location}</span>
                      <span className="flex items-center gap-1"><Clock size={12}/> {evt.time}</span>
                    </p>
                  </div>
                  
                  <button className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 whitespace-nowrap">
                    Detalhes
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-6">Utilidade Pública</h2>
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg mb-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="block text-indigo-100 text-sm">Agora em {CITY_NAME}</span>
                <span className="text-4xl font-bold">24°C</span>
              </div>
              <div className="bg-white/20 p-2 rounded-full">
                <span className="text-2xl">⛅</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2">
            <div className="flex justify-between text-sm py-2 border-b">
              <span className="text-slate-500">Farmácia</span>
              <span className="font-bold text-slate-800">Drogaria Central</span>
            </div>
            <div className="flex justify-between text-sm py-2">
              <span className="text-slate-500">Lixo</span>
              <span className="font-bold text-slate-800">Reciclável (Qua/Sáb)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}