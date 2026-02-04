import React, { useState, useEffect } from 'react';
import { JOB_CATEGORIES } from '../data/mockData';

export default function JobForm({ onSuccess, initialData }) {
  const [formData, setFormData] = useState({
    title: '', company: '', category: '', subcategory: '',
    type: 'CLT', salary: '', location: '', description: '',
    requirements: '', contact: '', validityDays: '30' // Padrão 30 dias
  });

  // Preenche dados se for edição
  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData, validityDays: '30' }); 
    }
  }, [initialData]);

  // Carrega subcategorias baseado na categoria escolhida
  const availableSubcategories = formData.category ? JOB_CATEGORIES[formData.category] : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calcular data de expiração baseada nos dias escolhidos
    const now = new Date();
    const daysToAdd = parseInt(formData.validityDays);
    const expiresAt = new Date(now.setDate(now.getDate() + daysToAdd)).toISOString();
    
    // Se for edição, mantém a data de criação original
    const createdAt = initialData ? initialData.createdAt : new Date().toISOString();

    const payload = {
      ...formData,
      id: initialData ? initialData.id : Date.now(),
      createdAt,
      expiresAt
    };

    onSuccess(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Título da Vaga</label>
          <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input w-full font-bold" placeholder="Ex: Vendedor Interno"/>
        </div>
        
        <div>
          <label className="label">Empresa</label>
          <input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="input w-full" placeholder="Nome da Empresa"/>
        </div>
        
        <div>
          <label className="label">Regime</label>
          <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="input bg-white w-full">
            <option>CLT</option>
            <option>PJ</option>
            <option>Estágio</option>
            <option>Temporário</option>
            <option>Freelance</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded border">
        <div>
          <label className="label">Área</label>
          <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value, subcategory: ''})} className="input bg-white w-full">
            <option value="">Selecione...</option>
            {Object.keys(JOB_CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Cargo</label>
          <select required value={formData.subcategory} onChange={e => setFormData({...formData, subcategory: e.target.value})} className="input bg-white w-full" disabled={!formData.category}>
            <option value="">Selecione...</option>
            {availableSubcategories?.map(sub => <option key={sub} value={sub}>{sub}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Salário</label>
          <input value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="input w-full" placeholder="Ex: R$ 1.500 ou A combinar"/>
        </div>
        <div>
          <label className="label">Localização</label>
          <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="input w-full" placeholder="Ex: Centro, Home Office"/>
        </div>
      </div>

      <div>
        <label className="label">Descrição da Vaga</label>
        <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input w-full h-24 text-sm" placeholder="Atividades e responsabilidades..."/>
      </div>

      <div>
        <label className="label">Requisitos</label>
        <textarea value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} className="input w-full h-20 text-sm" placeholder="Escolaridade, experiências..."/>
      </div>

      <div>
        <label className="label">Como se candidatar (Contato)</label>
        <input required value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="input w-full border-blue-300 bg-blue-50 font-medium" placeholder="E-mail, WhatsApp ou Link"/>
      </div>

      <div>
        <label className="label">Renovar Validade por:</label>
        <select value={formData.validityDays} onChange={e => setFormData({...formData, validityDays: e.target.value})} className="input bg-white w-full">
          <option value="15">15 Dias</option>
          <option value="30">30 Dias (Padrão)</option>
          <option value="60">60 Dias</option>
        </select>
        <p className="text-[10px] text-slate-500 mt-1">Ao salvar, a data de expiração será recalculada a partir de hoje.</p>
      </div>

      <button className="btn-primary w-full bg-blue-700 hover:bg-blue-800">
        {initialData ? 'Atualizar Vaga' : 'Publicar Vaga'}
      </button>
    </form>
  );
}