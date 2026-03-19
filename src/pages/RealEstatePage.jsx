import React, { useState } from 'react';
import { Home, MapPin, Bed, Bath, Car, Maximize, PlusCircle, X } from 'lucide-react';
import { GoogleMap, Marker, Circle, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import PropertyForm from '../components/PropertyForm';

const LIBRARIES = ['places'];
const CENTER = { lat: -20.5236, lng: -43.6914 };

// Configuração das cores para o mapa
const pinIcons = {
  'Venda': { url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', hex: '#EF4444' },
  'Aluguel': { url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', hex: '#3B82F6' },
  'Temporada': { url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png', hex: '#10B981' }
};

export default function RealEstatePage({ user, navigate, propertiesData, onCrud, checkLimit }) {
  const [filter, setFilter] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null); // Controla qual InfoWindow está aberto no mapa

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const properties = propertiesData?.filter(p => filter === 'Todos' || p.type === filter) || [];

  return (
    <div className="animate-in fade-in pb-10">
      
      {/* CABEÇALHO */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2"><Home className="text-emerald-500" /> Mercado Imobiliário</h1>
          <p className="text-slate-500 text-sm">Encontre a sua próxima casa ou apartamento em Ouro Branco</p>
        </div>
        <button 
          onClick={() => checkLimit(() => setIsModalOpen(true))} 
          className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-sm w-full md:w-auto justify-center"
        >
          <PlusCircle size={20}/> Anunciar Imóvel
        </button>
      </div>

      {/* MAPA GLOBAL DE IMÓVEIS (GOOGLE MAPS) */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 mb-6 z-0 relative">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-2 pt-2">Mapa de Imóveis</h2>
        
        <div className="w-full h-80 rounded-xl overflow-hidden relative z-0 border border-slate-200">
          {!isLoaded ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-500">Carregando mapa...</div>
          ) : (
            <GoogleMap mapContainerStyle={{ width: '100%', height: '100%' }} center={CENTER} zoom={14} options={{ streetViewControl: false, mapTypeControl: false, gestureHandling: 'cooperative' }}>
              
              {properties.map(p => {
                if (!p.lat || !p.lng) return null;
                const style = pinIcons[p.type] || pinIcons['Venda'];
                const position = { lat: p.lat, lng: p.lng };

                // Se o usuário marcou como região (approx), desenha um círculo
                if (p.privacy === 'approx') {
                  return (
                    <Circle 
                      key={p.id} 
                      center={position} 
                      radius={500} 
                      onClick={() => setSelectedProperty(p)}
                      options={{ fillColor: style.hex, fillOpacity: 0.35, strokeColor: style.hex, strokeOpacity: 0.8, strokeWeight: 2 }} 
                    />
                  );
                }

                // Se for ponto exato, desenha o Marker
                return (
                  <Marker 
                    key={p.id} 
                    position={position} 
                    icon={style.url} 
                    onClick={() => setSelectedProperty(p)} 
                  />
                );
              })}

              {/* POPUP DE INFORMAÇÕES (INFOWINDOW) */}
              {selectedProperty && (
                <InfoWindow position={{ lat: selectedProperty.lat, lng: selectedProperty.lng }} onCloseClick={() => setSelectedProperty(null)}>
                  <div className="w-40 text-center cursor-pointer p-1" onClick={() => navigate('property_detail')}>
                    <img src={selectedProperty.image || selectedProperty.photos?.[0]} alt={selectedProperty.title} className="w-full h-20 object-cover rounded-lg mb-2" />
                    <span className={`text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      selectedProperty.type === 'Venda' ? 'bg-red-500' : selectedProperty.type === 'Aluguel' ? 'bg-blue-500' : 'bg-emerald-500'
                    }`}>
                      {selectedProperty.type}
                    </span>
                    <p className="font-bold text-slate-800 mt-1 line-clamp-1">{selectedProperty.title}</p>
                    <p className="font-black text-slate-700">{Number(selectedProperty.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    {selectedProperty.privacy === 'approx' && <p className="text-[9px] text-slate-400 mt-1 uppercase">Localização Aproximada</p>}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}

          {/* LEGENDA FLUTUANTE DO MAPA */}
          <div className="absolute bottom-6 right-2 z-[400] bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200 flex flex-col gap-2 pointer-events-none">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-inner"></div> Venda</div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><div className="w-3.5 h-3.5 rounded-full bg-blue-500 shadow-inner"></div> Aluguel</div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-inner"></div> Temporada</div>
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
        {['Todos', 'Venda', 'Aluguel', 'Temporada'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${filter === f ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>
            {f === 'Todos' ? 'Todos os Imóveis' : `Para ${f}`}
          </button>
        ))}
      </div>

      {/* GRID DE IMÓVEIS (LISTA) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => (
          <div key={property.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition cursor-pointer group" onClick={() => navigate('property_detail')}>
            <div className="relative h-56 overflow-hidden">
              <img src={property.image || property.photos?.[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              <div className={`absolute top-3 left-3 text-white text-xs font-black px-3 py-1 rounded-lg shadow-sm uppercase tracking-wide ${
                property.type === 'Venda' ? 'bg-red-500' : property.type === 'Aluguel' ? 'bg-blue-500' : 'bg-emerald-500'
              }`}>
                {property.type}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white font-black text-xl">{Number(property.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-1">{property.title}</h3>
              <p className="text-slate-500 text-sm flex items-center gap-1.5 mb-4 line-clamp-1"><MapPin size={16} className="text-slate-400"/> {property.address}</p>
              <div className="flex justify-between pt-4 border-t border-slate-100 text-slate-600 text-sm font-medium">
                <div className="flex items-center gap-1.5" title="Quartos"><Bed size={18} className="text-slate-400"/> {property.bedrooms || '-'}</div>
                <div className="flex items-center gap-1.5" title="Banheiros"><Bath size={18} className="text-slate-400"/> {property.bathrooms || '-'}</div>
                <div className="flex items-center gap-1.5" title="Vagas"><Car size={18} className="text-slate-400"/> {property.garage || '-'}</div>
                <div className="flex items-center gap-1.5" title="Área m²"><Maximize size={18} className="text-slate-400"/> {property.area || '-'} m²</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE CADASTRO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-black text-slate-800 mb-6 border-b border-slate-100 pb-4">
              Anunciar Novo Imóvel
            </h2>
            <PropertyForm 
              initialData={null} 
              onSuccess={(formData) => {
                onCrud.addProperty(formData);
                setIsModalOpen(false);
                alert("O seu imóvel foi cadastrado com sucesso!");
              }}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}