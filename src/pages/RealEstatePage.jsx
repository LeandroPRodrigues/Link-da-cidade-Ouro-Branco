import React, { useState } from 'react';
import { List, Map as MapIcon, Plus, MapPin } from 'lucide-react';

// Imports dos Componentes
import Modal from '../components/Modal';
import PropertyCard from '../components/PropertyCard';
import PropertyForm from '../components/PropertyForm';

const CITY_NAME = "Ouro Branco";

// Agora este componente recebe os dados e as funções do Pai (App.jsx)
export default function RealEstatePage({ user, navigate, onSelectProperty, propertiesData, onCrud }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('Todos');
  const [viewMode, setViewMode] = useState('grid'); // grid | map

  const handleOpenRegister = () => {
    if (!user) return alert("Faça login para anunciar!");
    
    // Regra de negócio: Visitantes (não-admins) só podem ter 1 imóvel ativo
    if (user.role !== 'admin') {
      const userProps = propertiesData.filter(p => p.userId === user.id && p.status === 'active');
      if (userProps.length >= 1) return alert("Visitantes só podem ter 1 imóvel ativo por vez.");
    }
    setIsModalOpen(true);
  };

  // Funções simplificadas usando o crud do pai
  const handleDelete = (id) => {
    if(window.confirm("Tem certeza que deseja excluir este anúncio?")) {
      onCrud.deleteProperty(id);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const prop = propertiesData.find(p => p.id === id);
    onCrud.updateProperty({ ...prop, status: newStatus });
  };

  // Callback de Sucesso do Formulário
  const handleFormSuccess = (property) => {
    onCrud.addProperty(property);
    setIsModalOpen(false);
    alert("Imóvel cadastrado com sucesso! Ele ficará ativo por 30 dias.");
  };

  // Filtragem local visual
  const filteredProps = propertiesData.filter(p => filter === 'Todos' ? true : p.type === filter);

  return (
    <div className="px-4 md:px-0 pb-12">
      <div className="flex justify-between items-center my-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Imóveis em {CITY_NAME}</h2>
          <p className="text-slate-500">Encontre o lugar perfeito para morar ou investir.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white border rounded-lg p-1 flex">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-slate-100' : ''}`} title="Lista"><List size={20}/></button>
            <button onClick={() => setViewMode('map')} className={`p-2 rounded ${viewMode === 'map' ? 'bg-slate-100' : ''}`} title="Mapa"><MapIcon size={20}/></button>
          </div>
          <button onClick={handleOpenRegister} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition">
            <Plus size={20}/> Anunciar
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['Todos', 'Venda', 'Aluguel', 'Temporada'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${filter === f ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {f}
          </button>
        ))}
      </div>

      {viewMode === 'grid' ? (
        <div className="grid md:grid-cols-4 gap-6">
          {filteredProps.map(prop => (
            <PropertyCard 
              key={prop.id} 
              property={prop} 
              isOwner={user?.id === prop.userId}
              isAdmin={user?.role === 'admin'}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onClick={() => onSelectProperty(prop)}
            />
          ))}
          {filteredProps.length === 0 && (
            <div className="col-span-4 text-center py-12 bg-slate-50 border border-dashed rounded-xl text-slate-500">
              Nenhum imóvel encontrado nesta categoria. Seja o primeiro a anunciar!
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-200 rounded-xl h-[600px] relative overflow-hidden border border-slate-300">
          <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/2275px-Google_Maps_Logo_2020.svg.png')] bg-cover opacity-30 grayscale"></div>
          {filteredProps.map(prop => (
            prop.location?.lat && (
              <div 
                key={prop.id}
                onClick={() => onSelectProperty(prop)}
                className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer hover:scale-110 transition z-10"
                style={{ 
                  top: `${(prop.location.lat + 20.6) * 1000}%`, // Projeção Fictícia
                  left: `${(prop.location.lng + 43.8) * 1000}%` 
                }}
              >
                {prop.privacy === 'exact' ? (
                  <MapPin size={40} className="text-red-600 fill-current drop-shadow-md" />
                ) : (
                  <div className="w-12 h-12 bg-blue-500/40 rounded-full border-2 border-blue-500"></div>
                )}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white px-2 py-1 rounded shadow text-xs font-bold whitespace-nowrap opacity-0 hover:opacity-100 group-hover:opacity-100">
                  R$ {prop.price}
                </div>
              </div>
            )
          ))}
          <div className="absolute bottom-4 left-4 bg-white/90 p-4 rounded-lg shadow-lg max-w-xs text-xs">
            <strong>Modo Pesquisa no Mapa (Simulado)</strong><br/>
            Neste protótipo, os pins são posicionados aleatoriamente. Em produção, use a API do Google Maps para precisão real.
          </div>
        </div>
      )}

      {/* MODAL DE CRIAÇÃO (Aqui sempre passamos initialData={null} pois é um novo anúncio) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Anúncio de Imóvel" large>
        <PropertyForm user={user} onSuccess={handleFormSuccess} initialData={null} />
      </Modal>
    </div>
  );
}