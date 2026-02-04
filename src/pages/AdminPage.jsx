import React, { useState } from 'react';
import { Settings, Plus, Star, Trash2, Calendar, FileText, Home, Edit, X, MapPin, Clock, Briefcase, Car, Store } from 'lucide-react';
import { NEWS_CATEGORIES } from '../data/mockData';
import PropertyForm from '../components/PropertyForm'; 
import JobForm from '../components/JobForm';
import VehicleForm from '../components/VehicleForm';
import GuideForm from '../components/GuideForm'; // <--- NOVO IMPORT
import GuideCard from '../components/GuideCard'; // <--- NOVO IMPORT
import Modal from '../components/Modal';

export default function AdminPage({ newsData, eventsData, propertiesData, jobsData, vehiclesData, guideData, crud }) {
  const [activeTab, setActiveTab] = useState('news');
  
  // Estado para Edição (se null, está criando novo)
  const [editingItem, setEditingItem] = useState(null);
  
  // Controles de Modal
  const [isPropModalOpen, setIsPropModalOpen] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false); // <--- NOVO ESTADO

  // --- ESTADOS DO FORMULÁRIO DE NOTÍCIAS/EVENTOS ---
  const [formData, setFormData] = useState({
    title: '', category: '', subcategory: '', image: '', summary: '',
    author: 'Redação Link', date: new Date().toISOString().split('T')[0],
    tags: '', content: [], 
    time: '', location: '', description: ''
  });

  const [contentBlocks, setContentBlocks] = useState([]);

  const resetForm = () => {
    setFormData({
      title: '', category: '', subcategory: '', image: '', summary: '',
      author: 'Redação Link', date: new Date().toISOString().split('T')[0],
      tags: '', content: [], time: '', location: '', description: ''
    });
    setContentBlocks([]);
    setEditingItem(null);
  };

  // Carregar dados para edição
  const handleEdit = (item, type) => {
    setEditingItem(item);
    
    if (type === 'news') {
      setFormData({ ...item });
      if (item.content) setContentBlocks(item.content);
      window.scrollTo(0,0);
    } 
    else if (type === 'event') {
      setFormData({ ...item });
      window.scrollTo(0,0);
    }
    else if (type === 'property') {
      setIsPropModalOpen(true);
    }
    else if (type === 'job') {
      setIsJobModalOpen(true);
    }
    else if (type === 'vehicle') {
      setIsVehicleModalOpen(true);
    }
    else if (type === 'guide') { // <--- EDIÇÃO DO GUIA
      setIsGuideModalOpen(true);
    }
  };

  // --- SUBMITS ---
  
  // Notícias
  const handleNewsSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, content: contentBlocks, id: editingItem ? editingItem.id : Date.now() };
    if (editingItem) crud.updateNews(payload); else crud.addNews(payload);
    alert(editingItem ? "Notícia Atualizada!" : "Notícia Criada!");
    resetForm();
  };
  // Blocos de Notícia
  const addBlock = (type) => setContentBlocks([...contentBlocks, { type, value: '' }]);
  const updateBlock = (index, value) => { const n = [...contentBlocks]; n[index].value = value; setContentBlocks(n); };
  const removeBlock = (index) => { const n = [...contentBlocks]; n.splice(index, 1); setContentBlocks(n); };

  // Eventos
  const handleEventSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, id: editingItem ? editingItem.id : Date.now() };
    if (editingItem) crud.updateEvent(payload); else crud.addEvent(payload);
    alert(editingItem ? "Evento Atualizado!" : "Evento Criado!");
    resetForm();
  };

  // Imóveis
  const handlePropertySubmit = (data) => {
    if (editingItem) crud.updateProperty(data); else crud.addProperty(data);
    setIsPropModalOpen(false);
    resetForm();
    alert("Imóvel Salvo!");
  };

  // Empregos
  const handleJobSubmit = (data) => {
    if (editingItem) crud.updateJob(data); else crud.addJob(data);
    setIsJobModalOpen(false);
    resetForm();
    alert("Vaga Salva!");
  };

  // Veículos
  const handleVehicleSubmit = (data) => {
    if (editingItem) crud.updateVehicle(data); else crud.addVehicle(data);
    setIsVehicleModalOpen(false);
    resetForm();
    alert("Veículo Salvo!");
  };

  // GUIA (NOVO)
  const handleGuideSubmit = (data) => { 
    if (editingItem) crud.updateGuideItem(data); else crud.addGuideItem(data); 
    setIsGuideModalOpen(false); 
    resetForm(); 
    alert("Local Salvo!"); 
  };

  const availableSubcategories = formData.category ? NEWS_CATEGORIES[formData.category] : [];

  return (
    <div className="px-4 md:px-0 pb-12">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <div className="p-2 bg-slate-800 text-white rounded-lg"><Settings size={24}/></div>
        <div><h2 className="text-2xl font-bold text-slate-800">Painel Administrativo</h2><p className="text-sm text-slate-500">Gerenciar conteúdo do portal</p></div>
      </div>

      {/* ABAS DE NAVEGAÇÃO */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'news', label: 'Notícias', icon: FileText, color: 'blue' },
          { id: 'events', label: 'Eventos', icon: Calendar, color: 'purple' },
          { id: 'properties', label: 'Imóveis', icon: Home, color: 'emerald' },
          { id: 'jobs', label: 'Empregos', icon: Briefcase, color: 'orange' },
          { id: 'vehicles', label: 'Veículos', icon: Car, color: 'indigo' },
          { id: 'guide', label: 'Guia', icon: Store, color: 'pink' }, // <--- NOVA ABA
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); resetForm(); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition whitespace-nowrap ${activeTab === tab.id ? `bg-${tab.color}-600 text-white shadow-md` : 'bg-white border text-slate-600 hover:bg-slate-50'}`}
          >
            <tab.icon size={20}/> {tab.label}
          </button>
        ))}
      </div>

      {/* --- ABA NOTÍCIAS --- */}
      {activeTab === 'news' && (
        <div className="grid md:grid-cols-3 gap-8 animate-in fade-in">
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-4 text-blue-800 border-b pb-2">
              {editingItem ? `Editando: ${editingItem.title}` : 'Nova Notícia'}
            </h3>
            {editingItem && <button onClick={resetForm} className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded hover:bg-red-100 mb-4">Cancelar Edição</button>}
            
            <form onSubmit={handleNewsSubmit} className="space-y-4">
              <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input w-full font-bold text-lg" placeholder="Título da Matéria" required/>
              
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded border">
                 <div>
                    <label className="label">Grupo</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value, subcategory: ''})} className="input bg-white" required>
                        <option value="">Selecione...</option>
                        {Object.keys(NEWS_CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="label">Subgrupo</label>
                    <select value={formData.subcategory} onChange={e => setFormData({...formData, subcategory: e.target.value})} className="input bg-white" disabled={!formData.category}>
                        <option value="">Selecione...</option>
                        {availableSubcategories?.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="input"/>
                 <input value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="input" placeholder="Autor"/>
              </div>
              <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="input w-full" placeholder="URL da Imagem de Capa" required/>
              <textarea value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="input w-full h-24" placeholder="Resumo (Lead)"/>
              
              <div className="border-t pt-4">
                <label className="block text-sm font-bold mb-2">Corpo da Matéria</label>
                {contentBlocks.map((block, idx) => (
                  <div key={idx} className="flex gap-2 mb-2 items-start">
                    {block.type === 'paragraph' && <textarea value={block.value} onChange={e => updateBlock(idx, e.target.value)} className="input w-full text-sm" placeholder="Parágrafo" rows={2}/>}
                    {block.type === 'subtitle' && <input value={block.value} onChange={e => updateBlock(idx, e.target.value)} className="input w-full font-bold" placeholder="Subtítulo" />}
                    {block.type === 'image' && <input value={block.value} onChange={e => updateBlock(idx, e.target.value)} className="input w-full" placeholder="URL Imagem" />}
                    <button type="button" onClick={() => removeBlock(idx)} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={() => addBlock('paragraph')} className="px-3 py-1 bg-slate-100 border hover:bg-slate-200 rounded text-xs font-bold">+ Texto</button>
                  <button type="button" onClick={() => addBlock('subtitle')} className="px-3 py-1 bg-slate-100 border hover:bg-slate-200 rounded text-xs font-bold">+ Subtítulo</button>
                  <button type="button" onClick={() => addBlock('image')} className="px-3 py-1 bg-slate-100 border hover:bg-slate-200 rounded text-xs font-bold">+ Imagem</button>
                </div>
              </div>
              <button className="btn-primary w-full bg-blue-600">{editingItem ? 'Salvar Alterações' : 'Publicar Notícia'}</button>
            </form>
          </div>
          <div className="md:col-span-1 bg-white rounded-xl border border-slate-200 p-4 h-fit">
             <h3 className="font-bold mb-4">Gerenciar Publicadas</h3>
             <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {newsData.map(n => (
                  <div key={n.id} className="p-3 rounded border flex justify-between items-center bg-white">
                    <span className="truncate w-32 text-sm font-medium">{n.title}</span>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => handleEdit(n, 'news')} className="text-blue-500 p-1.5 hover:bg-blue-100 rounded"><Edit size={14}/></button>
                      <button onClick={() => crud.deleteNews(n.id)} className="text-red-500 p-1.5 hover:bg-red-100 rounded"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* --- ABA EVENTOS --- */}
      {activeTab === 'events' && (
        <div className="grid md:grid-cols-3 gap-8 animate-in fade-in">
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-4 text-purple-800 border-b pb-2">
              {editingItem ? `Editando: ${editingItem.title}` : 'Novo Evento'}
            </h3>
            {editingItem && <button onClick={resetForm} className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded hover:bg-red-100">Cancelar Edição</button>}

            <form onSubmit={handleEventSubmit} className="space-y-4">
              <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input w-full font-bold text-lg" placeholder="Nome do Evento" required/>
              <div className="grid grid-cols-2 gap-4">
                 <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="input w-full" required/>
                 <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="input w-full" required/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="input w-full" placeholder="Local" required/>
                 <input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input w-full" placeholder="Categoria" required/>
              </div>
              <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="input w-full" placeholder="URL do Cartaz" required/>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input w-full h-24" placeholder="Descrição detalhada" required/>
              <button className="btn-primary w-full bg-purple-600">{editingItem ? 'Salvar Alterações' : 'Agendar Evento'}</button>
            </form>
          </div>
          <div className="md:col-span-1 bg-white rounded-xl border border-slate-200 p-4 h-fit">
             <h3 className="font-bold mb-4">Agenda Atual</h3>
             <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {eventsData.map(e => (
                  <div key={e.id} className="p-3 rounded border flex justify-between items-center bg-white">
                    <span className="truncate w-32 text-sm font-medium">{e.title}</span>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => handleEdit(e, 'event')} className="text-blue-500 p-1.5 hover:bg-blue-100 rounded"><Edit size={14}/></button>
                      <button onClick={() => crud.deleteEvent(e.id)} className="text-red-500 p-1.5 hover:bg-red-100 rounded"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* --- ABA IMÓVEIS --- */}
      {activeTab === 'properties' && (
        <div className="animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-emerald-800">Gerenciar Imóveis</h3>
            <button onClick={() => { resetForm(); setIsPropModalOpen(true); }} className="btn-primary bg-emerald-600 flex items-center gap-2 px-4 py-2">
              <Plus size={18}/> Novo Imóvel
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {propertiesData.map(p => (
              <div key={p.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition">
                <div className="h-32 bg-slate-200 relative">
                  <img src={p.photos[0]} className="w-full h-full object-cover" alt=""/>
                  <span className={`absolute top-2 right-2 px-2 py-1 text-[10px] font-bold rounded uppercase text-white ${p.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {p.status}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-sm truncate text-slate-800">{p.title}</h4>
                  <div className="flex gap-2 border-t pt-2 mt-2">
                    <button onClick={() => handleEdit(p, 'property')} className="flex-1 bg-blue-50 text-blue-600 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1 hover:bg-blue-100">
                      <Edit size={12}/> Editar
                    </button>
                    <button onClick={() => { if(window.confirm('Excluir?')) crud.deleteProperty(p.id) }} className="flex-1 bg-red-50 text-red-600 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1 hover:bg-red-100">
                      <Trash2 size={12}/> Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {propertiesData.length === 0 && <div className="col-span-4 py-12 text-center text-slate-400 border border-dashed rounded-xl">Nenhum imóvel.</div>}
          </div>

          <Modal isOpen={isPropModalOpen} onClose={() => { setIsPropModalOpen(false); resetForm(); }} title={editingItem ? "Editar Imóvel" : "Novo Anúncio"} large>
            <PropertyForm user={{ id: 'admin_master', name: 'Admin' }} onSuccess={handlePropertySubmit} initialData={editingItem} />
          </Modal>
        </div>
      )}

      {/* --- ABA EMPREGOS --- */}
      {activeTab === 'jobs' && (
        <div className="animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-orange-800">Gerenciar Vagas</h3>
            <button onClick={() => { resetForm(); setIsJobModalOpen(true); }} className="btn-primary bg-orange-600 flex items-center gap-2 px-4 py-2">
              <Plus size={18}/> Nova Vaga
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {jobsData.map(j => {
                const daysLeft = Math.ceil((new Date(j.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
                const isExpired = daysLeft < 0;
                return (
                  <div key={j.id} className={`bg-white rounded-lg shadow-sm border p-4 relative ${isExpired ? 'opacity-70 bg-slate-50' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded uppercase">{j.type}</span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${isExpired ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {isExpired ? 'Expirada' : `${daysLeft} dias`}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 truncate" title={j.title}>{j.title}</h4>
                    <p className="text-sm text-slate-500 mb-4">{j.company}</p>
                    <div className="flex gap-2 border-t pt-3">
                      <button onClick={() => handleEdit(j, 'job')} className="flex-1 bg-blue-50 text-blue-600 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1 hover:bg-blue-100">
                        <Edit size={12}/> Editar
                      </button>
                      <button onClick={() => { if(window.confirm('Excluir?')) crud.deleteJob(j.id) }} className="flex-1 bg-red-50 text-red-600 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1 hover:bg-red-100">
                        <Trash2 size={12}/> Excluir
                      </button>
                    </div>
                  </div>
                );
            })}
             {jobsData.length === 0 && <div className="col-span-3 py-12 text-center text-slate-400 border border-dashed rounded-xl">Nenhuma vaga.</div>}
          </div>

          <Modal isOpen={isJobModalOpen} onClose={() => { setIsJobModalOpen(false); resetForm(); }} title={editingItem ? "Editar Vaga" : "Nova Vaga"}>
            <JobForm onSuccess={handleJobSubmit} initialData={editingItem} />
          </Modal>
        </div>
      )}

      {/* --- ABA VEÍCULOS --- */}
      {activeTab === 'vehicles' && (
        <div className="animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-indigo-800">Gerenciar Veículos</h3>
            <button onClick={() => { resetForm(); setIsVehicleModalOpen(true); }} className="btn-primary bg-indigo-600 flex items-center gap-2 px-4 py-2">
              <Plus size={18}/> Novo Veículo
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {vehiclesData.map(v => (
              <div key={v.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition">
                <div className="h-32 bg-slate-200 relative">
                  <img src={v.photos[0]} className="w-full h-full object-cover" alt=""/>
                  <span className={`absolute top-2 right-2 px-2 py-1 text-[10px] font-bold rounded uppercase text-white ${v.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {v.status}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-sm truncate text-slate-800">{v.brand} {v.model}</h4>
                  <p className="text-xs text-slate-500 mb-2 truncate">{v.title}</p>
                  
                  <div className="flex gap-2 border-t pt-2">
                    <button onClick={() => handleEdit(v, 'vehicle')} className="flex-1 bg-blue-50 text-blue-600 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1 hover:bg-blue-100">
                      <Edit size={12}/> Editar
                    </button>
                    <button onClick={() => { if(window.confirm('Excluir?')) crud.deleteVehicle(v.id) }} className="flex-1 bg-red-50 text-red-600 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1 hover:bg-red-100">
                      <Trash2 size={12}/> Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {vehiclesData.length === 0 && <div className="col-span-4 py-12 text-center text-slate-400 border border-dashed rounded-xl">Nenhum veículo.</div>}
          </div>

          <Modal isOpen={isVehicleModalOpen} onClose={() => { setIsVehicleModalOpen(false); resetForm(); }} title={editingItem ? "Editar Veículo" : "Novo Anúncio"} large>
            <VehicleForm user={{ id: 'admin_master', name: 'Admin' }} onSuccess={handleVehicleSubmit} initialData={editingItem} />
          </Modal>
        </div>
      )}

      {/* --- ABA GUIA (NOVO) --- */}
      {activeTab === 'guide' && (
        <div className="animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-pink-800">Gerenciar Guia Comercial</h3>
            <button onClick={() => { resetForm(); setIsGuideModalOpen(true); }} className="btn-primary bg-pink-600 flex items-center gap-2 px-4 py-2">
              <Plus size={18}/> Novo Local
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {guideData.map(item => (
              <div key={item.id} className="h-full">
                <GuideCard 
                  item={item} 
                  isAdmin={true} 
                  onEdit={(i) => handleEdit(i, 'guide')} 
                  onDelete={(id) => { if(window.confirm('Excluir este local?')) crud.deleteGuideItem(id) }} 
                />
              </div>
            ))}
          </div>

          <Modal isOpen={isGuideModalOpen} onClose={() => { setIsGuideModalOpen(false); resetForm(); }} title={editingItem ? "Editar Local" : "Novo Local"}>
            <GuideForm onSuccess={handleGuideSubmit} initialData={editingItem} />
          </Modal>
        </div>
      )}

    </div>
  );
}