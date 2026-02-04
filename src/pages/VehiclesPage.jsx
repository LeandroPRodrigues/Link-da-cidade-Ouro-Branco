import React, { useState } from 'react';
import { Car, Search, Filter, Plus } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import Modal from '../components/Modal';
import VehicleForm from '../components/VehicleForm';

export default function VehiclesPage({ vehiclesData, onVehicleClick, user, onCrud }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('Todos'); // Todos, Carros, Motos (Simulado)

  // Filtra os veículos
  const filteredVehicles = vehiclesData.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && v.status === 'active';
  });

  const handleSellClick = () => {
    if (!user) return alert("Você precisa fazer login para anunciar seu veículo.");
    
    // Regra: Usuário comum só pode ter 1 anúncio ativo
    if (user.role !== 'admin') {
       const myAds = vehiclesData.filter(v => v.userId === user.id && v.status === 'active');
       if (myAds.length > 0) return alert("Usuários gratuitos só podem ter 1 anúncio ativo por vez.");
    }
    
    setIsModalOpen(true);
  };

  const handleFormSuccess = (vehicle) => {
    onCrud.addVehicle(vehicle);
    setIsModalOpen(false);
    alert("Anúncio criado com sucesso!");
  };

  return (
    <div className="px-4 md:px-0 pb-12 animate-in fade-in">
      {/* Header com Busca */}
      <div className="bg-slate-900 text-white -mx-4 md:mx-0 md:rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Classificados Automotivos</h2>
          <p className="text-slate-300 mb-6">Compre e venda carros e motos em Ouro Branco com segurança.</p>
          
          <div className="bg-white p-2 rounded-lg flex flex-col md:flex-row gap-2 shadow-lg max-w-2xl">
            <div className="flex-1 flex items-center px-3 bg-slate-50 rounded border border-slate-200 focus-within:border-blue-500 transition">
              <Search className="text-slate-400" size={20}/>
              <input 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Busque por marca, modelo..." 
                className="w-full bg-transparent p-3 outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>
            <button 
              onClick={handleSellClick}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition whitespace-nowrap shadow-md"
            >
              <Plus size={20}/> Quero Vender
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Carros */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
          <Car className="text-blue-600"/> Veículos em Destaque
        </h3>
        <span className="text-sm text-slate-500">{filteredVehicles.length} ofertas</span>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredVehicles.map(vehicle => (
          <VehicleCard 
            key={vehicle.id} 
            vehicle={vehicle} 
            onClick={() => onVehicleClick(vehicle)}
            isOwner={user?.id === vehicle.userId}
            isAdmin={user?.role === 'admin'}
            onEdit={() => alert("Para editar, acesse o painel Admin.")} // Simplificação para view pública
            onDelete={() => alert("Para excluir, acesse o painel Admin.")} 
          />
        ))}
        {filteredVehicles.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
            Nenhum veículo encontrado com estes termos.
          </div>
        )}
      </div>

      {/* Modal de Cadastro */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Anunciar Veículo" large>
        <VehicleForm user={user} onSuccess={handleFormSuccess} initialData={null} />
      </Modal>
    </div>
  );
}