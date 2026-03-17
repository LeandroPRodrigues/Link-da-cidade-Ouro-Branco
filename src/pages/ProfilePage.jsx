import React, { useState } from 'react';
import { User, Home, Car, Briefcase, Trash2, RefreshCw, AlertTriangle, CheckCircle, Clock, Save } from 'lucide-react';

export default function ProfilePage({ user, db, setUser, onBack, propertiesData, vehiclesData, jobsData, crud }) {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Função para salvar alterações no nome e telefone
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const updatedData = { name: e.target.name.value, phone: e.target.phone.value };
    await db.updateUserProfile(user.id, updatedData);
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('app_user', JSON.stringify(newUser));
    alert('Perfil atualizado com sucesso!');
  };

  // Função para calcular os dias restantes (Ativo / Inativo / Excluir)
  const getExpirationInfo = (item, type) => {
    const updated = new Date(item.updatedAt || item.createdAt || item.date || 0).getTime();
    const now = new Date().getTime();
    const diffDays = (now - updated) / (1000 * 60 * 60 * 24);
    
    const isSeasonal = type === 'property' && item.type === 'Temporada';
    const maxActive = isSeasonal ? 90 : 30;
    const maxDelete = isSeasonal ? 120 : 60;
    
    return {
        isActive: diffDays <= maxActive,
        daysLeft: Math.max(0, Math.ceil(maxActive - diffDays)),
        daysToDelete: Math.max(0, Math.ceil(maxDelete - diffDays))
    };
  };

  // Filtra apenas os anúncios que pertencem ao usuário logado
  const myProperties = (propertiesData || []).filter(p => p.ownerId === user.id);
  const myVehicles = (vehiclesData || []).filter(v => v.ownerId === user.id);
  const myJobs = (jobsData || []).filter(j => j.ownerId === user.id);

  const renderItemsList = (items, type, deleteFn, updateFn) => {
    if (!items || items.length === 0) return (
      <p className="text-slate-500 py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
        Você ainda não possui anúncios nesta categoria.
      </p>
    );

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm mb-6 flex items-start gap-3 border border-blue-100">
          <Clock size={20} className="shrink-0 mt-0.5" />
          <p>
            <strong>Atenção:</strong> Seus anúncios ficam ativos e visíveis para o público por 
            {type === 'property' ? ' 30 dias (90 dias para imóveis de Temporada)' : ' 30 dias'}. 
            Após este período, eles ficam inativos. Se não forem renovados num prazo adicional de 30 dias, serão <strong>excluídos permanentemente</strong> do sistema para manter a plataforma sempre limpa.
          </p>
        </div>
        
        {items.map(item => {
          const info = getExpirationInfo(item, type);
          return (
            <div key={item.id} className={`border ${info.isActive ? 'border-slate-200' : 'border-red-200 bg-red-50/30'} rounded-xl p-4 bg-white flex flex-col md:flex-row gap-4 justify-between items-start md:items-center shadow-sm`}>
              <div className="flex items-center gap-4">
                {(item.photos?.[0] || item.image) ? (
                  <img src={item.photos?.[0] || item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg shrink-0 border border-slate-100" />
                ) : (
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 shrink-0 border border-slate-200">
                    {type === 'property' ? <Home size={24}/> : type === 'vehicle' ? <Car size={24}/> : <Briefcase size={24}/>}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-slate-800 line-clamp-1">{item.title}</h3>
                  {info.isActive ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
                      <CheckCircle size={14}/> Ativo (Visível por mais {info.daysLeft} dias)
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-red-600 flex items-center gap-1 mt-1">
                      <AlertTriangle size={14}/> Inativo (Exclusão definitiva em {info.daysToDelete} dias)
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button onClick={() => {
                  updateFn({...item, updatedAt: new Date().toISOString()});
                  alert("Anúncio renovado com sucesso! Ele já voltou ao topo das listas.");
                }} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2.5 rounded-xl text-sm font-bold transition border border-indigo-100">
                  <RefreshCw size={16}/> Renovar
                </button>
                <button onClick={() => { 
                  if(window.confirm('Tem a certeza que deseja excluir este anúncio definitivamente?')) deleteFn(item.id); 
                }} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-sm font-bold transition border border-red-200">
                  <Trash2 size={16}/> Excluir
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
        
        {/* MENU DE ABAS DO USUÁRIO */}
        <div className="flex overflow-x-auto bg-slate-50 border-b border-slate-200 scrollbar-hide">
          <button onClick={() => setActiveTab('profile')} className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'profile' ? 'border-b-2 border-indigo-600 text-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}>
            <User size={18}/> Meu Perfil
          </button>
          <button onClick={() => setActiveTab('properties')} className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'properties' ? 'border-b-2 border-indigo-600 text-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}>
            <Home size={18}/> Meus Imóveis ({myProperties.length}/3)
          </button>
          <button onClick={() => setActiveTab('vehicles')} className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'vehicles' ? 'border-b-2 border-indigo-600 text-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}>
            <Car size={18}/> Meus Veículos ({myVehicles.length}/3)
          </button>
          <button onClick={() => setActiveTab('jobs')} className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'jobs' ? 'border-b-2 border-indigo-600 text-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}>
            <Briefcase size={18}/> Minhas Vagas ({myJobs.length}/3)
          </button>
        </div>

        <div className="p-6 md:p-8">
          
          {activeTab === 'profile' && (
            <div className="max-w-xl">
              <h2 className="text-2xl font-black text-slate-800 mb-6">Informações Pessoais</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome Completo</label>
                  <input name="name" defaultValue={user.name} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">E-mail (Não editável)</label>
                  <input value={user.email} disabled className="w-full p-3 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Telefone / WhatsApp</label>
                  <input name="phone" defaultValue={user.phone} placeholder="(31) 99999-9999" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" required />
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition">
                    <Save size={18}/> Guardar Alterações
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'properties' && (
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Meus Imóveis</h2>
              <p className="text-slate-500 mb-6 font-medium">Gerencie os seus anúncios de imóveis (Máximo de 3 cadastros).</p>
              {renderItemsList(myProperties, 'property', crud.deleteProperty, crud.updateProperty)}
            </div>
          )}

          {activeTab === 'vehicles' && (
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Meus Veículos</h2>
              <p className="text-slate-500 mb-6 font-medium">Gerencie os seus anúncios de veículos (Máximo de 3 cadastros).</p>
              {renderItemsList(myVehicles, 'vehicle', crud.deleteVehicle, crud.updateVehicle)}
            </div>
          )}

          {activeTab === 'jobs' && (
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Minhas Vagas de Emprego</h2>
              <p className="text-slate-500 mb-6 font-medium">Gerencie as vagas de emprego publicadas por si (Máximo de 3 cadastros).</p>
              {renderItemsList(myJobs, 'job', crud.deleteJob, crud.updateJob)}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}