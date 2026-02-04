import React, { useState, useEffect } from 'react';
import { GUIDE_CATEGORIES } from '../data/mockData';

export default function GuideForm({ onSuccess, initialData }) {
  const [formData, setFormData] = useState({
    name: '', category: '', address: '', phone: '', description: '', image: ''
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      id: initialData ? initialData.id : Date.now(),
      // Se não tiver imagem, usa uma placeholder genérica
      image: formData.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400"
    };
    onSuccess(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Nome do Estabelecimento</label>
        <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input w-full font-bold" placeholder="Ex: Farmácia Central"/>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Categoria</label>
          <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input w-full bg-white">
            <option value="">Selecione...</option>
            {GUIDE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Telefone / WhatsApp</label>
          <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="input w-full" placeholder="(31) 99999-9999"/>
        </div>
      </div>

      <div>
        <label className="label">Endereço Completo</label>
        <input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="input w-full" placeholder="Rua, Número, Bairro"/>
      </div>

      <div>
        <label className="label">Descrição Curta</label>
        <input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input w-full" placeholder="Ex: Aberto 24h, Especialista em..."/>
      </div>

      <div>
        <label className="label">URL da Imagem (Opcional)</label>
        <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="input w-full" placeholder="https://..."/>
      </div>

      <button className="btn-primary w-full bg-blue-600 hover:bg-blue-700">
        {initialData ? 'Atualizar Local' : 'Cadastrar Local'}
      </button>
    </form>
  );
}