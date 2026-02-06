import React, { useState } from 'react';
import { Settings, FileText, Calendar, Home, Briefcase, Car, Store, Edit, Trash2, Plus, Loader, UploadCloud } from 'lucide-react';
import { NEWS_CATEGORIES } from '../data/mockData';
import PropertyForm from '../components/PropertyForm'; 
import JobForm from '../components/JobForm';
import VehicleForm from '../components/VehicleForm';
import GuideForm from '../components/GuideForm'; 
import Modal from '../components/Modal';
import { uploadFile } from '../utils/uploadHelper';

export default function AdminPage({ newsData, eventsData, propertiesData, jobsData, vehiclesData, guideData, crud }) {
  const [activeTab, setActiveTab] = useState('news');
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- ESTADOS COMPARTILHADOS DOS FORMS (Notícias e Eventos) ---
  const [imageSource, setImageSource] = useState('url'); // 'url' ou 'upload'
  const [selectedFile, setSelectedFile] = useState(null); 
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
    setSelectedFile(null);
    setImageSource('url');
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    if (type === 'news' || type === 'event') {
      setFormData({ ...item });
      setImageSource('url'); // Na edição, assume URL inicialmente
      window.scrollTo(0,0);
    } else {
      setModalType(type);
    }
  };

  // --- SUBMIT DE NOTÍCIAS ---
  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let finalImageUrl = formData.image;

    if (imageSource === 'upload' && selectedFile) {
      try {
        finalImageUrl = await uploadFile(selectedFile, 'news');
      } catch (error) {
        alert("Erro ao fazer upload da imagem.");
        setLoading(false);
        return;
      }
    }

    const payload = { ...formData, image: finalImageUrl, id: editingItem ? editingItem.id : undefined };
    if (editingItem) crud.updateNews(payload); else crud.addNews(payload);
    
    setLoading(false);
    alert("Notícia salva!"); resetForm();
  };

  // --- SUBMIT DE EVENTOS (ATUALIZADO COM UPLOAD) ---
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let finalImageUrl = formData.image;

    // Lógica de Upload para Eventos
    if (imageSource === 'upload' && selectedFile) {
      try {
        finalImageUrl = await uploadFile(selectedFile, 'events'); // Pasta 'events'
      } catch (error) {
        alert("Erro ao fazer upload da imagem do evento.");
        setLoading(false);
        return;
      }
    }

    const payload = { ...formData, image: finalImageUrl, id: editingItem ? editingItem.id : undefined };
    if (editingItem) crud.updateEvent(payload); else crud.addEvent(payload);
    
    setLoading(false);
    alert("Evento salvo!"); resetForm();
  };

  // Componente Auxiliar de Lista
  const AdminList = ({ data, type, labelField, onDelete }) => (
    <div className="space-y-2 max-h-[500px] overflow-y-auto">
      {data.length === 0 && <p className="text-slate-400 text-sm">Nenhum item cadastrado.</p>}
      {data.map(item => (
        <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <span className="font-bold text-slate-700 block line-clamp-1">{item[labelField]}</span>
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
      </div>

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

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
        
        {/* --- ABA NOTÍCIAS --- */}
        {activeTab === 'news' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold border-b pb-2">{editingItem ? 'Editar Notícia' : 'Nova Notícia'}</h3>
              <form onSubmit={handleNewsSubmit} className="space-y-4">
                <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input w-full font-bold" placeholder="Título" required/>
                
                <div className="grid grid-cols-2 gap-3">
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input w-full" required>
                    <option value="">Categoria...</option>
                    {Object.keys(NEWS_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="input w-full"/>
                </div>

                {/* IMAGEM NOTÍCIA */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Imagem da Capa</label>
                  <div className="flex gap-4 mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={imageSource === 'url'} onChange={() => setImageSource('url')} /> Link da Web
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={imageSource === 'upload'} onChange={() => setImageSource('upload')} /> Upload
                    </label>
                  </div>

                  {imageSource === 'url' ? (
                    <input 
                      value={formData.image} 
                      onChange={e => setFormData({...formData, image: e.target.value})} 
                      className="input w-full bg-white" 
                      placeholder="https://..." 
                      required={!editingItem}
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-700"
                        required={!formData.image}
                      />
                      {selectedFile && <span className="text-xs text-green-600 font-bold">Ok!</span>}
                    </div>
                  )}
                </div>

                <textarea value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="input w-full h-32" placeholder="Texto da notícia..."/>
                
                <div className="flex gap-2">
                  <button disabled={loading} className="btn-primary flex-1 bg-slate-900 flex items-center justify-center gap-2">
                    {loading ? <Loader className="animate-spin" /> : "Salvar Notícia"}
                  </button>
                  {editingItem && <button type="button" onClick={resetForm} className="btn-primary bg-red-50 text-red-600 hover:bg-red-100">Cancelar</button>}
                </div>
              </form>
            </div>
            <div className="lg:col-span-1 border-l pl-4">
              <AdminList data={newsData} type="news" labelField="title" onDelete={crud.deleteNews} />
            </div>
          </div>
        )}

        {/* --- ABA EVENTOS (AGORA COM UPLOAD) --- */}
        {activeTab === 'events' && (
           <div className="grid lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold border-b pb-2">{editingItem ? 'Editar Evento' : 'Novo Evento'}</h3>
              <form onSubmit={handleEventSubmit} className="space-y-4">
                <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input w-full font-bold" placeholder="Nome do Evento" required/>
                
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="input w-full" required/>
                  <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="input w-full" required/>
                </div>
                <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="input w-full" placeholder="Local" required/>
                
                {/* IMAGEM EVENTO */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Cartaz / Imagem</label>
                  <div className="flex gap-4 mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={imageSource === 'url'} onChange={() => setImageSource('url')} /> Link da Web
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={imageSource === 'upload'} onChange={() => setImageSource('upload')} /> Upload
                    </label>
                  </div>

                  {imageSource === 'url' ? (
                    <input 
                      value={formData.image} 
                      onChange={e => setFormData({...formData, image: e.target.value})} 
                      className="input w-full bg-white" 
                      placeholder="https://..." 
                      required={!editingItem}
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                        required={!formData.image}
                      />
                      {selectedFile && <span className="text-xs text-green-600 font-bold">Ok!</span>}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button disabled={loading} className="btn-primary flex-1 bg-purple-600 flex items-center justify-center gap-2">
                    {loading ? <Loader className="animate-spin" /> : "Salvar Evento"}
                  </button>
                  {editingItem && <button type="button" onClick={resetForm} className="btn-primary bg-red-50 text-red-600 hover:bg-red-100">Cancelar</button>}
                </div>
              </form>
            </div>
            <div className="lg:col-span-1 border-l pl-4">
              <AdminList data={eventsData} type="event" labelField="title" onDelete={crud.deleteEvent} />
            </div>
           </div>
        )}

        {/* --- DEMAIS ABAS (LISTAS) --- */}
        {(activeTab === 'properties' || activeTab === 'jobs' || activeTab === 'vehicles' || activeTab === 'guide') && (
           <div>
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-lg capitalize">Gerenciar {activeTab}</h3>
               <button onClick={() => setModalType(activeTab === 'guide' ? 'guide' : activeTab.slice(0, -1))} className="btn-primary py-2 px-4 text-xs bg-slate-900 flex gap-2 items-center text-white"><Plus size={14}/> Novo</button>
             </div>
             <AdminList 
               data={activeTab === 'properties' ? propertiesData : activeTab === 'jobs' ? jobsData : activeTab === 'vehicles' ? vehiclesData : guideData} 
               type={activeTab === 'properties' ? 'property' : activeTab === 'jobs' ? 'job' : activeTab === 'vehicles' ? 'vehicle' : 'guide'} 
               labelField={activeTab === 'vehicles' ? 'model' : activeTab === 'guide' ? 'name' : 'title'} 
               onDelete={activeTab === 'properties' ? crud.deleteProperty : activeTab === 'jobs' ? crud.deleteJob : activeTab === 'vehicles' ? crud.deleteVehicle : crud.deleteGuideItem} 
             />
           </div>
        )}
      </div>

      <Modal isOpen={!!modalType} onClose={resetForm} title={`Gerenciar ${modalType}`}>
        {modalType === 'property' && <PropertyForm user={{id:'admin', name:'Admin'}} onSuccess={(d) => { if(editingItem) crud.updateProperty({...d, id: editingItem.id}); else crud.addProperty(d); resetForm(); }} />}
        {modalType === 'job' && <JobForm onSuccess={(d) => { if(editingItem) crud.updateJob({...d, id: editingItem.id}); else crud.addJob(d); resetForm(); }} />}
        {modalType === 'vehicle' && <VehicleForm user={{id:'admin', name:'Admin'}} onSuccess={(d) => { if(editingItem) crud.updateVehicle({...d, id: editingItem.id}); else crud.addVehicle(d); resetForm(); }} />}
        {modalType === 'guide' && <GuideForm initialData={editingItem} onSuccess={(d) => { if(editingItem) crud.updateGuideItem({...d, id: editingItem.id}); else crud.addGuideItem(d); resetForm(); }} />}
      </Modal>

    </div>
  );
}