import React, { useState } from 'react';
import { Trash2, PlusCircle, ArrowUp, ArrowDown, Image as ImageIcon, Type, Heading, Upload, Clock, CheckCircle, XCircle, Edit } from 'lucide-react';
import VehicleForm from '../components/VehicleForm'; 

export default function AdminPage({ newsData, eventsData, propertiesData, jobsData, vehiclesData, guideData, adsData, offersData, crud }) {
  const [activeTab, setActiveTab] = useState('offers');
  const [modalOpen, setModalOpen] = useState(false);
  
  const [editingItem, setEditingItem] = useState(null);
  const [newsBlocks, setNewsBlocks] = useState([]);

  // ==========================================
  // FUNÇÃO DE IMPORTAÇÃO DE CSV (GUIA)
  // ==========================================
  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const buffer = event.target.result;
      let text = new TextDecoder('utf-8').decode(buffer);
      if (text.includes('')) text = new TextDecoder('windows-1252').decode(buffer);
      text = text.replace(/^\uFEFF/, '');
      const lines = text.split(/\r?\n/);
      if (lines.length < 2) return alert("Arquivo CSV vazio ou sem dados suficientes.");
      const separator = lines[0].includes(';') ? ';' : ',';
      const headers = lines[0].toLowerCase().split(separator).map(h => h.trim().replace(/^"|"$/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
      const validCategories = ["Saúde & Bem-estar", "Emergência & Serviços Públicos", "Educação & Ensino", "Supermercados & Alimentação", "Automotivo & Transportes", "Construção & Casa", "Bancos & Financeiro", "Hotéis & Pousadas", "Religião & Igrejas", "Esportes & Academias", "Beleza & Estética", "Outros"];

      const findCategory = (inputCat) => {
        if (!inputCat) return "Outros";
        const cleanInput = inputCat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        for (const validCat of validCategories) {
           const cleanValid = validCat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
           if (cleanValid === cleanInput) return validCat;
        }
        if (cleanInput.includes("saude") || cleanInput.includes("bem")) return "Saúde & Bem-estar";
        if (cleanInput.includes("emergencia") || cleanInput.includes("public")) return "Emergência & Serviços Públicos";
        if (cleanInput.includes("educa") || cleanInput.includes("ensin") || cleanInput.includes("escola")) return "Educação & Ensino";
        if (cleanInput.includes("supermercado") || cleanInput.includes("aliment") || cleanInput.includes("restaurante")) return "Supermercados & Alimentação";
        if (cleanInput.includes("auto") || cleanInput.includes("transporte") || cleanInput.includes("veiculo") || cleanInput.includes("carro") || cleanInput.includes("oficina")) return "Automotivo & Transportes";
        if (cleanInput.includes("constru") || cleanInput.includes("casa") || cleanInput.includes("material") || cleanInput.includes("deposito")) return "Construção & Casa";
        if (cleanInput.includes("banco") || cleanInput.includes("financeiro") || cleanInput.includes("dinheiro") || cleanInput.includes("loterica")) return "Bancos & Financeiro";
        if (cleanInput.includes("hotel") || cleanInput.includes("pousada")) return "Hotéis & Pousadas";
        if (cleanInput.includes("religi") || cleanInput.includes("igreja") || cleanInput.includes("paroquia")) return "Religião & Igrejas";
        if (cleanInput.includes("esporte") || cleanInput.includes("academia") || cleanInput.includes("fit")) return "Esportes & Academias";
        if (cleanInput.includes("beleza") || cleanInput.includes("estetica") || cleanInput.includes("salao") || cleanInput.includes("cabel")) return "Beleza & Estética";
        return "Outros";
      };

      const newItems = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const regex = new RegExp(`\\s*${separator}\\s*(?=(?:[^"]*"[^"]*")*[^"]*$)`);
        const values = line.split(regex).map(v => v.replace(/^"|"$/g, '').trim());
        let item = { date: new Date().toISOString() };
        headers.forEach((h, index) => {
           const val = values[index] || '';
           if (h.includes('categoria')) item.category = findCategory(val);
           else if (h.includes('nome')) item.name = val;
           else if (h.includes('telefone') || h.includes('celular')) item.phone = val;
           else if (h.includes('endere') || h.includes('local')) item.address = val;
           else if (h.includes('imagem') || h.includes('link') || h.includes('foto')) item.image = val;
        });

        if (!item.name && values.length >= 2) {
           item = { category: findCategory(values[0]), name: values[1], phone: values[2] || '', address: values[3] || '', image: values[4] || '', date: new Date().toISOString() };
        }
        if (item.name) {
           if (!item.category) item.category = 'Outros';
           newItems.push(item);
        }
      }

      if (newItems.length === 0) return alert("Nenhum local válido encontrado no CSV.");
      if (window.confirm(`Foram encontrados ${newItems.length} locais.\nDeseja iniciar a importação?`)) {
         try {
           for (const item of newItems) { await crud.addGuideItem({...item, status: 'active'}); }
           alert("Importação concluída com sucesso! Verifique o Guia Comercial.");
         } catch(err) { alert("Ocorreu um erro durante a importação."); }
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = null;
  };

  // ==========================================
  // FUNÇÕES AUXILIARES DE FORMULÁRIO E MODAL
  // ==========================================
  const handleLocalImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const openEditModal = (item = {}) => {
    if (activeTab === 'news') setNewsBlocks(item.content || []);
    const imageValue = item.image || (item.photos && item.photos.length > 0 ? item.photos[0] : '') || '';
    const photosValue = item.photos || (item.image ? [item.image] : []);
    setEditingItem({ ...item, image: imageValue, photos: photosValue });
    setModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let payload = { ...editingItem };
    
    // Tratamentos específicos antes de salvar
    if (activeTab === 'news') payload.content = newsBlocks;
    if (activeTab === 'real_estate') {
      payload.photos = payload.image ? [payload.image] : [];
    }

    if (payload.id) {
      // ATUALIZAR (EDITAR)
      if (activeTab === 'offers') crud.updateOffer(payload);
      if (activeTab === 'ads') crud.updateAd(payload); // <--- ATUALIZA A PUBLICIDADE
      if (activeTab === 'news') crud.updateNews(payload);
      if (activeTab === 'events') crud.updateEvent(payload);
      if (activeTab === 'real_estate') crud.updateProperty(payload);
      if (activeTab === 'jobs') crud.updateJob(payload);
      if (activeTab === 'guide') crud.updateGuideItem(payload);
    } else {
      // ADICIONAR NOVO
      payload.date = payload.date || new Date().toISOString();
      if (activeTab === 'offers') crud.addOffer(payload);
      if (activeTab === 'ads') crud.addAd({...payload, status: 'active', createdAt: new Date().toISOString()}); // <--- ADICIONA NOVA PUBLICIDADE
      if (activeTab === 'news') crud.addNews(payload);
      if (activeTab === 'events') crud.addEvent(payload);
      if (activeTab === 'real_estate') crud.addProperty({...payload, status: 'active', createdAt: new Date().toISOString()});
      if (activeTab === 'jobs') crud.addJob({...payload, createdAt: new Date().toISOString()});
      if (activeTab === 'guide') crud.addGuideItem({...payload, status: 'active'});
    }
    
    setModalOpen(false);
    setEditingItem(null);
    setNewsBlocks([]);
  };

  // Componentes Inteligentes para o Formulário Genérico
  const FormField = ({ label, field, type="text", required=false, options, placeholder }) => {
    const val = editingItem?.[field] || '';
    const onChange = e => setEditingItem({...editingItem, [field]: e.target.value});
    return (
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
        {type === 'select' ? (
          <select value={val} onChange={onChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" required={required}>
            <option value="">Selecione...</option>
            {options?.map(opt => <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>)}
          </select>
        ) : type === 'textarea' ? (
          <textarea value={val} onChange={onChange} placeholder={placeholder} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" rows="3" required={required}/>
        ) : (
          <input type={type} value={val} onChange={onChange} placeholder={placeholder} step={type === 'number' ? '0.01' : undefined} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" required={required}/>
        )}
      </div>
    );
  };

  const ImageField = ({ label="Imagem (URL ou Upload)", field="image", required=false }) => {
    const val = editingItem?.[field] || '';
    const onChange = e => setEditingItem({...editingItem, [field]: e.target.value});
    return (
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
        <div className="flex gap-2">
          <input value={val} onChange={onChange} className="flex-1 p-3 bg-white border border-slate-200 rounded-lg focus:border-indigo-600 outline-none" placeholder="Link da imagem..." required={required}/>
          <label className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-3 rounded-lg cursor-pointer flex items-center justify-center transition-colors">
            <Upload size={20} />
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLocalImageUpload(e, (base64) => setEditingItem({...editingItem, [field]: base64}))} />
          </label>
        </div>
        {val && <img src={val} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-lg border border-slate-200"/>}
      </div>
    );
  };

  // Renderizador de Listas Universal
  const renderList = (data, titleField, deleteFunc) => (
    <div className="space-y-3 mt-4">
      {data && data.length > 0 ? data.map(item => (
        <div key={item.id} className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col">
             <span className="font-bold text-slate-800">{item[titleField] || item.title || item.name || 'Item sem título'}</span>
             {item.category && <span className="text-[10px] text-indigo-600 font-bold uppercase">{item.category}</span>}
          </div>
          <div className="flex gap-2">
            <button onClick={() => openEditModal(item)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors" title="Editar">
              <Edit size={18} />
            </button>
            <button onClick={() => { if(window.confirm('Tem certeza que deseja excluir?')) deleteFunc(item.id); }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Excluir">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      )) : <p className="text-slate-500 text-center py-8">Nenhum item cadastrado nesta categoria.</p>}
    </div>
  );

  const addNewsBlock = (type) => setNewsBlocks([...newsBlocks, { id: Date.now(), type, value: '' }]);
  const updateNewsBlock = (id, newValue) => setNewsBlocks(newsBlocks.map(block => block.id === id ? { ...block, value: newValue } : block));
  const removeNewsBlock = (id) => setNewsBlocks(newsBlocks.filter(block => block.id !== id));
  const moveNewsBlock = (index, direction) => {
    const newBlocks = [...newsBlocks];
    if (direction === 'up' && index > 0) [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
    else if (direction === 'down' && index < newBlocks.length - 1) [newBlocks[index + 1], newBlocks[index]] = [newBlocks[index], newBlocks[index + 1]];
    setNewsBlocks(newBlocks);
  };

  const pendingGuideItems = guideData?.filter(i => i.status === 'pending') || [];
  const activeGuideItems = guideData?.filter(i => i.status !== 'pending') || [];

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
      
      {/* MENU DE ABAS */}
      <div className="flex overflow-x-auto bg-slate-50 border-b border-slate-200 scrollbar-hide">
        {[
          { id: 'offers', label: 'Shopping / Ofertas' },
          { id: 'ads', label: 'Publicidade (Banners)' }, // <--- ABA NOVA AQUI
          { id: 'news', label: 'Notícias' },
          { id: 'events', label: 'Eventos' },
          { id: 'real_estate', label: 'Imóveis' },
          { id: 'jobs', label: 'Vagas' },
          { id: 'vehicles', label: 'Veículos' },
          { id: 'guide', label: pendingGuideItems.length > 0 ? `Guia Comercial (${pendingGuideItems.length})` : 'Guia Comercial' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors relative ${activeTab === tab.id ? 'border-b-2 border-indigo-600 text-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
          >
            {tab.label}
            {tab.id === 'guide' && pendingGuideItems.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
          </button>
        ))}
      </div>

      <div className="p-6">
        
        {/* === ABA DO GUIA COMERCIAL === */}
        {activeTab === 'guide' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-black text-slate-800">Gerenciar Guia Comercial</h2>
              <div className="flex gap-2 w-full md:w-auto">
                <button onClick={() => openEditModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 w-full md:w-auto">
                  <PlusCircle size={18}/> Novo Local
                </button>
                <label className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition cursor-pointer shadow-sm w-full md:w-auto">
                  <Upload size={18}/> Importar CSV
                  <input type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
                </label>
              </div>
            </div>

            {pendingGuideItems.length > 0 && (
              <div className="mb-10 bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2"><Clock size={20}/> Solicitações Aguardando Aprovação</h3>
                <div className="space-y-3">
                  {pendingGuideItems.map(item => (
                     <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white border border-amber-200 shadow-sm rounded-xl gap-4">
                        <div className="flex items-center gap-4 flex-1">
                           {item.image && <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"/>}
                           <div>
                             <span className="font-bold text-slate-800 block text-lg leading-tight mb-1">{item.name}</span>
                             <span className="inline-block bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1">{item.category}</span>
                             <p className="text-xs text-slate-500 font-medium">{item.phone} • {item.address}</p>
                           </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0 flex-wrap">
                           <button onClick={() => openEditModal(item)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-sm"><Edit size={18}/> Editar</button>
                           <button onClick={() => { if(window.confirm('Aprovar este local?')) crud.updateGuideItem({...item, status: 'active'}); }} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-sm"><CheckCircle size={18}/> Aprovar</button>
                           <button onClick={() => { if(window.confirm('Recusar e apagar este envio?')) crud.deleteGuideItem(item.id); }} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-sm"><XCircle size={18}/> Recusar</button>
                        </div>
                     </div>
                  ))}
                </div>
              </div>
            )}
            
            <h3 className="font-bold text-slate-600 mb-2 uppercase text-xs tracking-wider">Locais Já Publicados</h3>
            {renderList(activeGuideItems, 'name', crud.deleteGuideItem)}
          </div>
        )}

        {/* === ABA DE OFERTAS === */}
        {activeTab === 'offers' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-black text-slate-800">Gerenciar Banco de Ofertas</h2>
              <button onClick={() => openEditModal({ category: 'bestsellers' })} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 w-full md:w-auto justify-center">
                <PlusCircle size={18}/> Adicionar Oferta
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {offersData?.map(item => (
                <div key={item.id} className="flex gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50 relative group hover:border-indigo-200 transition-colors">
                  <img src={item.image} alt="Produto" className="w-20 h-20 object-contain bg-white rounded-lg border border-slate-200 p-1"/>
                  <div className="flex-1 min-w-0 pr-20">
                    <h3 className="font-bold text-slate-800 text-sm line-clamp-2" title={item.title}>{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">{item.category}</p>
                    <p className="text-sm font-black text-indigo-600 mt-1">{Number(item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => openEditModal(item)} className="p-2 bg-white text-indigo-600 hover:bg-indigo-50 rounded-lg shadow-sm border border-slate-200 transition-colors" title="Editar"><Edit size={18}/></button>
                    <button onClick={() => { if(window.confirm('Excluir oferta?')) crud.deleteOffer(item.id); }} className="p-2 bg-white text-red-600 hover:bg-red-50 rounded-lg shadow-sm border border-slate-200 transition-colors" title="Excluir"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === ABA DE PUBLICIDADE === */}
        {activeTab === 'ads' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-black text-slate-800">Gerenciar Publicidade (Banners)</h2>
              <button onClick={() => openEditModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 w-full md:w-auto justify-center">
                <PlusCircle size={18}/> Adicionar Banner
              </button>
            </div>
            {renderList(adsData, 'title', crud.deleteAd)}
          </div>
        )}

        {/* === ABA DE NOTÍCIAS === */}
        {activeTab === 'news' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-black text-slate-800">Gerenciar Notícias</h2>
              <button onClick={() => openEditModal({ isOfficial: false, author: 'Redação', category: 'Cidade' })} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 w-full md:w-auto justify-center">
                <PlusCircle size={18}/> Nova Notícia
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {newsData?.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50 relative group hover:border-indigo-200 transition-colors">
                  {item.image && <img src={item.image} alt="Capa" className="w-full sm:w-32 h-24 object-cover bg-white rounded-lg border border-slate-200"/>}
                  <div className="flex-1 min-w-0 pr-20">
                    <h3 className="font-bold text-slate-800 text-base line-clamp-2" title={item.title}>{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{item.author} • {item.date ? new Date(item.date).toLocaleDateString('pt-BR') : 'Sem data'}</p>
                    {item.isOfficial && <span className="inline-block mt-2 bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-1 rounded-md text-xs font-bold">Oficial</span>}
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => openEditModal(item)} className="p-2 bg-white text-indigo-600 hover:bg-indigo-50 rounded-lg shadow-sm border border-slate-200 transition-colors"><Edit size={18}/></button>
                    <button onClick={() => { if(window.confirm('Excluir notícia?')) crud.deleteNews(item.id); }} className="p-2 bg-white text-red-600 hover:bg-red-50 rounded-lg shadow-sm border border-slate-200 transition-colors"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OUTRAS ABAS COM BOTÃO ADICIONAR */}
        {activeTab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-black text-slate-800">Gerenciar Eventos</h2><button onClick={() => openEditModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700"><PlusCircle size={18}/> Novo</button></div>
            {renderList(eventsData, 'title', crud.deleteEvent)}
          </div>
        )}
        {activeTab === 'real_estate' && (
           <div>
             <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-black text-slate-800">Gerenciar Imóveis</h2><button onClick={() => openEditModal({type: 'Venda'})} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700"><PlusCircle size={18}/> Novo</button></div>
             {renderList(propertiesData, 'title', crud.deleteProperty)}
           </div>
        )}
        {activeTab === 'jobs' && (
           <div>
             <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-black text-slate-800">Gerenciar Vagas</h2><button onClick={() => openEditModal({type: 'CLT'})} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700"><PlusCircle size={18}/> Nova Vaga</button></div>
             {renderList(jobsData, 'title', crud.deleteJob)}
           </div>
        )}
        {activeTab === 'vehicles' && (
           <div>
             <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-black text-slate-800">Gerenciar Veículos</h2><button onClick={() => openEditModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700"><PlusCircle size={18}/> Novo</button></div>
             {renderList(vehiclesData, 'title', crud.deleteVehicle)}
           </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL DE CADASTRO E EDIÇÃO */}
      {/* ======================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <h2 className="text-2xl font-black text-slate-800 mb-6 border-b border-slate-100 pb-4">
              {editingItem?.id ? 'Editar Informações' : 'Novo Cadastro'}
            </h2>
            
            {/* SE A ABA FOR VEÍCULOS, RENDERIZA O NOSSO FORMULÁRIO AVANÇADO */}
            {activeTab === 'vehicles' ? (
              <div className="mt-4">
                <VehicleForm 
                  user={{ id: 'admin', name: 'Administrador', email: 'admin@linkdacidade.com', phone: '', role: 'admin' }} 
                  initialData={editingItem} 
                  onSuccess={(formData) => {
                    if (editingItem && editingItem.id) {
                      crud.updateVehicle(formData);
                    } else {
                      crud.addVehicle(formData);
                    }
                    setModalOpen(false);
                    setEditingItem(null);
                  }} 
                />
                <button onClick={() => setModalOpen(false)} className="w-full mt-3 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                  Cancelar e Voltar
                </button>
              </div>
            ) : (
              /* PARA AS OUTRAS ABAS, USA O FORMULÁRIO GENÉRICO */
              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                {/* FORMULÁRIO DE PUBLICIDADE (NOVO) */}
                {activeTab === 'ads' && (
                  <>
                    <FormField label="Título da Campanha (Empresa/Anunciante)" field="title" placeholder="Ex: Ótica Visual" required/>
                    <FormField label="Link de Destino" field="link" placeholder="Para onde vai ao clicar? (ex: WhatsApp, Instagram)" required/>
                    <ImageField label="Banner (Imagem formato horizontal recomendada)" required/>
                  </>
                )}

                {/* FORMULÁRIO DE OFERTAS */}
                {activeTab === 'offers' && (
                  <>
                    <FormField label="Categoria (Subgrupo)" field="category" type="select" options={[
                      {value: 'bestsellers', label: 'Ofertas do dia'}, {value: 'celulares', label: 'Celulares'}, {value: 'tvs', label: 'TVs'}, {value: 'informatica', label: 'Informática'}
                    ]} required/>
                    <FormField label="Título" field="title" required/>
                    <div className="grid grid-cols-2 gap-4">
                       <FormField label="Preço Atual" field="price" type="number" required/>
                       <FormField label="Preço Antigo" field="originalPrice" type="number"/>
                    </div>
                    <ImageField />
                    <FormField label="Link de Afiliado" field="link" required/>
                  </>
                )}

                {/* FORMULÁRIO DE EVENTOS */}
                {activeTab === 'events' && (
                  <>
                    <FormField label="Título do Evento" field="title" required/>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField label="Data" field="date" type="date" required/>
                      <FormField label="Hora" field="time" type="time" required/>
                      <FormField label="Categoria" field="category" required/>
                    </div>
                    <FormField label="Local do Evento" field="location" required/>
                    <ImageField />
                    <FormField label="Descrição" field="description" type="textarea"/>
                    <FormField label="Link para Ingressos (Opcional)" field="link" />
                  </>
                )}

                {/* FORMULÁRIO DE IMÓVEIS */}
                {activeTab === 'real_estate' && (
                  <>
                    <FormField label="Título do Anúncio" field="title" required/>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Tipo de Negócio" field="type" type="select" options={['Venda', 'Aluguel']} required/>
                      <FormField label="Preço (R$)" field="price" type="number" required/>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <FormField label="Quartos" field="bedrooms" type="number"/>
                      <FormField label="Banheiros" field="bathrooms" type="number"/>
                      <FormField label="Vagas" field="garage" type="number"/>
                      <FormField label="Área (m²)" field="area" type="number"/>
                    </div>
                    <FormField label="Endereço (Bairro / Rua)" field="address" required/>
                    <ImageField label="Foto Principal (Capa)"/>
                  </>
                )}

                {/* FORMULÁRIO DE VAGAS */}
                {activeTab === 'jobs' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Cargo / Título" field="title" required/>
                      <FormField label="Empresa" field="company" required/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Categoria" field="category" type="select" options={["Comércio & Vendas", "Alimentação & Gastronomia", "Administrativo & Financeiro", "Serviços Gerais & Manutenção", "Saúde & Cuidados", "Indústria & Logística", "Educação", "Tecnologia & Marketing"]} required/>
                      <FormField label="Tipo de Vaga" field="type" type="select" options={['CLT', 'Estágio', 'PJ', 'Temporário']} required/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Salário" field="salary" placeholder="Ex: R$ 1.500,00 ou A combinar"/>
                      <FormField label="Localização / Bairro" field="location" required/>
                    </div>
                    <FormField label="Descrição da Vaga" field="description" type="textarea" required/>
                    <FormField label="Requisitos" field="requirements" type="textarea"/>
                    <FormField label="Contato para Envio de Currículo" field="contact" required placeholder="E-mail ou WhatsApp"/>
                  </>
                )}

                {/* FORMULÁRIO DO GUIA COMERCIAL */}
                {activeTab === 'guide' && (
                  <>
                    <FormField label="Nome do Estabelecimento" field="name" required/>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Categoria" field="category" type="select" options={["Saúde & Bem-estar", "Emergência & Serviços Públicos", "Educação & Ensino", "Supermercados & Alimentação", "Automotivo & Transportes", "Construção & Casa", "Bancos & Financeiro", "Hotéis & Pousadas", "Religião & Igrejas", "Esportes & Academias", "Beleza & Estética", "Outros"]} required/>
                      <FormField label="Telefone / Celular" field="phone"/>
                    </div>
                    <FormField label="Endereço Completo" field="address"/>
                    <FormField label="Breve Descrição (Opcional)" field="description" type="textarea"/>
                    <ImageField label="Logotipo ou Foto da Fachada"/>
                  </>
                )}

                {/* FORMULÁRIO DE NOTÍCIAS (LEGO BUILDER ESPECIAL) */}
                {activeTab === 'news' && (
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-4">
                      <h3 className="font-bold text-slate-700 border-b border-slate-200 pb-2">Cabeçalho da Matéria</h3>
                      <FormField label="Título Principal" field="title" required/>
                      <FormField label="Linha Fina (Resumo itálico)" field="summary" type="textarea" required/>
                      <ImageField label="Imagem de Capa"/>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField label="Categoria" field="category" required/>
                        <FormField label="Autor / Fonte" field="author" required/>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-700 mb-3">Corpo da Matéria</h3>
                      <div className="space-y-4 mb-4">
                        {newsBlocks.map((block, index) => (
                          <div key={block.id} className="flex gap-2 items-start bg-slate-50 p-3 border border-slate-200 rounded-xl">
                            <div className="flex flex-col gap-1 mt-1">
                              <button type="button" onClick={() => moveNewsBlock(index, 'up')} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700"><ArrowUp size={16}/></button>
                              <button type="button" onClick={() => moveNewsBlock(index, 'down')} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700"><ArrowDown size={16}/></button>
                              <button type="button" onClick={() => removeNewsBlock(block.id)} className="p-1 hover:bg-red-100 rounded text-red-400 hover:text-red-600 mt-2"><Trash2 size={16}/></button>
                            </div>
                            <div className="flex-1 w-full">
                              {block.type === 'paragraph' && <textarea value={block.value} onChange={(e) => updateNewsBlock(block.id, e.target.value)} rows="4" className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:border-indigo-600 outline-none" placeholder="Escreva o parágrafo..." required/>}
                              {block.type === 'subtitle' && <input value={block.value} onChange={(e) => updateNewsBlock(block.id, e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-lg font-bold text-lg focus:border-indigo-600 outline-none" placeholder="Subtítulo..." required/>}
                              {block.type === 'image' && <input value={block.value} onChange={(e) => updateNewsBlock(block.id, e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:border-indigo-600 outline-none" placeholder="URL da imagem..." required/>}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 border-t border-dashed border-slate-300 pt-4">
                        <button type="button" onClick={() => addNewsBlock('paragraph')} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-bold text-sm"><Type size={16}/> Parágrafo</button>
                        <button type="button" onClick={() => addNewsBlock('subtitle')} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm"><Heading size={16}/> Subtítulo</button>
                        <button type="button" onClick={() => addNewsBlock('image')} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm"><ImageIcon size={16}/> Imagem</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* BOTÕES GLOBAIS DE SALVAR/CANCELAR PARA AS OUTRAS ABAS */}
                <div className="flex gap-3 pt-6 border-t border-slate-100 mt-4">
                  <button type="submit" className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-md">
                    {editingItem?.id ? 'Guardar Alterações' : 'Publicar Agora'}
                  </button>
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 transition-colors">
                    Cancelar
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}