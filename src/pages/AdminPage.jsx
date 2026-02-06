import React, { useState } from 'react';
import { Settings, FileText, Calendar, Home, Briefcase, Car, Store, Edit, Trash2, Plus } from 'lucide-react';
import { NEWS_CATEGORIES } from '../data/mockData';
import PropertyForm from '../components/PropertyForm'; 
import JobForm from '../components/JobForm';
import VehicleForm from '../components/VehicleForm';
import GuideForm from '../components/GuideForm'; 
import Modal from '../components/Modal';

export default function AdminPage({ newsData, eventsData, propertiesData, jobsData, vehiclesData, guideData, crud }) {
  const [activeTab, setActiveTab] = useState('news');
  const [editingItem, setEditingItem] = useState(null);
  
  // Controle do Modal
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

  // Componente Auxiliar de Lista
  const AdminList = ({ data, type, labelField, onDelete }) => (
    <div className="space-y-2 max-h-[500px] overflow-y-auto">
      {data.length === 0 && <p className="text-slate-400 text-sm">Nenhum item cadastrado.</p>}
      {data.map(item => (
        <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <span className="font-bold text-slate-700 block">{item[labelField]}</span>
            <span className="text-xs text-slate-400">ID: {item.id}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleEdit(item, type)} className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"><Edit size={16}/></button>
            <button onClick={() => onDelete(item.id)} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"><Trash2 size={16}/></button>
          </div>
        </div>
      ))}
    </div>
  );

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
        
        {/* NOTÍCIAS */}
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
            <div className="lg:col-span-1 border-l pl-4">
              <h3 className="font-bold mb-2 text-sm text-slate-400 uppercase">Cadastrados</h3>
              <AdminList data={newsData} type="news" labelField="title" onDelete={crud.deleteNews} />
            </div>
          </div>
        )}

        {/* EVENTOS */}
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
            <div className="lg:col-span-1 border-l pl-4">
              <h3 className="font-bold mb-2 text-sm text-slate-400 uppercase">Agendados</h3>
              <AdminList data={eventsData} type="event" labelField="title" onDelete={crud.deleteEvent} />
            </div>
          </div>
        )}

        {/* IMÓVEIS (Agora com lista!) */}
        {activeTab === 'properties' && (
          <div>
             <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Gerenciar Imóveis</h3>
              <button onClick={() => setModalType('property')} className="btn-primary py-2 px-4 text-xs bg-emerald-600 flex gap-2 items-center hover:bg-emerald-700 text-white rounded shadow">
                <Plus size={14}/> Novo Imóvel
              </button>
            </div>
            <AdminList data={propertiesData} type="property" labelField="title" onDelete={crud.deleteProperty} />
          </div>
        )}

        {/* VAGAS (Agora com lista!) */}
        {activeTab === 'jobs' && (
          <div>
             <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Gerenciar Vagas</h3>
              <button onClick={() => setModalType('job')} className="btn-primary py-2 px-4 text-xs bg-blue-600 flex gap-2 items-center hover:bg-blue-700 text-white rounded shadow">
                <Plus size={14}/> Nova Vaga
              </button>
            </div>
            <AdminList data={jobsData} type="job" labelField="title" onDelete={crud.deleteJob} />
          </div>
        )}

        {/* VEÍCULOS (Agora com lista!) */}
        {activeTab === 'vehicles' && (
          <div>
             <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Gerenciar Veículos</h3>
              <button onClick={() => setModalType('vehicle')} className="btn-primary py-2 px-4 text-xs bg-orange-600 flex gap-2 items-center hover:bg-orange-700 text-white rounded shadow">
                <Plus size={14}/> Novo Veículo
              </button>
            </div>
            <AdminList data={vehiclesData} type="vehicle" labelField="model" onDelete={crud.deleteVehicle} />
          </div>
        )}

        {/* GUIA (Lista Corrigida) */}
        {activeTab === 'guide' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Gerenciar Guia</h3>
              <button onClick={() => setModalType('guide')} className="btn-primary py-2 px-4 text-xs bg-purple-600 flex gap-2 items-center hover:bg-purple-700 text-white rounded shadow">
                <Plus size={14}/> Novo Local
              </button>
            </div>
            <AdminList data={guideData} type="guide" labelField="name" onDelete={crud.deleteGuideItem} />
          </div>
        )}
      </div>

      {/* MODAIS DO ADMIN */}
      <Modal isOpen={!!modalType} onClose={resetForm} title={`Gerenciar ${modalType === 'property' ? 'Imóvel' : modalType === 'job' ? 'Vaga' : modalType === 'vehicle' ? 'Veículo' : 'Local'}`}>
        {modalType === 'property' && <PropertyForm user={{id:'admin', name:'Admin'}} onSuccess={(d) => { if(editingItem) crud.updateProperty({...d, id: editingItem.id}); else crud.addProperty(d); resetForm(); }} />}
        {modalType === 'job' && <JobForm onSuccess={(d) => { if(editingItem) crud.updateJob({...d, id: editingItem.id}); else crud.addJob(d); resetForm(); }} />}
        {modalType === 'vehicle' && <VehicleForm user={{id:'admin', name:'Admin'}} onSuccess={(d) => { if(editingItem) crud.updateVehicle({...d, id: editingItem.id}); else crud.addVehicle(d); resetForm(); }} />}
        {modalType === 'guide' && <GuideForm initialData={editingItem} onSuccess={(d) => { if(editingItem) crud.updateGuideItem({...d, id: editingItem.id}); else crud.addGuideItem(d); resetForm(); }} />}
      </Modal>

    </div>
  );
}