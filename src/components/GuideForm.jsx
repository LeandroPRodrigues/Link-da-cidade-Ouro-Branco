import React, { useState, useEffect } from 'react';
import { GUIDE_CATEGORIES } from '../data/mockData';
import LocationPicker from './LocationPicker'; // <-- IMPORT ADICIONADO AQUI

export default function GuideForm({ onSuccess, initialData }) {
  const [formData, setFormData] = useState({
    name: '', 
    category: '', 
    phone: '', 
    description: '', 
    image: ''
  });

  // Estado dedicado para o mapa (guarda morada, latitude e longitude)
  const [locationData, setLocationData] = useState({
    address: '',
    lat: null,
    lng: null,
    privacy: 'exact' // Sempre exato para o guia
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || '',
        phone: initialData.phone || '',
        description: initialData.description || '',
        image: initialData.image || ''
      });
      // Se estiver a editar, carrega os dados do mapa também
      if (initialData.location) {
        setLocationData(initialData.location);
      } else if (initialData.address) {
        setLocationData(prev => ({ ...prev, address: initialData.address }));
      }
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      address: locationData.address, // Pega a morada do LocationPicker
      location: locationData,        // Guarda as coordenadas exatas (lat, lng)
      id: initialData ? initialData.id : Date.now(),
      image: formData.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400"
    };
    onSuccess(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label font-semibold">Nome do Estabelecimento *</label>
        <input 
          required 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})} 
          className="input w-full font-bold" 
          placeholder="Ex: Farmácia Central"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label font-semibold">Categoria *</label>
          <select 
            required 
            value={formData.category} 
            onChange={e => setFormData({...formData, category: e.target.value})} 
            className="input w-full bg-white"
          >
            <option value="">Selecione...</option>
            {GUIDE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label className="label font-semibold">Telefone / WhatsApp *</label>
          <input 
            required 
            value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})} 
            className="input w-full" 
            placeholder="(31) 99999-9999"
          />
        </div>
      </div>

      {/* --- INÍCIO DA SEÇÃO DO MAPA USANDO O SEU COMPONENTE --- */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mt-2">
        {/* O LocationPicker já traz a barra de pesquisa do Google e o Mapa. 
            A variant="guide" garante que a opção de círculo não apareça! */}
        <LocationPicker 
          locationData={locationData}
          setLocationData={setLocationData}
          variant="guide" 
        />
        <p className="text-xs text-gray-500 mt-2 text-center">
          Dica: Pode arrastar o mapa ou clicar nele para afinar a localização exata do negócio.
        </p>
      </div>
      {/* --- FIM DA SEÇÃO DO MAPA --- */}

      <div>
        <label className="label font-semibold">Descrição Curta</label>
        <input 
          value={formData.description} 
          onChange={e => setFormData({...formData, description: e.target.value})} 
          className="input w-full" 
          placeholder="Ex: Aberto 24h, Especialista em..."
        />
      </div>

      <div>
        <label className="label font-semibold">URL da Imagem (Opcional)</label>
        <input 
          value={formData.image} 
          onChange={e => setFormData({...formData, image: e.target.value})} 
          className="input w-full" 
          placeholder="https://..."
        />
      </div>

      <button type="submit" className="btn-primary w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 mt-2 rounded-md transition-colors">
        {initialData ? 'Atualizar Local' : 'Cadastrar Local'}
      </button>
    </form>
  );
}