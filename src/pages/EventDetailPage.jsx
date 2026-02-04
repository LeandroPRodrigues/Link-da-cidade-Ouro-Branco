import React from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Ticket } from 'lucide-react';

export default function EventDetailPage({ event, onBack }) {
  if (!event) return null;

  return (
    <div className="animate-in fade-in pb-12">
      {/* Botão Voltar */}
      <div className="px-4 py-4 max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium">
          <ArrowLeft size={20}/> Voltar para agenda
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Imagem de Capa */}
        <div className="h-64 md:h-96 relative">
          <img src={event.image} className="w-full h-full object-cover" alt={event.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white">
            <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded uppercase mb-3 inline-block shadow">{event.category}</span>
            <h1 className="text-3xl md:text-5xl font-bold mb-2 leading-tight">{event.title}</h1>
            <p className="flex items-center gap-2 text-slate-300 font-medium"><MapPin size={18}/> {event.location}</p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 md:p-10 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">Sobre o Evento</h2>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">{event.description}</p>
            </div>
          </div>

          {/* Sidebar de Informações */}
          <div className="md:col-span-1">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm border border-slate-100"><Calendar size={24}/></div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Data</p>
                  <p className="font-bold text-slate-800">{new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm border border-slate-100"><Clock size={24}/></div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Horário</p>
                  <p className="font-bold text-slate-800">{event.time}</p>
                </div>
              </div>
              
              <hr className="border-slate-200 my-2"/>
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg transform active:scale-95">
                <Ticket size={20}/> Comprar Ingresso
              </button>
              <p className="text-xs text-center text-slate-400 mt-2">Vendas externas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}