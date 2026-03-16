import React, { useState } from 'react';
import { Home, MapPin, Search, Filter, Bed, Bath, Car, Maximize, PlusCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function RealEstatePage({ user, navigate, propertiesData, checkLimit }) {
  const [filter, setFilter] = useState('Todos');

  // Filtra os imóveis normais para a lista
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
          onClick={() => checkLimit(() => { navigate('admin'); /* Direciona pro admin ou modal */ })} 
          className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-sm w-full md:w-auto justify-center"
        >
          <PlusCircle size={20}/> Anunciar Imóvel
        </button>
      </div>

      {/* MAPA GLOBAL DE IMÓVEIS (Exibe os pins de todos os imóveis da cidade) */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 mb-6 z-0 relative">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-2 pt-2">Mapa de Imóveis</h2>
        <div className="w-full h-80 rounded-xl overflow-hidden relative z-0">
          <MapContainer center={[-20.5236, -43.6914]} zoom={14} scrollWheelZoom={false} className="w-full h-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {/* Desenha um Pin para cada imóvel que tenha Latitude e Longitude */}
            {properties.map(p => p.lat && p.lng && (
              <Marker key={p.id} position={[p.lat, p.lng]}>
                <Popup>
                  <div className="w-40 text-center cursor-pointer" onClick={() => navigate('property_detail')}>
                    <img src={p.image || p.photos?.[0]} alt={p.title} className="w-full h-20 object-cover rounded-lg mb-2" />
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{p.type}</span>
                    <p className="font-bold text-slate-800 mt-1 line-clamp-1">{p.title}</p>
                    <p className="font-black text-emerald-600">{Number(p.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* FILTROS */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
        {['Todos', 'Venda', 'Aluguel'].map(f => (
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
              <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-lg shadow-sm uppercase tracking-wide">{property.type}</div>
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
    </div>
  );
}