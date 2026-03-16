import React from 'react';
import { Calendar, MapPin, Clock, ArrowLeft, Share2, Ticket, Users, Info } from 'lucide-react';

const EventDetailPage = ({ event, onBack }) => {
  // Se por algum motivo o evento não chegar, mostra carregando ou erro
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Evento não encontrado</h2>
          <button onClick={onBack} className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all w-full">
            <ArrowLeft size={20} className="mr-2" /> Voltar para Agenda
          </button>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } catch (err) {
      console.log('Erro ao compartilhar:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 animate-in fade-in duration-500">
      {/* Banner Superior */}
      <div className="relative h-[250px] md:h-[400px] w-full overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="absolute top-4 left-4 flex gap-4">
          <button 
            onClick={onBack}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all"
          >
            <ArrowLeft size={20} className="text-gray-900" />
          </button>
        </div>

        <button 
          onClick={handleShare}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all"
        >
          <Share2 size={20} className="text-gray-900" />
        </button>

        <div className="absolute bottom-6 left-4 right-4">
          <div className="max-w-5xl mx-auto">
            <span className="inline-block px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-bold mb-2">
              {event.category || 'Evento'}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-1 drop-shadow-md">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Info className="text-indigo-600" size={20} />
                Sobre o Evento
              </h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {event.organizer && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Users className="text-indigo-600" size={20} />
                  Organização
                </h3>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold uppercase">
                    {event.organizer.charAt(0)}
                  </div>
                  <span className="text-slate-700 font-medium">{event.organizer}</span>
                </div>
              </div>
            )}
          </div>

          {/* Coluna Lateral */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
              <h3 className="text-md font-bold text-slate-800 mb-5">Detalhes Importantes</h3>
              
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-indigo-600">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Data</p>
                    <p className="text-sm text-slate-700 font-medium">{event.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-indigo-600">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Horário</p>
                    <p className="text-sm text-slate-700 font-medium">{event.time || 'A definir'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-indigo-600">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Local</p>
                    <p className="text-sm text-slate-700 font-medium">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 text-sm">Entrada</span>
                  <span className="text-xl font-bold text-green-600">
                    {event.price === '0' || !event.price ? 'Gratuito' : `R$ ${event.price}`}
                  </span>
                </div>
                
                <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-100">
                  <Ticket size={20} />
                  Ver Ingressos / Informações
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;