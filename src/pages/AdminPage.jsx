import React, { useState, useEffect } from 'react';
import { Trash2, PlusCircle, ArrowUp, ArrowDown, Image as ImageIcon, Type, Heading, Upload, Clock, CheckCircle, XCircle, Edit, Loader, Save, Tag, X, Shield, Users, Search } from 'lucide-react';
import VehicleForm from '../components/VehicleForm'; 
import PropertyForm from '../components/PropertyForm'; 
import LocationPicker from '../components/LocationPicker'; 
import { uploadFile } from '../utils/uploadHelper';
import { db } from '../utils/database';

export default function AdminPage({ newsData, eventsData, propertiesData, jobsData, vehiclesData, guideData, classifiedsData, adsData, offersData, settingsData, crud }) {
  const [activeTab, setActiveTab] = useState('offers');
  const [modalOpen, setModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [editingItem, setEditingItem] = useState(null);
  const [newsBlocks, setNewsBlocks] = useState([]);
  
  const [siteSettings, setSiteSettings] = useState(settingsData || { facebook: '', instagram: '', youtube: '', whatsapp: '', showWhatsapp: false });

  // === ESTADOS PARA GESTÃO DE USUÁRIOS ===
  const [editingUser, setEditingUser] = useState(null);
  const [usersList, setUsersList] = useState([]);

  // === ESTADO: CAMPO DE BUSCA DO ADMIN ===
  const [adminSearchTerm, setAdminSearchTerm] = useState('');

  // Limpa o campo de busca sempre que mudar de aba
  useEffect(() => {
    setAdminSearchTerm('');
  }, [activeTab]);

  useEffect(() => {
    if (settingsData) setSiteSettings(settingsData);
  }, [settingsData]);

  // === FUNÇÃO FILTRO INTELIGENTE ===
  const filterData = (data, searchFields) => {
    if (!data) return [];
    if (!adminSearchTerm) return data;
    const term = adminSearchTerm.toLowerCase();
    return data.filter(item => {
      return searchFields.some(field => {
        const val = item[field];
        return val && typeof val === 'string' && val.toLowerCase().includes(term);
      });
    });
  };

  // === CORREÇÃO: Transformado em função (render) para não perder o foco ao digitar ===
  const renderSearchBar = () => (
    <div className="relative flex-1 md:w-64 min-w-[200px]">
      <input 
        value={adminSearchTerm} 
        onChange={e => setAdminSearchTerm(e.target.value)} 
        placeholder="Buscar na lista..." 
        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm bg-slate-50 focus:bg-white transition-colors" 
      />
      <Search className="absolute left-3 top-3 text-slate-400" size={18} />
    </div>
  );

  // === CARREGAR USUÁRIOS ===
  const fetchUsers = async () => {
    setIsUploading(true);
    try {
      const users = await db.getAllUsers();
      setUsersList(users || []);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar usuários.");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  // === SALVAR EDIÇÃO DO USUÁRIO ===
  const handleSaveUser = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let newSuspensionEnd = editingUser.suspensionEnd;
      if (editingUser.status === 'suspended' && editingUser.suspensionDays) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + parseInt(editingUser.suspensionDays));
        newSuspensionEnd = endDate.toISOString();
      } else if (editingUser.status !== 'suspended') {
        newSuspensionEnd = null;
      }

      const dataToUpdate = {
        status: editingUser.status,
        suspensionEnd: newSuspensionEnd,
        permissions: editingUser.permissions || {
          unlimitedProperties: false, unlimitedVehicles: false, unlimitedJobs: false
        }
      };

      const targetDocId = editingUser.docId || editingUser.id; 
      await db.updateUserAdmin(targetDocId, dataToUpdate);
      
      alert("Conta atualizada com sucesso!");
      setEditingUser(null);
      fetchUsers();
    } catch(err) {
      console.error(err);
      alert("Erro ao atualizar conta.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await crud.updateSettings(siteSettings);
    alert("Configurações do site salvas com sucesso!");
  };

  const handleSetFeaturedNews = async (item, pos) => {
    setIsUploading(true);
    try {
      const existing = newsData.find(n => n.featuredPosition === pos);
      if (existing && existing.id !== item.id) {
        await crud.updateNews({ ...existing, featuredPosition: null });
      }
      if (item.featuredPosition === pos) {
        await crud.updateNews({ ...item, featuredPosition: null });
      } else {
        await crud.updateNews({ ...item, featuredPosition: pos });
      }
    } catch(err) {
      console.error(err);
      alert("Erro ao alterar o destaque da notícia.");
    } finally {
      setIsUploading(false);
    }
  };

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

  const handleJobsCSVUpload = async (e) => {
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

      const findColumn = (keywords) => headers.findIndex(h => keywords.some(k => h.includes(k)));
      const idxOcupacao = findColumn(['ocupacao', 'cargo', 'funcao']);
      const idxCodigo = findColumn(['vaga', 'codigo']); 
      const idxEscolaridade = findColumn(['escolaridade', 'ensino']);
      const idxExperiencia = findColumn(['experiencia', 'ctps']);
      const idxPcd = findColumn(['pcd', 'deficiencia']);
      const idxCnh = findColumn(['cnh', 'habilitacao']);
      const idxSalario = findColumn(['salario', 'remuneracao']);

      const newItems = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const regex = new RegExp(`\\s*${separator}\\s*(?=(?:[^"]*"[^"]*")*[^"]*$)`);
        const values = line.split(regex).map(v => v.replace(/^"|"$/g, '').trim());

        if (idxOcupacao >= 0 && values[idxOcupacao]) {
          let item = {
            title: values[idxOcupacao],
            company: "SINE Ouro Branco",
            category: "Outros", 
            type: "CLT",
            location: "Ouro Branco - MG",
            salary: (idxSalario >= 0 && values[idxSalario] && values[idxSalario] !== '-') ? values[idxSalario] : "A combinar",
            contact: "Compareça ao SINE Ouro Branco com a sua carteira de trabalho e documentos pessoais.",
            date: new Date().toISOString()
          };

          let descParts = [];
          if (idxCodigo >= 0 && values[idxCodigo] && values[idxCodigo] !== '-') {
            descParts.push(`Código da Vaga (SINE): ${values[idxCodigo]}`);
          }
          if (idxPcd >= 0 && values[idxPcd]) {
             const isPcd = values[idxPcd].toUpperCase();
             if(isPcd !== 'NÃO' && isPcd !== 'NAO' && isPcd !== '-') descParts.push(`Vaga aceita PCD: Sim`);
          }
          item.description = descParts.join('\n') || "Vaga disponibilizada pelo SINE de Ouro Branco.";

          let reqParts = [];
          if (idxEscolaridade >= 0 && values[idxEscolaridade] && values[idxEscolaridade] !== '-') reqParts.push(`Escolaridade: ${values[idxEscolaridade]}`);
          if (idxExperiencia >= 0 && values[idxExperiencia] && values[idxExperiencia] !== '-') reqParts.push(`Experiência exigida: ${values[idxExperiencia]}`);
          if (idxCnh >= 0 && values[idxCnh]) {
              const cnh = values[idxCnh].toUpperCase();
              if(cnh !== 'NÃO EXIGIDA' && cnh !== 'NAO EXIGIDA' && cnh !== '-') reqParts.push(`CNH Exigida: ${values[idxCnh]}`);
          }
          item.requirements = reqParts.join('\n');

          newItems.push(item);
        }
      }

      if (newItems.length === 0) return alert("Nenhuma vaga válida encontrada no CSV. Verifique os nomes das colunas.");
      
      if (window.confirm(`Foram encontradas ${newItems.length} vagas do SINE.\nDeseja iniciar a importação?`)) {
         setIsUploading(true);
         try {
           for (const item of newItems) { await crud.addJob(item); }
           alert("Vagas do SINE importadas com sucesso!");
         } catch(err) { 
           alert("Ocorreu um erro durante a importação."); 
         } finally {
           setIsUploading(false);
         }
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = null;
  };

  const handleLocalImageUpload = async (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        const url = await uploadFile(file, `${activeTab}_images`);
        if (url) callback(url);
      } catch (err) {
        console.error("Erro no upload:", err);
        alert("Erro ao enviar a imagem. Tente novamente ou verifique se tem permissão no Firebase Storage.");
      } finally {
        setIsUploading(false);
      }
    }
    e.target.value = null;
  };

  const handleNewsMultiImageUpload = async (e, blockId, currentValues) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setIsUploading(true);
    try {
      const uploadPromises = files.map(file => uploadFile(file, 'news_images'));
      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter(Boolean);
      
      let newValues = Array.isArray(currentValues) ? [...currentValues] : (currentValues ? [currentValues] : []);
      newValues = [...newValues, ...validUrls];
      
      updateNewsBlockField(blockId, 'value', newValues);
    } catch (err) {
      console.error("Erro no upload de múltiplas imagens:", err);
      alert("Erro ao enviar algumas imagens. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
    e.target.value = null;
  };

  const openEditModal = (item = {}) => {
    if (activeTab === 'news') setNewsBlocks(item.content || []);
    const imageValue = item.image || (item.photos && item.photos.length > 0 ? item.photos[0] : '') || '';
    const photosValue = item.photos || (item.image ? [item.image] : []);
    
    // Preenche a localização vazia do Guia para inicializar o mapa
    let loc = item.location;
    if (activeTab === 'guide' && !loc) {
        loc = { lat: -20.5236, lng: -43.6914 };
    }
    
    setEditingItem({ ...item, image: imageValue, photos: photosValue, location: loc });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isUploading) {
      alert("Aguarde o envio da imagem terminar.");
      return;
    }
    
    let payload = { ...editingItem };
    
    if (activeTab === 'news') payload.content = newsBlocks;

    try {
      if (payload.id) {
        if (activeTab === 'offers') await crud.updateOffer(payload);
        if (activeTab === 'ads') await crud.updateAd(payload);
        if (activeTab === 'news') await crud.updateNews(payload);
        if (activeTab === 'events') await crud.updateEvent(payload);
        if (activeTab === 'jobs') await crud.updateJob(payload);
        if (activeTab === 'guide') await crud.updateGuideItem(payload);
        if (activeTab === 'classifieds') await crud.updateClassified(payload);
      } else {
        payload.date = payload.date || new Date().toISOString();
        if (activeTab === 'offers') await crud.addOffer(payload);
        if (activeTab === 'ads') await crud.addAd({...payload, status: 'active', createdAt: new Date().toISOString()});
        if (activeTab === 'news') await crud.addNews(payload);
        if (activeTab === 'events') await crud.addEvent(payload);
        if (activeTab === 'jobs') await crud.addJob({...payload, createdAt: new Date().toISOString()});
        if (activeTab === 'guide') await crud.addGuideItem({...payload, status: 'active'});
        if (activeTab === 'classifieds') await crud.addClassified({...payload, createdAt: new Date().toISOString()});
      }
      
      setModalOpen(false);
      setEditingItem(null);
      setNewsBlocks([]);
    } catch(err) {
      console.error("Erro ao salvar no banco:", err);
      alert("Erro ao salvar! Verifique sua conexão e tente novamente.");
    }
  };

  const renderField = (label, field, type="text", required=false, options=null, placeholder="") => {
    const val = editingItem?.[field] || '';
    const onChange = e => setEditingItem({...editingItem, [field]: e.target.value});
    
    return (
      <div key={field}>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
        {type === 'select' ? (
          <select value={val} onChange={onChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" required={required}>
            <option value="">Selecione...</option>
            {options?.map(opt => (
              <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea value={val} onChange={onChange} placeholder={placeholder} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" rows="3" required={required}/>
        ) : (
          <input type={type} value={val} onChange={onChange} placeholder={placeholder} step={type === 'number' ? '0.01' : undefined} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" required={required}/>
        )}
      </div>
    );
  };

  const renderImagePicker = (label="Imagem (URL ou Upload)", field="image", required=false) => {
    const val = editingItem?.[field] || '';
    const onChange = e => setEditingItem({...editingItem, [field]: e.target.value});
    
    return (
      <div key={field}>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
        <div className="flex gap-2">
          <input value={val} onChange={onChange} className="flex-1 p-3 bg-white border border-slate-200 rounded-lg focus:border-indigo-600 outline-none" placeholder="Link da imagem..." required={required && !val}/>
          <label className={`bg-slate-200 hover:bg-slate-300 text-slate-700 p-3 rounded-lg cursor-pointer flex items-center justify-center transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {isUploading ? <Loader size={20} className="animate-spin"/> : <Upload size={20} />}
            <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={(e) => handleLocalImageUpload(e, (url) => setEditingItem({...editingItem, [field]: url}))} />
          </label>
        </div>
        {isUploading && <p className="text-xs text-indigo-600 mt-1 font-bold">Enviando imagem, aguarde...</p>}
        {val && !isUploading && <img src={val} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-lg border border-slate-200"/>}
      </div>
    );
  };

  const renderList = (data, titleField, deleteFunc) => (
    <div className="space-y-3 mt-4">
      {data && data.length > 0 ? data.map(item => (
        <div key={item.id} className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col">
             <span className="font-bold text-slate-800">{item[titleField] || item.title || item.name || 'Item sem título'}</span>
             {item.company && <span className="text-[10px] text-slate-500 font-bold mt-0.5">{item.company}</span>}
             {item.category && <span className="text-[10px] text-indigo-600 font-bold uppercase mt-1">{item.category}</span>}
             {item.ownerName && <span className="text-[10px] text-slate-400 font-bold mt-1">Por: {item.ownerName}</span>}
             {item.position === 'middle' && <span className="text-[10px] text-pink-600 font-bold uppercase mt-1">Banner Meio da Página</span>}
             {item.position === 'sidebar' && <span className="text-[10px] text-purple-600 font-bold uppercase mt-1">Banner Lateral Direita</span>}
          </div>
          <div className="flex gap-2">
            {activeTab !== 'classifieds' && (
              <button onClick={() => openEditModal(item)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors" title="Editar">
                <Edit size={18} />
              </button>
            )}
            <button onClick={() => { if(window.confirm('Tem certeza que deseja excluir?')) deleteFunc(item.id); }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Excluir">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      )) : <p className="text-slate-500 text-center py-8">Nenhum item cadastrado nesta categoria.</p>}
    </div>
  );

  const addNewsBlock = (type) => setNewsBlocks([...newsBlocks, { id: Date.now(), type, value: '', caption: '' }]);
  
  const updateNewsBlockField = (id, field, newValue) => {
    setNewsBlocks(newsBlocks.map(block => block.id === id ? { ...block, [field]: newValue } : block));
  };
  
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
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px] relative">
      
      {/* LOADER GLOBAL */}
      {isUploading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <Loader size={48} className="text-indigo-600 animate-spin mb-4" />
          <p className="font-bold text-slate-800 text-lg">Processando...</p>
        </div>
      )}

      {/* MENU DE ABAS */}
      <div className="flex overflow-x-auto bg-slate-50 border-b border-slate-200 scrollbar-hide">
        {[
          { id: 'offers', label: 'Shopping / Ofertas' },
          { id: 'ads', label: 'Publicidade (Banners)' },
          { id: 'news', label: 'Notícias' },
          { id: 'events', label: 'Eventos' },
          { id: 'real_estate', label: 'Imóveis' },
          { id: 'jobs', label: 'Vagas' },
          { id: 'vehicles', label: 'Veículos' },
          { id: 'classifieds', label: 'Classificados' },
          { id: 'guide', label: pendingGuideItems.length > 0 ? `Guia Comercial (${pendingGuideItems.length})` : 'Guia Comercial' },
          { id: 'users', label: 'Usuários' },
          { id: 'settings', label: 'Configurações' }
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
        
        {/* ABA: GESTÃO DE USUÁRIOS */}
        {activeTab === 'users' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 shrink-0">
                <Users size={24} className="text-indigo-600"/> Gerenciar Usuários
              </h2>
              <div className="flex gap-2 w-full md:w-auto items-center">
                {renderSearchBar()}
                <button onClick={fetchUsers} className="bg-indigo-50 text-indigo-700 px-4 py-2.5 rounded-xl font-bold hover:bg-indigo-100 transition shadow-sm border border-indigo-100 shrink-0">
                  Atualizar
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {filterData(usersList, ['name', 'email']).map(u => (
                <div key={u.id} className="flex flex-col sm:flex-row gap-4 p-5 border border-slate-200 rounded-xl bg-white relative group items-start sm:items-center justify-between shadow-sm hover:border-indigo-200 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-black text-xl uppercase shrink-0">
                      {u.name ? u.name[0] : '?'}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-base flex items-center gap-2 mb-0.5">
                        {u.name} {u.role === 'admin' && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">Admin</span>}
                      </h3>
                      <p className="text-sm font-medium text-slate-500 mb-2">{u.email}</p>
                      <div className="flex flex-wrap gap-2">
                        {u.status === 'banned' ? (
                          <span className="bg-red-100 border border-red-200 text-red-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Banido</span>
                        ) : u.status === 'suspended' ? (
                          <span className="bg-orange-100 border border-orange-200 text-orange-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                            Suspenso até {u.suspensionEnd ? new Date(u.suspensionEnd).toLocaleDateString('pt-BR') : ''}
                          </span>
                        ) : (
                          <span className="bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Ativo</span>
                        )}
                        
                        {(u.permissions?.unlimitedProperties || u.permissions?.unlimitedVehicles || u.permissions?.unlimitedJobs) && (
                          <span className="bg-indigo-100 border border-indigo-200 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Membro VIP</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setEditingUser({...u, suspensionDays: ''})} className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold shadow-sm hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition flex items-center justify-center gap-2 shrink-0">
                    <Shield size={18}/> Gerenciar Conta
                  </button>
                </div>
              ))}
              {filterData(usersList, ['name', 'email']).length === 0 && <p className="text-center py-8 text-slate-400 font-medium">Nenhum usuário encontrado.</p>}
            </div>
          </div>
        )}

        {/* MODAL DE EDIÇÃO DE USUÁRIO */}
        {editingUser && (
          <div className="fixed inset-0 bg-slate-900/80 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto custom-scrollbar relative shadow-2xl animate-in zoom-in-95">
              <button onClick={() => setEditingUser(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition"><X size={20}/></button>
              
              <h2 className="text-2xl font-black text-slate-800 mb-2">Gerenciar Conta</h2>
              <p className="text-sm font-bold text-indigo-600 mb-6 pb-4 border-b border-slate-100">{editingUser.name} ({editingUser.email})</p>
              
              <form onSubmit={handleSaveUser} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Status da Conta</label>
                  <select value={editingUser.status || 'active'} onChange={e => setEditingUser({...editingUser, status: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-bold text-slate-700">
                    <option value="active">🟢 Ativo (Acesso Normal)</option>
                    <option value="suspended">🟠 Suspender Temporariamente</option>
                    <option value="banned">🔴 Banir Permanentemente</option>
                  </select>
                </div>

                {editingUser.status === 'suspended' && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-xs font-black text-orange-500 uppercase tracking-wider mb-2">Duração da Suspensão</label>
                    <select value={editingUser.suspensionDays || ''} onChange={e => setEditingUser({...editingUser, suspensionDays: e.target.value})} className="w-full p-4 bg-orange-50 border border-orange-200 rounded-xl outline-none focus:border-orange-500 text-orange-800 font-bold" required>
                      <option value="">Selecione os dias...</option>
                      <option value="5">5 Dias</option>
                      <option value="10">10 Dias</option>
                      <option value="15">15 Dias</option>
                      <option value="30">30 Dias</option>
                    </select>
                  </div>
                )}

                <div className="pt-2">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Permissões Especiais (Limites VIP)</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl cursor-pointer transition">
                      <input type="checkbox" checked={editingUser.permissions?.unlimitedProperties || false} onChange={e => setEditingUser({...editingUser, permissions: {...(editingUser.permissions || {}), unlimitedProperties: e.target.checked}})} className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                      <span className="text-sm font-bold text-indigo-900">Anúncios Ilimitados de Imóveis</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl cursor-pointer transition">
                      <input type="checkbox" checked={editingUser.permissions?.unlimitedVehicles || false} onChange={e => setEditingUser({...editingUser, permissions: {...(editingUser.permissions || {}), unlimitedVehicles: e.target.checked}})} className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                      <span className="text-sm font-bold text-indigo-900">Anúncios Ilimitados de Veículos</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl cursor-pointer transition">
                      <input type="checkbox" checked={editingUser.permissions?.unlimitedJobs || false} onChange={e => setEditingUser({...editingUser, permissions: {...(editingUser.permissions || {}), unlimitedJobs: e.target.checked}})} className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                      <span className="text-sm font-bold text-indigo-900">Cadastros Ilimitados de Vagas</span>
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium leading-relaxed">
                    *Marcando estas opções, o usuário ignora a regra limite de 3 cadastros, podendo publicar anúncios infinitamente na respectiva categoria. E seus anúncios ficarão ativos por 120 dias em vez de 30.
                  </p>
                </div>

                <div className="flex gap-3 pt-6 mt-4 border-t border-slate-100">
                  <button type="submit" className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-xl hover:bg-indigo-700 transition shadow-md">Salvar Alterações</button>
                  <button type="button" onClick={() => setEditingUser(null)} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 transition shadow-sm">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* === RESTO DAS CONFIGURAÇÕES === */}
        {activeTab === 'settings' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-black text-slate-800">Configurações Gerais do Site</h2>
            </div>
            <form onSubmit={handleSaveSettings} className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-5">
              <h3 className="font-bold text-slate-700 border-b border-slate-200 pb-2">Redes Sociais (Cabeçalho)</h3>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Link do Facebook</label><input type="url" value={siteSettings.facebook} onChange={e => setSiteSettings({...siteSettings, facebook: e.target.value})} placeholder="Ex: https://facebook.com/linkdacidade" className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Link do Instagram</label><input type="url" value={siteSettings.instagram} onChange={e => setSiteSettings({...siteSettings, instagram: e.target.value})} placeholder="Ex: https://instagram.com/linkdacidade" className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Link do YouTube</label><input type="url" value={siteSettings.youtube} onChange={e => setSiteSettings({...siteSettings, youtube: e.target.value})} placeholder="Ex: https://youtube.com/c/linkdacidade" className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Link do WhatsApp</label><input type="url" value={siteSettings.whatsapp} onChange={e => setSiteSettings({...siteSettings, whatsapp: e.target.value})} placeholder="Ex: https://wa.me/5531999999999" className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600" /></div>
              <div className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl"><input type="checkbox" id="showWhatsapp" checked={siteSettings.showWhatsapp} onChange={e => setSiteSettings({...siteSettings, showWhatsapp: e.target.checked})} className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" /><label htmlFor="showWhatsapp" className="text-sm font-bold text-indigo-900 cursor-pointer select-none">Exibir Ícone do WhatsApp no Cabeçalho</label></div>
              <button type="submit" className="mt-4 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition"><Save size={18}/> Salvar Configurações</button>
            </form>
          </div>
        )}

        {/* === ABA: GUIA COMERCIAL === */}
        {activeTab === 'guide' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-black text-slate-800 shrink-0">Gerenciar Guia Comercial</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
                {renderSearchBar()}
                <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={() => openEditModal()} className="flex-1 sm:flex-none bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-sm">
                    <PlusCircle size={18}/> Novo Local
                  </button>
                  <label className="flex-1 sm:flex-none bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition cursor-pointer shadow-sm">
                    <Upload size={18}/> Importar CSV
                    <input type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
                  </label>
                </div>
              </div>
            </div>

            {filterData(pendingGuideItems, ['name', 'address', 'category']).length > 0 && (
              <div className="mb-10 bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2"><Clock size={20}/> Solicitações Aguardando Aprovação</h3>
                <div className="space-y-3">
                  {filterData(pendingGuideItems, ['name', 'address', 'category']).map(item => (
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
            {renderList(filterData(activeGuideItems, ['name', 'address', 'category']), 'name', crud.deleteGuideItem)}
          </div>
        )}

        {/* === ABA: OFERTAS === */}
        {activeTab === 'offers' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-black text-slate-800 shrink-0">Gerenciar Banco de Ofertas</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
                {renderSearchBar()}
                <button onClick={() => openEditModal({ category: 'bestsellers' })} className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 justify-center shadow-sm">
                  <PlusCircle size={18}/> Adicionar Oferta
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filterData(offersData, ['title', 'category']).map(item => (
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
              {filterData(offersData, ['title', 'category']).length === 0 && <p className="text-slate-400 py-8 col-span-full text-center">Nenhuma oferta encontrada.</p>}
            </div>
          </div>
        )}

        {/* === ABA: ADS === */}
        {activeTab === 'ads' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-black text-slate-800 shrink-0">Gerenciar Publicidade (Banners)</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
                {renderSearchBar()}
                <button onClick={() => openEditModal({ position: 'top' })} className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 justify-center shadow-sm">
                  <PlusCircle size={18}/> Adicionar Banner
                </button>
              </div>
            </div>
            {renderList(filterData(adsData, ['title', 'position']), 'title', crud.deleteAd)}
          </div>
        )}

        {/* === ABA: NOTÍCIAS === */}
        {activeTab === 'news' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-black text-slate-800 shrink-0">Gerenciar Notícias</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
                {renderSearchBar()}
                <button onClick={() => openEditModal({ isOfficial: false, author: 'Redação', category: 'Cidade' })} className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 justify-center shadow-sm">
                  <PlusCircle size={18}/> Nova Notícia
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {filterData(newsData, ['title', 'author', 'category']).map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50 relative group hover:border-indigo-200 transition-colors">
                  {item.image && <img src={item.image} alt="Capa" className="w-full sm:w-32 h-24 object-cover bg-white rounded-lg border border-slate-200"/>}
                  <div className="flex-1 min-w-0 pr-20">
                    <h3 className="font-bold text-slate-800 text-base line-clamp-2" title={item.title}>{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{item.author} • {item.date ? new Date(item.date).toLocaleDateString('pt-BR') : 'Sem data'}</p>
                    
                    <div className="flex items-center gap-3 mt-3">
                      {item.isOfficial && <span className="inline-block bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Oficial</span>}
                      
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-500 uppercase px-1.5 hidden sm:inline">Destaque:</span>
                        {[1, 2, 3].map(pos => (
                          <button
                            key={pos}
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleSetFeaturedNews(item, pos); }}
                            className={`w-7 h-7 rounded flex items-center justify-center text-[10px] font-black transition-colors ${item.featuredPosition === pos ? 'bg-amber-400 text-white shadow-inner' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-100'}`}
                            title={pos === 1 ? "Destaque Maior (Esquerda)" : `Destaque Menor (${pos})`}
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => openEditModal(item)} className="p-2 bg-white text-indigo-600 hover:bg-indigo-50 rounded-lg shadow-sm border border-slate-200 transition-colors"><Edit size={18}/></button>
                    <button onClick={() => { if(window.confirm('Excluir notícia?')) crud.deleteNews(item.id); }} className="p-2 bg-white text-red-600 hover:bg-red-50 rounded-lg shadow-sm border border-slate-200 transition-colors"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
              {filterData(newsData, ['title', 'author', 'category']).length === 0 && <p className="text-slate-400 py-8 col-span-full text-center">Nenhuma notícia encontrada.</p>}
            </div>
          </div>
        )}

        {/* === OUTRAS ABAS COM SEARCH BAR === */}
        {activeTab === 'events' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-black text-slate-800 shrink-0">Gerenciar Eventos</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
                {renderSearchBar()}
                <button onClick={() => openEditModal()} className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-sm"><PlusCircle size={18}/> Novo Evento</button>
              </div>
            </div>
            {renderList(filterData(eventsData, ['title', 'location', 'category']), 'title', crud.deleteEvent)}
          </div>
        )}

        {activeTab === 'real_estate' && (
           <div>
             <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
               <h2 className="text-xl font-black text-slate-800 shrink-0">Gerenciar Imóveis</h2>
               <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
                 {renderSearchBar()}
                 <button onClick={() => openEditModal({type: 'Venda'})} className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-sm"><PlusCircle size={18}/> Novo Imóvel</button>
               </div>
             </div>
             {renderList(filterData(propertiesData, ['title', 'address', 'type']), 'title', crud.deleteProperty)}
           </div>
        )}
        
        {activeTab === 'jobs' && (
           <div>
             <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
               <h2 className="text-xl font-black text-slate-800 shrink-0">Gerenciar Vagas</h2>
               <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
                 {renderSearchBar()}
                 <div className="flex gap-2 w-full sm:w-auto">
                   <button onClick={() => openEditModal({type: 'CLT'})} className="flex-1 sm:flex-none bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-sm">
                     <PlusCircle size={18}/> Nova Vaga
                   </button>
                   <label className="flex-1 sm:flex-none bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition cursor-pointer shadow-sm">
                     <Upload size={18}/> Importar SINE
                     <input type="file" accept=".csv" className="hidden" onChange={handleJobsCSVUpload} />
                   </label>
                 </div>
               </div>
             </div>
             {renderList(filterData(jobsData, ['title', 'company', 'category']), 'title', crud.deleteJob)}
           </div>
        )}

        {activeTab === 'vehicles' && (
           <div>
             <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
               <h2 className="text-xl font-black text-slate-800 shrink-0">Gerenciar Veículos</h2>
               <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
                 {renderSearchBar()}
                 <button onClick={() => openEditModal()} className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-sm"><PlusCircle size={18}/> Novo Veículo</button>
               </div>
             </div>
             {renderList(filterData(vehiclesData, ['title', 'brand', 'model']), 'title', crud.deleteVehicle)}
           </div>
        )}

        {activeTab === 'classifieds' && (
           <div>
             <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 shrink-0"><Tag size={24} className="text-indigo-600"/> Classificados</h2>
                <div className="flex w-full md:w-auto items-center">{renderSearchBar()}</div>
             </div>
             {renderList(filterData(classifiedsData, ['title', 'category']), 'title', crud.deleteClassified)}
           </div>
        )}

      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <h2 className="text-2xl font-black text-slate-800 mb-6 border-b border-slate-100 pb-4">
              {editingItem?.id ? 'Editar Informações' : 'Novo Cadastro'}
            </h2>
            
            {activeTab === 'real_estate' ? (
              <div className="mt-4">
                <PropertyForm 
                  initialData={editingItem} 
                  isAdmin={true} 
                  onSuccess={(formData) => {
                    if (editingItem && editingItem.id) crud.updateProperty(formData);
                    else crud.addProperty(formData);
                    setModalOpen(false); setEditingItem(null);
                  }}
                  onCancel={() => setModalOpen(false)}
                />
              </div>
            ) : activeTab === 'vehicles' ? (
              <div className="mt-4">
                <VehicleForm 
                  user={{ id: 'admin', name: 'Administrador', email: 'admin@linkdacidade.com', phone: '', role: 'admin' }} 
                  initialData={editingItem} 
                  onSuccess={(formData) => {
                    if (editingItem && editingItem.id) crud.updateVehicle(formData);
                    else crud.addVehicle(formData);
                    setModalOpen(false); setEditingItem(null);
                  }} 
                />
                <button onClick={() => setModalOpen(false)} className="w-full mt-3 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                  Cancelar e Voltar
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                {activeTab === 'ads' && (
                  <>
                    {renderField("Título da Campanha (Empresa/Anunciante)", "title", "text", true, null, "Ex: Ótica Visual")}
                    {renderField("Posição do Banner", "position", "select", true, [
                      {value: 'top', label: 'Carrossel Principal (Topo da Página)'},
                      {value: 'middle', label: 'Banner Fixo (Meio da Página)'},
                      {value: 'sidebar', label: 'Banner Lateral Direita'}
                    ])}
                    {renderField("Link de Destino (Opcional)", "link", "text", false, null, "Deixe em branco se for apenas uma imagem estática")}
                    {renderImagePicker("Banner (Qualquer formato de imagem serve)", "image", true)}
                  </>
                )}

                {activeTab === 'offers' && (
                  <>
                    {renderField("Categoria (Subgrupo)", "category", "select", true, [{value: 'bestsellers', label: 'Ofertas do dia'}, {value: 'celulares', label: 'Celulares'}, {value: 'tvs', label: 'TVs'}, {value: 'informatica', label: 'Informática'}])}
                    {renderField("Título", "title", "text", true)}
                    <div className="grid grid-cols-2 gap-4">
                       {renderField("Preço Atual", "price", "number", true)}
                       {renderField("Preço Antigo", "originalPrice", "number", false)}
                    </div>
                    {renderImagePicker()}
                    {renderField("Link de Afiliado", "link", "text", true)}
                  </>
                )}

                {activeTab === 'events' && (
                  <>
                    {renderField("Título do Evento", "title", "text", true)}
                    <div className="grid grid-cols-3 gap-4">
                      {renderField("Data", "date", "date", true)}
                      {renderField("Hora", "time", "time", true)}
                      {renderField("Categoria", "category", "text", true)}
                    </div>
                    {renderField("Local do Evento", "location", "text", true)}
                    {renderImagePicker()}
                    {renderField("Descrição", "description", "textarea")}
                    {renderField("Link para Ingressos (Opcional)", "link")}
                  </>
                )}

                {activeTab === 'jobs' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      {renderField("Cargo / Título", "title", "text", true)}
                      {renderField("Empresa", "company", "text", true)}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {renderField("Categoria", "category", "select", true, ["Comércio & Vendas", "Alimentação & Gastronomia", "Administrativo & Financeiro", "Serviços Gerais & Manutenção", "Saúde & Cuidados", "Indústria & Logística", "Educação", "Tecnologia & Marketing", "Outros"])}
                      {renderField("Tipo de Vaga", "type", "select", true, ['CLT', 'Estágio', 'PJ', 'Temporário', 'A Combinar'])}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {renderField("Salário", "salary", "text", false, null, "Ex: R$ 1.500,00 ou A combinar")}
                      {renderField("Localização / Bairro", "location", "text", true, null, "Ouro Branco - MG")}
                    </div>
                    {renderField("Descrição da Vaga (E PCD)", "description", "textarea", true)}
                    {renderField("Requisitos (Escolaridade, CNH, Experiência)", "requirements", "textarea")}
                    {renderField("Contato (E-mail, Zap ou Endereço SINE)", "contact", "text", true, null, "E-mail ou WhatsApp")}
                  </>
                )}

                {/* === FORMULÁRIO DO GUIA COM NOVO MAPA === */}
                {activeTab === 'guide' && (
                  <>
                    {renderField("Nome do Estabelecimento", "name", "text", true)}
                    <div className="grid grid-cols-2 gap-4">
                      {renderField("Categoria", "category", "select", true, ["Saúde & Bem-estar", "Emergência & Serviços Públicos", "Educação & Ensino", "Supermercados & Alimentação", "Automotivo & Transportes", "Construção & Casa", "Bancos & Financeiro", "Hotéis & Pousadas", "Religião & Igrejas", "Esportes & Academias", "Beleza & Estética", "Outros"])}
                      {renderField("Telefone / Celular", "phone")}
                    </div>
                    {renderField("Endereço Completo", "address")}
                    
                    {/* CAMPO DE MAPA COM PESQUISA (LOCATION PICKER) */}
                    <div className="mt-4 mb-4">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Localização Exata no Mapa</label>
                      <div className="h-64 w-full rounded-xl overflow-hidden border border-slate-200">
                        <LocationPicker 
                          lat={editingItem?.location?.lat || -20.5236} 
                          lng={editingItem?.location?.lng || -43.6914} 
                          onChange={(location) => setEditingItem({ ...editingItem, location })} 
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2 font-medium">Use a lupa no mapa para pesquisar o endereço ou arraste o pino para a localização exata do comércio.</p>
                    </div>

                    {renderField("Breve Descrição (Opcional)", "description", "textarea")}
                    {renderImagePicker("Logotipo ou Foto da Fachada")}
                  </>
                )}

                {activeTab === 'news' && (
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-4">
                      <h3 className="font-bold text-slate-700 border-b border-slate-200 pb-2">Cabeçalho da Matéria</h3>
                      {renderField("Título Principal", "title", "text", true)}
                      {renderField("Linha Fina (Resumo itálico)", "summary", "textarea", true)}
                      {renderImagePicker("Imagem de Capa")}
                      <div className="grid grid-cols-2 gap-4">
                        {renderField("Categoria", "category", "select", true, ['Cidade', 'Política', 'Polícia', 'Esportes', 'Saúde', 'Educação', 'Cultura & Lazer', 'Economia', 'Tecnologia', 'Outros'])}
                        {renderField("Autor / Fonte", "author", "text", true)}
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
                              {block.type === 'paragraph' && <textarea value={block.value} onChange={(e) => updateNewsBlockField(block.id, 'value', e.target.value)} rows="4" className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:border-indigo-600 outline-none" placeholder="Escreva o parágrafo..." required/>}
                              
                              {block.type === 'subtitle' && <input value={block.value} onChange={(e) => updateNewsBlockField(block.id, 'value', e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-lg font-bold text-lg focus:border-indigo-600 outline-none" placeholder="Subtítulo..." required/>}
                              
                              {block.type === 'image' && (
                                <div className="flex flex-col gap-2">
                                  <div className="flex gap-2">
                                    <input 
                                       value={Array.isArray(block.value) ? block.value.join(', ') : (block.value || '')} 
                                       onChange={(e) => {
                                           const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                           updateNewsBlockField(block.id, 'value', arr.length > 0 ? arr : '');
                                       }} 
                                       className="flex-1 p-3 bg-white border border-slate-200 rounded-lg focus:border-indigo-600 outline-none" 
                                       placeholder="Cole URLs separadas por vírgula (ou faça upload ao lado)..." 
                                       required={!(block.value && block.value.length > 0)}
                                    />
                                    
                                    <label className={`bg-slate-200 hover:bg-slate-300 text-slate-700 p-3 rounded-lg cursor-pointer flex items-center justify-center transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                      {isUploading ? <Loader size={20} className="animate-spin"/> : <Upload size={20} />}
                                      <input 
                                        type="file" 
                                        multiple 
                                        accept="image/*" 
                                        className="hidden" 
                                        disabled={isUploading} 
                                        onChange={(e) => handleNewsMultiImageUpload(e, block.id, block.value)} 
                                      />
                                    </label>
                                  </div>

                                  {(Array.isArray(block.value) ? block.value : (block.value ? [block.value] : [])).length > 0 && (
                                    <div className="flex flex-wrap gap-3 mt-2 mb-2 p-3 bg-white border border-slate-200 rounded-lg">
                                      {(Array.isArray(block.value) ? block.value : (block.value ? [block.value] : [])).map((imgUrl, i) => (
                                        <div key={i} className="relative group w-24 h-24">
                                           <img src={imgUrl} alt={`Preview ${i}`} className="w-full h-full object-cover rounded-md border border-slate-200" />
                                           <button 
                                             type="button" 
                                             onClick={() => {
                                                const currentArr = Array.isArray(block.value) ? block.value : [block.value];
                                                const newArr = currentArr.filter((_, index) => index !== i);
                                                updateNewsBlockField(block.id, 'value', newArr.length > 0 ? newArr : '');
                                             }} 
                                             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-sm"
                                           >
                                             <X size={14} />
                                           </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  <input 
                                     value={block.caption || ''} 
                                     onChange={(e) => updateNewsBlockField(block.id, 'caption', e.target.value)} 
                                     className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:border-indigo-600 outline-none text-sm italic" 
                                     placeholder="Legenda da foto ou do carrossel (Opcional)..."
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 border-t border-dashed border-slate-300 pt-4">
                        <button type="button" onClick={() => addNewsBlock('paragraph')} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-bold text-sm"><Type size={16}/> Parágrafo</button>
                        <button type="button" onClick={() => addNewsBlock('subtitle')} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm"><Heading size={16}/> Subtítulo</button>
                        <button type="button" onClick={() => addNewsBlock('image')} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm"><ImageIcon size={16}/> Imagem / Carrossel</button>
                      </div>
                    </div>
                  </div>
                )}

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