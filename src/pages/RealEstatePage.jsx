import React, { useState } from 'react';
import { Home, Search, Bed, Bath, Maximize, Plus, MapPin, Filter, AlertTriangle } from 'lucide-react';
import PropertyForm from '../components/PropertyForm';
import Modal from '../components/Modal';

export default function RealEstatePage({ user, navigate, propertiesData, onCrud, onSelectProperty, checkLimit }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // PROTEÇÃO MÁXIMA: Garante que propertiesData seja sempre uma lista
  const safeProperties = Array.isArray(propertiesData) ? propertiesData : [];

  const filteredProperties = safeProperties.filter(p => {
    // Se o imóvel estiver bugado (sem título), ignoramos ou tratamos
    if (!p) return false;
    
    const title = p.title ? String(p.title).toLowerCase() : '';
    const location = p.location ? String(p.location).toLowerCase() : '';
    const type = p.type ? String(p.type).toLowerCase() : '';
    const search = searchTerm.toLowerCase();
    
    const matchesSearch = title.includes(search) || location.includes(search);
    const matchesType = filterType === 'all' || type === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleSuccess = (data) => {
    onCrud.addProperty(data);
    setIsModalOpen(false);
    alert("Imóvel cadastrado com sucesso!");
  };

  return (
    <div className="animate-in fade-in pb-12">
      
      {/* Header Fixo */}
      <div className="bg-white p-6 rounded-b-2xl md:rounded-2xl shadow-sm border border-slate-100 mb-6 sticky top-[70px] z-30">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Home className="text-emerald-600" size={24} /> Imóveis
            </h2>
            <p className="text-xs text-slate-400">Encontre seu novo lar</p>
          </div>
          <button 
            onClick={() => checkLimit(() => setIsModalOpen(true))} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Plus size={18} /> Anunciar
          </button>
        </div>

        {/* Filtros */}
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar imóvel..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-xl outline-none"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18}/>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['all', 'venda', 'aluguel'].map(type => (
              <button 
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1 rounded-lg text-xs font-bold capitalize transition-all ${filterType === type ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {type === 'all' ? 'Todos' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length > 0 ? filteredProperties.map(property => {
          // Lógica de Foto Segura (Se não tiver foto, usa placeholder)
          const coverPhoto = (property.photos && Array.isArray(property.photos) && property.photos.length > 0)
            ? property.photos[0]
            : 'https://placehold.co/600x400?text=Sem+Foto';

          return (
            <div 
              key={property.id || Math.random()} 
              onClick={() => onSelectProperty(property)}
              className="group bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-56 bg-slate-200 overflow-hidden">
                <img 
                  src={coverPhoto} 
                  alt={property.title || 'Imóvel'} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  onError={(e) => e.target.src = 'https://placehold.co/600x400?text=Erro+Imagem'}
                />
                <span className={`absolute top-3 right-3 px-3 py-1 text-[10px] font-bold rounded-full uppercase text-white shadow-sm ${property.type === 'Venda' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                  {property.type || 'Oferta'}
                </span>
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-slate-800 text-lg mb-1 truncate">{property.title || 'Imóvel sem título'}</h3>
                <p className="text-emerald-600 font-black text-xl mb-4">
                  {property.price ? Number(property.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ --'}
                </p>
                
                <div className="flex justify-between items-center text-slate-500 text-xs border-t border-slate-50 pt-3">
                  <span className="flex items-center gap-1"><Bed size={14}/> {property.bedrooms || 0}</span>
                  <span className="flex items-center gap-1"><Bath size={14}/> {property.bathrooms || 0}</span>
                  <span className="flex items-center gap-1"><Maximize size={14}/> {property.area || 0}m²</span>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-20 text-center text-slate-400 bg-white rounded-2xl border border-dashed">
            <Filter size={48} className="mx-auto mb-3 opacity-20"/>
            <p>Nenhum imóvel cadastrado ou encontrado.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Anunciar Imóvel">
        <PropertyForm user={user} onSuccess={handleSuccess} />
      </Modal>
    </div>
  );
}