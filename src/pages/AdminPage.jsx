import React, { useState } from 'react';
import { Settings, FileText, Calendar, Home, Briefcase, Car, Store, Edit, Trash2, Plus } from 'lucide-react';
import { NEWS_CATEGORIES } from '../data/mockData';
import PropertyForm from '../components/PropertyForm'; 
import JobForm from '../components/JobForm';
import VehicleForm from '../components/VehicleForm';
import Modal from '../components/Modal';

// Se você tiver criado GuideForm e GuideCard, descomente as linhas abaixo.
// Se não tiver criado, manteremos comentado para não quebrar o Admin.
import GuideForm from '../components/GuideForm'; 
// import GuideCard from '../components/GuideCard'; 

export default function AdminPage({ newsData, eventsData, propertiesData, jobsData, vehiclesData, guideData, crud }) {
  const [activeTab, setActiveTab] = useState('news');
  const [editingItem, setEditingItem] = useState(null);
  
  // Modais
  const [modalType, setModalType] = useState(null); // 'property', 'job', 'vehicle', 'guide'

  // Form Genérico (Notícias/Eventos)
  const [formData, setFormData] = useState({
    title: '', category: '', subcategory: '', image: '', summary: '',
    author: 'Redação Link', date: new Date().toISOString().split('T')[0],
    time: '', location: '', description: ''
  });

  const resetForm = () => {
    setFormData({
      title: '', category: '', subcategory: '', image: '', summary: '',
      author: 'Redação Link', date: new Date().toISOString().split('T')[0],
      time: '', location: '', description: ''
    });
    setEditingItem(null);
    setModalType(null);
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    if (type === 'news' || type === 'event') {
      setFormData({ ...item });
      window.scrollTo(0,0);
    } else {
      setModalType(type);
    }
  };

  // Submits
  const handleNewsSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, id: editingItem ? editingItem.id : undefined };
    if (editingItem) crud.updateNews(payload); else crud.addNews(payload);
    alert("Salvo!"); resetForm();
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, id: editingItem ? editingItem.id : undefined };
    if (editingItem) crud.updateEvent(payload); else crud.addEvent(payload);
    alert("Salvo!"); resetForm();
  };

  return (
    <div className="pb-12 animate-in fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Settings className="text-slate-900" /> Painel Administrativo
        </h2>
        <p className="text-slate-500 text-sm">Gerencie todo o conteúdo do portal.</p>
      </div>

      {/* Menu de Abas */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        {[
          { id: 'news', label: 'Notícias', icon: FileText },
          { id: 'events', label: 'Eventos', icon: Calendar },
          { id: 'properties', label: 'Imóveis', icon: Home },
          { id: 'jobs', label: 'Vagas', icon: Briefcase },
          { id: 'vehicles', label: 'Veículos', icon: Car },
          { id: 'guide', label: 'Guia', icon: Store },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); resetForm(); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition
              ${activeTab === tab.id ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            <tab.icon size={16}/> {tab.label}
          </button>
        ))}
      </div>

      {/* CONTEÚDO DA ABA */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
        
        {/* --- ABA NOTÍCIAS --- */}
        {activeTab === 'news' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold border-b pb-2">{editingItem ? 'Editar Notícia' : 'Nova Notícia'}</h3>
              <form onSubmit={handleNewsSubmit} className="space-y-3">
                <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input w-full font-bold" placeholder="Título" required/>
                <div className="grid grid-cols-2 gap-3">
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input w-full" required>
                    <option value="">Categoria...</option>
                    {Object.keys(NEWS_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="input w-full"/>
                </div>
                <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="input w-full" placeholder="URL da Imagem" required/>
                <textarea value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="input w-full h-32" placeholder="Texto da notícia..."/>
                <div className="flex gap-2">
                  <button className="btn-primary flex-1 bg-slate-900">Salvar</button>
                  {editingItem && <button type="button" onClick={resetForm} className="btn-primary bg-red-50 text-red-600 hover:bg-red-100">Cancelar</button>}
                </div>
              </form>
            </div>
            <div className="lg:col-span-1 border-l pl-4 h-96 overflow-y-auto">
              <h3 className="font-bold mb-2 text-sm text-slate-400 uppercase">Cadastrados</h3>
              {newsData.map(n => (
                <div key={n.id} className="flex justify-between items-center py-2 border-b text-sm">
                  <span className="truncate w-32">{n.title}</span>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(n, 'news')}><Edit size={14} className="text-blue-600"/></button>
                    <button onClick={() => crud.deleteNews(n.id)}><Trash2 size={14} className="text-red-600"/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ABA GUIA (Correção) --- */}
        {activeTab === 'guide' && (
          <div>
            <div className="flex justify-between mb-4">
              <h3 className="font-bold">Guia Comercial</h3>
              <button onClick={() => setModalType('guide')} className="btn-primary py-2 px-4 text-xs bg-purple-600 flex gap-2 items-center"><Plus size={14}/> Novo</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guideData.map(item => (
                <div key={item.id} className="border p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item, 'guide')} className="p-2 bg-blue-50 rounded text-blue-600"><Edit size={16}/></button>
                    <button onClick={() => crud.deleteGuideItem(item.id)} className="p-2 bg-red-50 rounded text-red-600"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- OUTRAS ABAS (Listagem Simples) --- */}
        {(activeTab === 'properties' || activeTab === 'jobs' || activeTab === 'vehicles') && (
          <div>
             <div className="flex justify-between mb-4">
              <h3 className="font-bold capitalize">{activeTab}</h3>
              <button onClick={() => setModalType(activeTab.slice(0, -1))} className="btn-primary py-2 px-4 text-xs bg-slate-900 flex gap-2 items-center"><Plus size={14}/> Novo</button>
            </div>
            <p className="text-slate-500 text-sm">Use o botão "Novo" acima para cadastrar itens nestas categorias. A listagem completa aparece na página pública.</p>
          </div>
        )}

        {/* --- ABA EVENTOS --- */}
        {activeTab === 'events' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold border-b pb-2">{editingItem ? 'Editar Evento' : 'Novo Evento'}</h3>
              <form onSubmit={handleEventSubmit} className="space-y-3">
                <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input w-full font-bold" placeholder="Nome do Evento" required/>
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="input w-full" required/>
                  <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="input w-full" required/>
                </div>
                <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="input w-full" placeholder="Local" required/>
                <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="input w-full" placeholder="URL da Imagem (Cartaz)" required/>
                <div className="flex gap-2">
                  <button className="btn-primary flex-1 bg-purple-600">Salvar Evento</button>
                  {editingItem && <button type="button" onClick={resetForm} className="btn-primary bg-red-50 text-red-600 hover:bg-red-100">Cancelar</button>}
                </div>
              </form>
            </div>
            <div className="lg:col-span-1 border-l pl-4 h-96 overflow-y-auto">
              <h3 className="font-bold mb-2 text-sm text-slate-400 uppercase">Agendados</h3>
              {eventsData.map(e => (
                <div key={e.id} className="flex justify-between items-center py-2 border-b text-sm">
                  <span className="truncate w-32">{e.title}</span>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(e, 'event')}><Edit size={14} className="text-blue-600"/></button>
                    <button onClick={() => crud.deleteEvent(e.id)}><Trash2 size={14} className="text-red-600"/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MODAIS DO ADMIN */}
      <Modal isOpen={!!modalType} onClose={resetForm} title={`Gerenciar ${modalType}`}>
        {modalType === 'property' && <PropertyForm user={{id:'admin', name:'Admin'}} onSuccess={(d) => { if(editingItem) crud.updateProperty({...d, id: editingItem.id}); else crud.addProperty(d); resetForm(); }} />}
        {modalType === 'job' && <JobForm onSuccess={(d) => { if(editingItem) crud.updateJob({...d, id: editingItem.id}); else crud.addJob(d); resetForm(); }} />}
        {modalType === 'vehicle' && <VehicleForm user={{id:'admin', name:'Admin'}} onSuccess={(d) => { if(editingItem) crud.updateVehicle({...d, id: editingItem.id}); else crud.addVehicle(d); resetForm(); }} />}
        {modalType === 'guide' && <GuideForm initialData={editingItem} onSuccess={(d) => { if(editingItem) crud.updateGuideItem({...d, id: editingItem.id}); else crud.addGuideItem(d); resetForm(); }} />}
      </Modal>

    </div>
  );
}