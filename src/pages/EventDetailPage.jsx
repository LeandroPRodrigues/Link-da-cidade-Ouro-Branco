import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Calendar, MapPin, ArrowLeft, Share2, Ticket } from 'lucide-react';

const EventDetailPage = ({ eventId, onBack }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "events", eventId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data(); // Corrigido aqui: removido o .snapshot
          setEvent({
            id: docSnap.id,
            ...data,
            // Garante que a data esteja limpa sem espaços
            date: typeof data.date === 'string' ? data.date.trim() : data.date
          });
        } else {
          console.error("Evento não encontrado no banco de dados.");
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do evento:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Evento não encontrado.</p>
          <button onClick={onBack} className="text-blue-600 hover:underline">Voltar para a lista</button>
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
      console.error('Erro ao compartilhar:', err);
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

        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg mb-8"
        />

        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  <span>
                    {event.date ? new Date(event.date + 'T12:00:00').toLocaleDateString('pt-BR') : 'Data não definida'} 
                    {event.time ? ` às ${event.time}` : ''}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleShare}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sobre o Evento</h2>
            <p className="text-gray-600 whitespace-pre-line leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* BOTÃO COMPRAR INGRESSOS (VERDE) */}
          {event.link && (
            <div className="pt-8 border-t border-gray-100">
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg"
              >
                <Ticket className="w-6 h-6 mr-2" />
                Comprar Ingressos
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;