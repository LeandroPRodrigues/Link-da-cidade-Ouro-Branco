import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, List } from 'lucide-react';

export default function EventCalendar({ events, onEventClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); // null = Mês Inteiro selecionado

  // --- LÓGICA DE DATAS ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Domingo
  
  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  // --- FILTROS ---
  
  // Função para pegar eventos de um dia específico (usada para desenhar o grid)
  const getEventsForDay = (day) => {
    // Formata dia e mês para ter 2 dígitos (ex: 01, 05, 12)
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    
    // Filtra eventos que batem com a data
    return events.filter(e => e.date === dateStr);
  };

  const changeMonth = (offset) => {
    setCurrentDate(new Date(year, month + offset, 1));
    setSelectedDate(null); // Reseta para ver o mês novo inteiro
  };

  // Define quais eventos mostrar na LISTA ABAIXO
  // Se tiver dia selecionado, mostra só o dia. Se não, mostra o mês inteiro.
  const activeEventsList = selectedDate 
    ? getEventsForDay(selectedDate)
    : events.filter(e => {
        const eDate = new Date(e.date + 'T00:00:00');
        return eDate.getMonth() === month && eDate.getFullYear() === year;
      }).sort((a, b) => new Date(a.date) - new Date(b.date)); // Ordena por data

  return (
    <div className="flex flex-col gap-8 animate-in fade-in">
      
      {/* --- PARTE 1: O CALENDÁRIO VISUAL --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Cabeçalho do Calendário */}
        <div className="flex flex-col md:flex-row justify-between items-center p-6 border-b border-slate-100 gap-4">
          <h3 className="font-bold text-xl capitalize text-slate-800 flex items-center gap-2">
            <CalendarIcon className="text-blue-600" /> {monthName}
          </h3>
          
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
             {/* Botão para limpar a seleção e ver o mês todo */}
            <button 
              onClick={() => setSelectedDate(null)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition flex items-center gap-2 ${selectedDate === null ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <List size={14}/> Mês Inteiro
            </button>
            <div className="w-px h-4 bg-slate-300 mx-1"></div>
            <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-600 transition"><ChevronLeft size={18}/></button>
            <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-600 transition"><ChevronRight size={18}/></button>
          </div>
        </div>

        {/* Grid dos Dias da Semana */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
            <div key={d} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>

        {/* Grid dos Dias (Agora maiores) */}
        <div className="grid grid-cols-7 auto-rows-[1fr]">
          {/* Dias vazios do mês anterior */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-slate-50/30 border-b border-r border-slate-100 min-h-[100px] md:min-h-[140px]" />
          ))}

          {/* Dias do Mês */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDay(day);
            const isSelected = selectedDate === day;
            const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

            return (
              <div 
                key={day}
                onClick={() => setSelectedDate(day)}
                className={`
                  min-h-[100px] md:min-h-[140px] p-2 border-b border-r border-slate-100 cursor-pointer transition relative group
                  ${isSelected ? 'bg-blue-50 ring-2 ring-inset ring-blue-500 z-10' : 'hover:bg-slate-50 bg-white'}
                `}
              >
                {/* Número do Dia */}
                <div className="flex justify-between items-start mb-2">
                  <span className={`
                    text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full
                    ${isToday ? 'bg-blue-600 text-white' : 'text-slate-700'}
                  `}>
                    {day}
                  </span>
                  {dayEvents.length > 0 && <span className="text-[10px] text-slate-400 font-medium md:hidden">{dayEvents.length} ev.</span>}
                </div>

                {/* Lista de Eventos (Dentro do Quadrado) */}
                <div className="space-y-1 hidden md:block">
                  {/* Mostra apenas os 3 primeiros */}
                  {dayEvents.slice(0, 3).map((evt) => (
                    <div 
                      key={evt.id} 
                      className="px-2 py-1 text-[10px] font-bold rounded border truncate transition
                        bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
                      title={evt.title}
                    >
                      {evt.title}
                    </div>
                  ))}
                  
                  {/* Indicador de Mais Eventos (+) */}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] font-bold text-slate-500 pl-1">
                      + {dayEvents.length - 3} mais...
                    </div>
                  )}
                </div>
                
                {/* Versão Mobile (Bolinhas) */}
                <div className="flex gap-1 md:hidden flex-wrap">
                  {dayEvents.map((_, idx) => (
                    <div key={idx} className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- PARTE 2: A LISTA DETALHADA (ABAIXO) --- */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h4 className="font-bold text-xl text-slate-800">
              {selectedDate 
                ? `Programação de ${selectedDate} de ${monthName}` 
                : `Agenda Completa de ${monthName}`}
            </h4>
            <p className="text-slate-500 text-sm mt-1">
              {activeEventsList.length} evento(s) encontrado(s).
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeEventsList.length === 0 ? (
             <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
               Nenhum evento agendado para este período.
             </div>
          ) : (
            activeEventsList.map(evt => (
              <div 
                key={evt.id} 
                onClick={() => onEventClick(evt)} 
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:border-blue-400 hover:shadow-md transition flex gap-4 group"
              >
                {/* Data Lateral */}
                <div className="flex flex-col items-center justify-center bg-slate-100 text-slate-600 rounded-lg p-2 w-16 h-16 shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                  <span className="text-xl font-bold">{new Date(evt.date + 'T00:00:00').getDate()}</span>
                  <span className="text-[10px] font-bold uppercase">{new Date(evt.date + 'T00:00:00').toLocaleString('pt-BR', { month: 'short' }).replace('.','')}</span>
                </div>

                {/* Detalhes */}
                <div className="overflow-hidden">
                  <h5 className="font-bold text-slate-800 truncate group-hover:text-blue-600 transition">{evt.title}</h5>
                  <p className="text-xs text-blue-600 font-bold mb-1">{evt.category}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-2 truncate">
                    <span className="flex items-center gap-1"><Clock size={10}/> {evt.time}</span>
                    <span className="flex items-center gap-1"><MapPin size={10}/> {evt.location}</span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}