import React, { useState } from 'react';
import { Trash2, PlusCircle } from 'lucide-react';

export default function AdminPage({ newsData, eventsData, propertiesData, jobsData, vehiclesData, guideData, adsData, offersData, crud }) {
  const [activeTab, setActiveTab] = useState('offers');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Função genérica para listar os outros itens do site (Notícias, Eventos, etc)
  const renderList = (data, titleField, deleteFunc) => (
    <div className="space-y-3 mt-4">
      {data && data.length > 0 ? data.map(item => (
        <div key={item.id} className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <span className="font-medium text-slate-800">{item[titleField] || item.title || item.name || 'Item sem título'}</span>
          <button onClick={() => { if(window.confirm('Tem certeza que deseja excluir?')) deleteFunc(item.id); }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      )) : <p className="text-slate-500 text-center py-8">Nenhum item cadastrado nesta categoria.</p>}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
      
      {/* MENU DE ABAS DO ADMIN */}
      <div className="flex overflow-x-auto bg-slate-50 border-b border-slate-200 scrollbar-hide">
        {[
          { id: 'offers', label: 'Shopping / Ofertas' },
          { id: 'news', label: 'Notícias' },
          { id: 'events', label: 'Eventos' },
          { id: 'real_estate', label: 'Imóveis' },
          { id: 'jobs', label: 'Vagas' },
          { id: 'vehicles', label: 'Veículos' },
          { id: 'guide', label: 'Guia Comercial' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-b-2 border-indigo-600 text-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        
        {/* === ABA EXCLUSIVA DE OFERTAS === */}
        {activeTab === 'offers' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-black text-slate-800">Gerenciar Banco de Ofertas</h2>
              <button onClick={() => { setEditingItem({ category: 'bestsellers' }); setModalOpen(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 w-full md:w-auto justify-center">
                <PlusCircle size={18}/> Adicionar Manualmente
              </button>
            </div>
            
            {/* GRID DAS OFERTAS PARA VOCÊ EXCLUIR/VER */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {offersData?.map(item => (
                <div key={item.id} className="flex gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50 relative group hover:border-indigo-200 transition-colors">
                  <img src={item.image} alt="Produto" className="w-20 h-20 object-contain bg-white rounded-lg border border-slate-200 p-1"/>
                  <div className="flex-1 min-w-0 pr-8">
                    <h3 className="font-bold text-slate-800 text-sm line-clamp-2" title={item.title}>{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">{item.category}</p>
                    <p className="text-sm font-black text-indigo-600 mt-1">
                      {Number(item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                  
                  {/* BOTÃO DE EXCLUIR */}
                  <button onClick={() => { if(window.confirm('Excluir oferta definitivamente?')) crud.deleteOffer(item.id); }} className="absolute top-4 right-4 p-2 bg-white text-red-600 hover:bg-red-50 rounded-lg shadow-sm border border-slate-200 transition-colors" title="Excluir Oferta">
                    <Trash2 size={18}/>
                  </button>
                </div>
              ))}
              {(!offersData || offersData.length === 0) && <p className="text-slate-400 col-span-full text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">Nenhuma oferta cadastrada no banco de dados.</p>}
            </div>
          </div>
        )}

        {/* RENDERIZAÇÃO DAS OUTRAS ABAS */}
        {activeTab === 'news' && renderList(newsData, 'title', crud.deleteNews)}
        {activeTab === 'events' && renderList(eventsData, 'title', crud.deleteEvent)}
        {activeTab === 'real_estate' && renderList(propertiesData, 'title', crud.deleteProperty)}
        {activeTab === 'jobs' && renderList(jobsData, 'title', crud.deleteJob)}
        {activeTab === 'vehicles' && renderList(vehiclesData, 'title', crud.deleteVehicle)}
        {activeTab === 'guide' && renderList(guideData, 'name', crud.deleteGuideItem)}
      </div>

      {/* MODAL DE ADICIONAR OFERTA MANUALMENTE */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-black text-slate-800 mb-4">Adicionar Oferta Manual</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              crud.addOffer({ ...editingItem, date: new Date().toISOString() });
              setModalOpen(false); setEditingItem(null);
            }} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoria (Subgrupo)</label>
                <select value={editingItem.category || 'bestsellers'} onChange={e => setEditingItem({...editingItem, category: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600">
                  <option value="bestsellers">Ofertas do dia (Destaque geral)</option>
                  <optgroup label="Tecnologia">
                    <option value="celulares">Celulares e Telefones</option>
                    <option value="informatica">Informática</option>
                    <option value="cameras">Câmeras e Acessórios</option>
                    <option value="eletronicos">Áudio, Vídeo e Eletrônicos</option>
                    <option value="games">Games e Consoles</option>
                    <option value="tvs">Televisores</option>
                  </optgroup>
                  <optgroup label="Outras Categorias">
                    <option value="casa">Casa e Móveis</option>
                    <option value="supermercado">Supermercado</option>
                    <option value="eletro">Eletrodomésticos</option>
                    <option value="ferramentas">Ferramentas</option>
                    <option value="construcao">Construção</option>
                    <option value="moda">Moda e Beleza</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título do Produto</label>
                <input value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" required/>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Preço Atual</label>
                   <input type="number" step="0.01" value={editingItem.price || ''} onChange={e => setEditingItem({...editingItem, price: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" required/>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Preço Antigo (Opcional)</label>
                   <input type="number" step="0.01" value={editingItem.originalPrice || ''} onChange={e => setEditingItem({...editingItem, originalPrice: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"/>
                 </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Link da Imagem</label>
                <input value={editingItem.image || ''} onChange={e => setEditingItem({...editingItem, image: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" required/>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Link de Afiliado</label>
                <input value={editingItem.link || ''} onChange={e => setEditingItem({...editingItem, link: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" required/>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors">Salvar Oferta</button>
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}