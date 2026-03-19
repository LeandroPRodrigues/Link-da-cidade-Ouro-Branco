import React, { useState } from 'react';
import { Search, MapPin, Phone, MessageCircle, ChevronRight, Store, ArrowLeft, Grid, PlusCircle, Upload, X } from 'lucide-react';
import { GUIDE_CATEGORIES } from '../data/mockData';
// Importando o componente do Mapa
import LocationPicker from '../components/LocationPicker';

export default function GuidePage({ guideData, crud, onLocalClick, user, onRequireLogin }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Estados para o Formulário Colaborativo
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Adicionado o state 'location' com as coordenadas iniciais de Ouro Branco
  const [newItem, setNewItem] = useState({ name: '', category: '', phone: '', address: '', image: '', location: { lat: -20.5236, lng: -43.6914 } });

  // A MÁGICA: O público só vê os estabelecimentos que NÃO estão pendentes de aprovação
  const activeGuideData = guideData.filter(item => item.status !== 'pending');

  const filteredGuide = activeGuideData.filter(item => {
    if (searchTerm) {
      return item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
             item.category.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (selectedCategory) return item.category === selectedCategory;
    return true;
  });

  const clearFilters = () => { setSearchTerm(''); setSelectedCategory(null); };

  // Conversor da Imagem escolhida pelo usuário
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewItem({...newItem, image: reader.result});
      reader.readAsDataURL(file);
    }
  };

  // Função para verificar login antes de abrir o modal
  const handleOpenModal = () => {
    if (!user) {
      alert("Você precisa estar logado para cadastrar um estabelecimento.");
      if (onRequireLogin) onRequireLogin(); // Tenta abrir a tela de login do App.jsx
      return;
    }
    setIsModalOpen(true);
  };

  // Função que envia para a "Sala de Espera" do Admin
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await crud.addGuideItem({
        ...newItem,
        status: 'pending', // Fica escondido até você aprovar!
        ownerId: user?.id || 'desconhecido', // Salva o ID de quem enviou
        date: new Date().toISOString()
      });
      alert("Local enviado com sucesso! Após análise da nossa equipe, ele aparecerá no guia.");
      setIsModalOpen(false);
      setNewItem({ name: '', category: '', phone: '', address: '', image: '', location: { lat: -20.5236, lng: -43.6914 } });
    } catch (error) {
      alert("Erro ao enviar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const GuideListItem = ({ item }) => {
    const cleanPhone = (item.phone || '').replace(/\D/g, '');
    const isMobile = cleanPhone.length >= 10 && cleanPhone.startsWith('319');

    return (
      <div className="p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition group flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-4 items-center w-full">
          {item.image && (
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-white border border-slate-200 shrink-0 shadow-sm" />
          )}
          <div className="flex-1 cursor-pointer" onClick={() => onLocalClick(item)}>
            <h3 className="font-bold text-slate-800 text-base group-hover:text-indigo-600 transition mb-1">{item.name}</h3>
            {item.description && <p className="text-xs text-slate-500 mb-1 line-clamp-2">{item.description}</p>}
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
              <MapPin size={12} className="shrink-0"/> <span className="truncate">{item.address || 'Endereço não informado'}</span>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-auto flex gap-2 mt-3 sm:mt-0">
           {cleanPhone ? (
             isMobile ? (
                <a href={`https://wa.me/55${cleanPhone}`} target="_blank" rel="noreferrer" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 px-4 py-2 rounded-lg text-xs font-bold transition"><MessageCircle size={14}/> WhatsApp</a>
             ) : (
                <a href={`tel:${cleanPhone}`} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-lg text-xs font-bold transition"><Phone size={14}/> Ligar</a>
             )
           ) : (
              <span className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-50 text-slate-400 px-4 py-2 rounded-lg text-xs font-bold">Sem Telefone</span>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in pb-12 relative">
      <div className="bg-white p-6 rounded-b-2xl md:rounded-2xl shadow-sm border border-slate-100 mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Store className="text-indigo-600" size={24}/> Guia Comercial
        </h2>
        <div className="relative">
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar empresa, serviço ou categoria..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-base transition-all outline-none" />
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20}/>
        </div>
      </div>

      {(selectedCategory || searchTerm) && (
        <div className="flex items-center gap-2 mb-4 px-2">
          <button onClick={clearFilters} className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm"><ArrowLeft size={12}/> Categorias</button>
          <ChevronRight size={12} className="text-slate-300"/>
          <span className="text-sm font-bold text-slate-800">{searchTerm ? `Busca: "${searchTerm}"` : selectedCategory}</span>
        </div>
      )}

      {!selectedCategory && !searchTerm && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Grid size={14}/> Navegar por Categorias</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {GUIDE_CATEGORIES.sort().map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:scale-105 transition duration-200 group h-24 text-center border border-transparent hover:border-indigo-100">
                <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-700 leading-tight">{cat}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {(selectedCategory || searchTerm) && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[300px] mb-6">
          {filteredGuide.length > 0 ? (
            <div>
               <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{filteredGuide.length} Resultados encontrados</div>
               {filteredGuide.sort((a, b) => a.name.localeCompare(b.name)).map(item => <GuideListItem key={item.id} item={item} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400"><Store size={48} className="mb-2 opacity-20"/><p>Nenhum local encontrado.</p></div>
          )}
        </div>
      )}

      {/* CALL TO ACTION - ENVIAR LOCAL */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 md:p-8 text-center shadow-sm">
        <h3 className="font-black text-indigo-900 text-xl mb-2">Sabe de algum local que não está na lista?</h3>
        <p className="text-indigo-700 text-sm mb-6 max-w-lg mx-auto">Ajude nossa comunidade a crescer! Envie as informações do comércio e, após nossa aprovação, ele fará parte do guia oficial da cidade.</p>
        <button onClick={handleOpenModal} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-bold shadow-md shadow-indigo-200 transition hover:-translate-y-0.5">
          <PlusCircle size={20}/> Cadastrar Estabelecimento
        </button>
      </div>

      {/* MODAL DE CADASTRO PÚBLICO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95">
             <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:bg-slate-100 p-2 rounded-full transition"><X size={20}/></button>
             
             <h2 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-2">
               <Store className="text-indigo-600"/> Cadastrar Local
             </h2>
             <p className="text-xs text-slate-500 mb-6">Preencha os dados abaixo. O local será analisado antes de ser publicado.</p>

             <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Nome do Estabelecimento *</label>
                  <input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none" required />
               </div>
               
               <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Categoria *</label>
                  <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none" required>
                    <option value="">Selecione uma categoria...</option>
                    {GUIDE_CATEGORIES.sort().map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
               </div>

               <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Telefone / WhatsApp</label>
                  <input value={newItem.phone} onChange={e => setNewItem({...newItem, phone: e.target.value})} placeholder="Ex: (31) 99999-9999" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none" />
               </div>

               <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Endereço Completo</label>
                  <input value={newItem.address} onChange={e => setNewItem({...newItem, address: e.target.value})} placeholder="Rua, Número, Bairro" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none" />
               </div>

               {/* NOVO CAMPO: MAPA PARA MARCAR A LOCALIZAÇÃO */}
               <div>
                 <label className="block text-xs font-bold text-slate-600 mb-1">Localização no Mapa</label>
                 <div className="h-48 rounded-xl overflow-hidden border border-slate-200">
                   <LocationPicker 
                     lat={newItem.location.lat} 
                     lng={newItem.location.lng} 
                     onChange={(location) => setNewItem({ ...newItem, location })} 
                   />
                 </div>
                 <p className="text-[10px] text-slate-500 mt-1">Arraste o marcador para o local exato da empresa.</p>
               </div>

               <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Foto da Fachada ou Logotipo (Opcional)</label>
                  <label className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 p-4 rounded-xl cursor-pointer transition">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0"><Upload size={18}/></div>
                    <span className="text-sm text-slate-500">{newItem.image ? 'Imagem selecionada! Clique para trocar.' : 'Clique para escolher uma imagem do seu celular/PC'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  {newItem.image && <img src={newItem.image} alt="Preview" className="mt-3 h-24 rounded-lg object-cover border border-slate-200" />}
               </div>

               <button disabled={isSubmitting} type="submit" className="w-full mt-4 bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 disabled:bg-slate-400 transition">
                 {isSubmitting ? 'Enviando...' : 'Enviar para Aprovação'}
               </button>
             </form>
          </div>
        </div>
      )}

    </div>
  );
}