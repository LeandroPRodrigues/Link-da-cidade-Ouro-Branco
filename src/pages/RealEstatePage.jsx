import React, { useState } from 'react';
import { Home, MapPin, Bed, Bath, Car, Maximize, PlusCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PropertyForm from '../components/PropertyForm';

// ==========================================
// CRIAÇÃO DOS PINS PERSONALIZADOS POR COR
// ==========================================
const createIcon = (color) => new L.DivIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 36px; height: 36px; filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.3));"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3" fill="white"></circle></svg>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

const pinVenda = createIcon('#EF4444');    // Vermelho (Venda)
const pinAluguel = createIcon('#3B82F6');  // Azul (Aluguel)
const pinTemporada = createIcon('#10B981');// Verde (Temporada)

const getPinColor = (type) => {
  if (type === 'Venda') return pinVenda;
  if (type === 'Aluguel') return pinAluguel;
  if (type === 'Temporada') return pinTemporada;
  return pinVenda; // Padrão
};

export default function RealEstatePage({ user, navigate, propertiesData, onCrud, checkLimit }) {
  const [filter, setFilter] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado que controla o modal do formulário

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
          // Agora, em vez de enviar para o admin, ele abre o modal diretamente na página!
          onClick={() => checkLimit(() => setIsModalOpen(true))} 
          className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-sm w-full md:w-auto justify-center"
        >
          <PlusCircle size={20}/> Anunciar Imóvel
        </button>
      </div>

      {/* MAPA GLOBAL DE IMÓVEIS COM LEGENDA */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 mb-6 z-0 relative">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-2 pt-2">Mapa de Imóveis</h2>
        
        <div className="w-full h-80 rounded-xl overflow-hidden relative z-0">
          <MapContainer center={[-20.5236, -43.6914]} zoom={14} scrollWheelZoom={false} className="w-full h-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {properties.map(p => p.lat && p.lng && (
              <Marker key={p.id} position={[p.lat, p.lng]} icon={getPinColor(p.type)}>
                <Popup>
                  <div className="w-40 text-center cursor-pointer" onClick={() => navigate('property_detail')}>
                    <img src={p.image || p.photos?.[0]} alt={p.title} className="w-full h-20 object-cover rounded-lg mb-2" />
                    <span className={`text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      p.type === 'Venda' ? 'bg-red-500' : p.type === 'Aluguel' ? 'bg-blue-500' : 'bg-emerald-500'
                    }`}>
                      {p.type}
                    </span>
                    <p className="font-bold text-slate-800 mt-1 line-clamp-1">{p.title}</p>
                    <p className="font-black text-slate-700">{Number(p.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* LEGENDA FLUTUANTE DO MAPA */}
          <div className="absolute bottom-4 right-4 z-[400] bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200 flex flex-col gap-2 pointer-events-none">
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
              {/* Etiqueta na lista combinando com a cor do Pin */}
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

      {/* ======================================================== */}
      {/* MODAL COM O FORMULÁRIO DE CADASTRO DE IMÓVEL */}
      {/* ======================================================== */}
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