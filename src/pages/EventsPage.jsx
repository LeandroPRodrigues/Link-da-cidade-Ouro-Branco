import React from 'react';
import EventCarousel from '../components/EventCarousel';
import EventCalendar from '../components/EventCalendar';

export default function EventsPage({ onEventClick, eventsData }) {
  return (
    <div className="px-4 md:px-0 pb-12 space-y-12 animate-in fade-in">
      {/* Cabeçalho */}
      <div className="py-8 border-b">
        <h2 className="text-3xl font-bold text-slate-800">Agenda Cultural</h2>
        <p className="text-slate-500 mt-2">Shows, festivais, teatro e tudo o que acontece em Ouro Branco.</p>
      </div>

      {/* Seção 1: Destaques (Carrossel) */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-600 rounded-full inline-block"></span>
            Em Destaque
          </h3>
        </div>
        
        {/* Passamos todos os eventos para o carrossel */}
        {eventsData.length > 0 ? (
          <EventCarousel events={eventsData} onEventClick={onEventClick} />
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed text-slate-400">
            Nenhum evento em destaque no momento.
          </div>
        )}
      </section>

      {/* Seção 2: Calendário Completo */}
      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-purple-600 rounded-full inline-block"></span>
          Calendário de Eventos
        </h3>
        <p className="text-slate-500 mb-6">Confira a programação completa por data. Clique nos dias coloridos para ver os detalhes.</p>
        
        <EventCalendar events={eventsData} onEventClick={onEventClick} />
      </section>
    </div>
  );
}