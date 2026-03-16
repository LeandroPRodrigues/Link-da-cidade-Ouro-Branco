import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Calendar, MapPin, ArrowLeft, Share2, Ticket } from 'lucide-react';

const EventDetailPage = ({ eventId, onBack }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setError("ID do evento não fornecido.");
        setLoading(false);
        return;
      }

      try {
        console.log("Buscando evento com ID:", eventId);
        const docRef = doc(db, "events", eventId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEvent({
            id: docSnap.id,
            ...data,
            date: typeof data.date === 'string' ? data.date.trim() : data.date
          });
        } else {
          console.error("Documento não existe no Firebase!");
          setError("Evento não encontrado.");
        }
      } catch (err) {
        console.error("Erro ao buscar detalhes:", err);
        setError("Erro ao carregar dados do servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Se estiver carregando
  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500">Carregando detalhes...</p>
      </div>
    );
  }

  // Se houver erro ou evento não encontrado
  if (error || !event) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center px-4">
        <p className="text-red-500 mb-4 font-medium">{error || "Evento não disponível."}</p>
        <button 
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para a agenda
        </button>
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
      console.log('Botão compartilhar clicado');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para Eventos
        </button>

        <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
            <img 
            src={event.image || 'https://via.placeholder.com/800x400?text=Sem+Imagem'} 
            alt={event.title}
            className="w-full h-64 md:h-96 object-cover"
            />
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                  <span>
                    {event.date ? new Date(event.date + 'T12:00:00').toLocaleDateString('pt-BR') : 'Data a definir'}
                    {event.time ? ` às ${event.time}` : ''}
                  </span>
                </div>
                <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                  <span>{event.location || 'Local não informado'}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleShare}
              className="p-3 bg-gray-50 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sobre o Evento</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">
              {event.description}
            </p>
          </div>

          {event.link && (
            <div className="pt-6">
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full md:w-max px-10 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1"
              >
                <Ticket className="w-6 h-6 mr-3" />
                ADQUIRIR INGRESSOS (SYMPLA)
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;