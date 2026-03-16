import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import EventCarousel from '../components/EventCarousel';
import EventCalendar from '../components/EventCalendar';
import SectionHeader from '../components/SectionHeader';
import { Calendar } from 'lucide-react';

const EventsPage = ({ onEventClick }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ALTERAÇÃO AQUI: Mudamos de "asc" para "desc" para mostrar os eventos mais novos/futuros primeiro
    const q = query(collection(db, "events"), orderBy("date", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Mantemos o trim() para garantir que o espaço extra do n8n não quebre nada
          date: typeof data.date === 'string' ? data.date.trim() : data.date
        };
      });
      setEvents(eventsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader 
          title="Eventos em Ouro Branco" 
          subtitle="Fique por dentro de tudo o que acontece na cidade"
          icon={Calendar}
        />
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Destaques</h2>
            <EventCarousel events={events} onEventClick={onEventClick} />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Calendário de Eventos</h2>
            <EventCalendar events={events} onEventClick={onEventClick} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;