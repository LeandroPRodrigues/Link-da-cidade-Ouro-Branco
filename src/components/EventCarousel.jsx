import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

export default function EventCarousel({ events, onEventClick }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300; // Quantidade de pixels para rolar
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      {/* Botão Esquerda */}
      <button 
        onClick={() => scroll('left')} 
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg -ml-4 md:ml-0"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Lista de Cards (Scroll Horizontal) */}
      <div 
        ref={scrollRef} 
        className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide px-1"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {events.map(event => (
          <div 
            key={event.id} 
            onClick={() => onEventClick(event)}
            className="flex-none w-[160px] md:w-[220px] cursor-pointer group/card"
            style={{ scrollSnapAlign: 'start' }}
          >
            {/* Poster Imagem */}
            <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-md mb-3 relative">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover group-hover/card:scale-110 transition duration-500" 
              />
              <div className="absolute inset-0 bg-black/20 group-hover/card:bg-transparent transition"></div>
              
              {/* Data Flutuante na Imagem */}
              <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-blue-900 flex flex-col items-center leading-tight shadow">
                <span className="text-lg">{new Date(event.date + 'T00:00:00').getDate()}</span>
                <span className="uppercase text-[10px]">{new Date(event.date + 'T00:00:00').toLocaleString('pt-BR', { month: 'short' }).replace('.','')}</span>
              </div>
            </div>

            {/* Legenda */}
            <h3 className="font-bold text-slate-800 leading-tight group-hover/card:text-blue-600 transition mb-1 text-sm md:text-base">
              {event.title}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
              <MapPin size={10} /> {event.location}
            </p>
          </div>
        ))}
      </div>

      {/* Botão Direita */}
      <button 
        onClick={() => scroll('right')} 
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg -mr-4 md:mr-0"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}