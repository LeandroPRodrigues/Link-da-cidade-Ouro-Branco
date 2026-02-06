import React, { useState } from 'react';
import { Car, Search, Fuel, Calendar, Gauge, Plus } from 'lucide-react';
import VehicleForm from '../components/VehicleForm';
import Modal from '../components/Modal';

export default function VehiclesPage({ vehiclesData, user, onCrud, onVehicleClick, checkLimit }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredVehicles = vehiclesData.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSuccess = (data) => {
    onCrud.addVehicle(data);
    setIsModalOpen(false);
    alert("Veículo anunciado com sucesso!");
  };

  return (
    <div className="px-4 md:px-0 pb-12 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 pt-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Car className="text-orange-600" /> Veículos em Ouro Branco
          </h2>
          <p className="text-slate-500">Carros e motos novos e seminovos.</p>
        </div>

        {/* BOTÃO ANUNCIAR (Usa checkLimit) */}
        <button 
          onClick={() => checkLimit(() => setIsModalOpen(true))} 
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition flex items-center gap-2"
        >
          <Plus size={20} /> Vender meu Carro
        </button>
      </div>

      {/* Busca */}
      <div className="relative mb-8">
        <input 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Busque por modelo, marca (ex: Gol, Honda, Fiat)..." 
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <Search className="absolute left-4 top-3.5 text-slate-400" size={20}/>
      </div>

      {/* Grid de Veículos */}
      <div className="grid md:grid-cols-4 gap-6">
        {filteredVehicles.length > 0 ? filteredVehicles.map(vehicle => (
          <div 
            key={vehicle.id} 
            onClick={() => onVehicleClick(vehicle)}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden border border-slate-100 group"
          >
            <div className="relative h-40 bg-slate-200 overflow-hidden">
              <img 
                src={vehicle.photos[0]} 
                alt={vehicle.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded font-bold">
                {vehicle.year}
              </span>
            </div>
            
            <div className="p-3">
              <h3 className="font-bold text-slate-800 text-sm truncate mb-1">{vehicle.brand} {vehicle.model}</h3>
              <p className="text-xs text-slate-500 mb-2 truncate">{vehicle.title}</p>
              <p className="text-orange-600 font-bold text-lg mb-3">
                {Number(vehicle.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              
              <div className="flex justify-between items-center text-slate-400 text-[10px] border-t pt-2">
                <span className="flex items-center gap-1"><Gauge size={12}/> {vehicle.km}km</span>
                <span className="flex items-center gap-1"><Fuel size={12}/> {vehicle.fuel}</span>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-4 text-center py-12 bg-slate-50 rounded-xl border border-dashed">
            <Car size={48} className="mx-auto text-slate-300 mb-4"/>
            <p className="text-slate-500">Nenhum veículo encontrado.</p>
          </div>
        )}
      </div>

      {/* Modal de Cadastro */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Anunciar Veículo">
        <VehicleForm user={user} onSuccess={handleSuccess} />
      </Modal>

    </div>
  );
}