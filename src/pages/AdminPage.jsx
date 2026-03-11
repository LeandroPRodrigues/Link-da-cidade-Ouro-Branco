import React, { useState } from 'react';
import { Trash2, PlusCircle, ArrowUp, ArrowDown, Image as ImageIcon, Type, Heading, Upload } from 'lucide-react';

export default function AdminPage({ newsData, eventsData, propertiesData, jobsData, vehiclesData, guideData, adsData, offersData, crud }) {
  const [activeTab, setActiveTab] = useState('offers');
  const [modalOpen, setModalOpen] = useState(false);
  
  const [editingItem, setEditingItem] = useState(null);
  const [newsBlocks, setNewsBlocks] = useState([]);

  // ==========================================
  // FUNÇÃO DE IMPORTAÇÃO DE CSV (COM AUTO-DETECÇÃO DE ACENTOS)
  // ==========================================
  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    // A MUDANÇA: Lemos o arquivo como dados brutos (Buffer) para podermos consertar os acentos
    reader.onload = async (event) => {
      const buffer = event.target.result;
      
      // 1. Tenta ler no padrão da internet (UTF-8)
      let text = new TextDecoder('utf-8').decode(buffer);
      
      // 2. Se o texto contiver o símbolo de erro de acento (), o arquivo veio do Excel padrão Brasil.
      // Então, trocamos a lente e lemos novamente usando o padrão do Windows!
      if (text.includes('')) {
        text = new TextDecoder('windows-1252').decode(buffer);
      }

      // 3. Limpeza de formatação invisível
      text = text.replace(/^\uFEFF/, '');
      
      // Divide as linhas independentemente de estar no Windows, Mac ou Linux
      const lines = text.split(/\r?\n/);
      
      if (lines.length < 2) return alert("Arquivo CSV vazio ou sem dados suficientes.");

      const separator = lines[0].includes(';') ? ';' : ',';
      
      const headers = lines[0].toLowerCase().split(separator).map(h => 
        h.trim().replace(/^"|"$/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      );
      
      const validCategories = [
        "Saúde & Bem-estar", "Emergência & Serviços Públicos", "Educação & Ensino",
        "Supermercados & Alimentação", "Automotivo & Transportes", "Construção & Casa",
        "Bancos & Financeiro", "Hotéis & Pousadas", "Religião & Igrejas",
        "Esportes & Academias", "Beleza & Estética", "Outros"
      ];

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
           item = {
              category: findCategory(values[0]),
              name: values[1],
              phone: values[2] || '',
              address: values[3] || '',
              image: values[4] || '',
              date: new Date().toISOString()
           };
        }

        if (item.name) {
           if (!item.category) item.category = 'Outros';
           newItems.push(item);
        }
      }

      if (newItems.length === 0) return alert("Nenhum local válido encontrado no CSV.");
      
      if (window.confirm(`Foram encontrados ${newItems.length} locais.\nDeseja iniciar a importação?`)) {
         try {
           for (const item of newItems) {
             await crud.addGuideItem(item);
           }
           alert("Importação concluída com sucesso! Verifique o Guia Comercial.");
         } catch(err) {
           console.error("Erro na importação:", err);
           alert("Ocorreu um erro durante a importação. Verifique o console.");
         }
      }
    };
    
    // A MÁGICA CONTINUA AQUI: Mandamos o FileReader ler como ArrayBuffer em vez de Texto forçado
    reader.readAsArrayBuffer(file);
    e.target.value = null;
  };

  // ==========================================
  // FUNÇÕES DO CONSTRUTOR DE NOTÍCIAS (LEGO)
  // ==========================================
  const addNewsBlock = (type) => setNewsBlocks([...newsBlocks, { id: Date.now(), type, value: '' }]);
  const updateNewsBlock = (id, newValue) => setNewsBlocks(newsBlocks.map(block => block.id === id ? { ...block, value: newValue } : block));
  const removeNewsBlock = (id) => setNewsBlocks(newsBlocks.filter(block => block.id !== id));
  const moveNewsBlock = (index, direction) => {
    const newBlocks = [...newsBlocks];
    if (direction === 'up' && index > 0) [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
    else if (direction === 'down' && index < newBlocks.length - 1) [newBlocks[index + 1], newBlocks[index]] = [newBlocks[index], newBlocks[index + 1]];
    setNewsBlocks(newBlocks);
  };

  const handleLocalImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const renderList = (data, titleField, deleteFunc) => (
    <div className="space-y-3 mt-4">
      {data && data.length > 0 ? data.map(item => (
        <div key={item.id} className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col">
             <span className="font-bold text-slate-800">{item[titleField] || item.title || item.name || 'Item sem título'}</span>
             {item.category && <span className="text-[10px] text-indigo-600 font-bold uppercase">{item.category}</span>}
          </div>
          <button onClick={() => { if(window.confirm('Tem certeza que deseja excluir?')) deleteFunc(item.id); }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      )) : <p className="text-slate-500 text-center py-8">Nenhum item cadastrado nesta categoria.</p>}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
      
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
        
        {/* === ABA DO GUIA COMERCIAL === */}
        {activeTab === 'guide' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-black text-slate-800">Gerenciar Guia Comercial</h2>
              
              <div className="flex gap-2 w-full md:w-auto">
                <label className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition cursor-pointer shadow-sm flex-1 md:flex-none">
                  <Upload size={18}/> Importar Planilha CSV
                  <input type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
                </label>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs p-3 rounded-lg mb-4 flex items-start gap-2">
              <span className="font-bold uppercase tracking-wider mt-0.5">Aviso:</span>
              <p>O seu arquivo CSV deve ter as colunas separadas por vírgula (,) ou ponto e vírgula (;).<br/>
              A primeira linha deve conter os títulos: <strong>Categoria, Nome, Telefone, Endereco, Imagem</strong>.</p>
            </div>
            
            {renderList(guideData, 'name', crud.deleteGuideItem)}
          </div>
        )}

        {/* === ABA DE OFERTAS === */}
        {activeTab === 'offers' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-black text-slate-800">Gerenciar Banco de Ofertas</h2>
              <button onClick={() => { setEditingItem({ category: 'bestsellers' }); setModalOpen(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 w-full md:w-auto justify-center">
                <PlusCircle size={18}/> Adicionar Manualmente
              </button>
            </div>
            
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
                  <button onClick={() => { if(window.confirm('Excluir oferta?')) crud.deleteOffer(item.id); }} className="absolute top-4 right-4 p-2 bg-white text-red-600 hover:bg-red-50 rounded-lg shadow-sm border border-slate-200 transition-colors" title="Excluir Oferta">
                    <Trash2 size={18}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === ABA DE NOTÍCIAS === */}
        {activeTab === 'news' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-black text-slate-800">Gerenciar Notícias</h2>
              <button onClick={() => { 
                setEditingItem({ isOfficial: false, author: 'Redação', category: 'Cidade' }); 
                setNewsBlocks([]); 
                setModalOpen(true); 
              }} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 w-full md:w-auto justify-center">
                <PlusCircle size={18}/> Nova Notícia
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {newsData?.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50 relative group hover:border-indigo-200 transition-colors">
                  {item.image && <img src={item.image} alt="Capa" className="w-full sm:w-32 h-24 object-cover bg-white rounded-lg border border-slate-200"/>}
                  <div className="flex-1 min-w-0 pr-8">
                    <h3 className="font-bold text-slate-800 text-base line-clamp-2" title={item.title}>{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {item.author} • {item.date ? new Date(item.date).toLocaleDateString('pt-BR') : 'Sem data'}
                    </p>
                    {item.isOfficial && (
                      <span className="inline-block mt-2 bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-1 rounded-md text-xs font-bold">Oficial da Prefeitura</span>
                    )}
                  </div>
                  <button onClick={() => { if(window.confirm('Excluir notícia?')) crud.deleteNews(item.id); }} className="absolute top-4 right-4 p-2 bg-white text-red-600 hover:bg-red-50 rounded-lg shadow-sm border border-slate-200 transition-colors">
                    <Trash2 size={18}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OUTRAS ABAS */}
        {activeTab === 'events' && renderList(eventsData, 'title', crud.deleteEvent)}
        {activeTab === 'real_estate' && renderList(propertiesData, 'title', crud.deleteProperty)}
        {activeTab === 'jobs' && renderList(jobsData, 'title', crud.deleteJob)}
        {activeTab === 'vehicles' && renderList(vehiclesData, 'title', crud.deleteVehicle)}
      </div>

      {/* ======================================================== */}
      {/* MODAL DE CADASTRO (DINÂMICO PARA OFERTAS E NOTÍCIAS) */}
      {/* ======================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-black text-slate-800 mb-6">
              {activeTab === 'offers' ? 'Adicionar Oferta Manual' : 'Escrever Nova Notícia'}
            </h2>
            
            {/* -------------------- FORMULÁRIO DE OFERTAS -------------------- */}
            {activeTab === 'offers' && (
              <form onSubmit={(e) => {
                e.preventDefault();
                crud.addOffer({ ...editingItem, date: new Date().toISOString() });
                setModalOpen(false); setEditingItem(null);
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoria (Subgrupo)</label>
                  <select value={editingItem.category || 'bestsellers'} onChange={e => setEditingItem({...editingItem, category: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600">
                    <option value="bestsellers">Ofertas do dia</option>
                    <option value="celulares">Celulares</option>
                    <option value="tvs">TVs</option>
                    <option value="informatica">Informática</option>
                  </select>
                </div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título</label><input value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" required/></div>
                <div className="grid grid-cols-2 gap-4">
                   <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Preço Atual</label><input type="number" step="0.01" value={editingItem.price || ''} onChange={e => setEditingItem({...editingItem, price: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" required/></div>
                   <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Preço Antigo</label><input type="number" step="0.01" value={editingItem.originalPrice || ''} onChange={e => setEditingItem({...editingItem, originalPrice: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"/></div>
                </div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Link da Imagem</label><input value={editingItem.image || ''} onChange={e => setEditingItem({...editingItem, image: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" required/></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Link de Afiliado</label><input value={editingItem.link || ''} onChange={e => setEditingItem({...editingItem, link: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" required/></div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700">Salvar Oferta</button>
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200">Cancelar</button>
                </div>
              </form>
            )}

            {/* -------------------- FORMULÁRIO DE NOTÍCIAS -------------------- */}
            {activeTab === 'news' && (
              <form onSubmit={(e) => {
                e.preventDefault();
                crud.addNews({ 
                  ...editingItem, 
                  content: newsBlocks,
                  date: new Date().toISOString() 
                });
                setModalOpen(false); setEditingItem(null); setNewsBlocks([]);
              }} className="space-y-6">
                
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-4">
                  <h3 className="font-bold text-slate-700 border-b border-slate-200 pb-2">Cabeçalho da Matéria</h3>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título Principal</label>
                    <input value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-lg font-bold text-lg focus:border-indigo-600 outline-none" required/>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Linha Fina (Resumo itálico)</label>
                    <textarea value={editingItem.summary || ''} onChange={e => setEditingItem({...editingItem, summary: e.target.value})} rows="2" className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:border-indigo-600 outline-none" required/>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Imagem de Capa (URL ou Upload)</label>
                    <div className="flex gap-2">
                      <input value={editingItem.image || ''} onChange={e => setEditingItem({...editingItem, image: e.target.value})} className="flex-1 p-3 bg-white border border-slate-200 rounded-lg focus:border-indigo-600 outline-none" required/>
                      <label className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-3 rounded-lg cursor-pointer flex items-center justify-center transition-colors">
                        <Upload size={20} />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLocalImageUpload(e, (base64) => setEditingItem({...editingItem, image: base64}))} />
                      </label>
                    </div>
                    {editingItem.image && <img src={editingItem.image} alt="Preview Capa" className="mt-2 h-32 w-full object-cover rounded-lg border border-slate-200"/>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoria</label>
                      <input value={editingItem.category || ''} onChange={e => setEditingItem({...editingItem, category: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:border-indigo-600 outline-none" required/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Autor / Fonte</label>
                      <input value={editingItem.author || ''} onChange={e => setEditingItem({...editingItem, author: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:border-indigo-600 outline-none" required/>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-700 mb-3 flex items-center justify-between">
                    Corpo da Matéria
                  </h3>
                  
                  <div className="space-y-4 mb-4">
                    {newsBlocks.map((block, index) => (
                      <div key={block.id} className="flex gap-2 items-start bg-slate-50 p-3 border border-slate-200 rounded-xl relative group">
                        <div className="flex flex-col gap-1 mt-1">
                          <button type="button" onClick={() => moveNewsBlock(index, 'up')} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700"><ArrowUp size={16}/></button>
                          <button type="button" onClick={() => moveNewsBlock(index, 'down')} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700"><ArrowDown size={16}/></button>
                          <button type="button" onClick={() => removeNewsBlock(block.id)} className="p-1 hover:bg-red-100 rounded text-red-400 hover:text-red-600 mt-2"><Trash2 size={16}/></button>
                        </div>
                        <div className="flex-1 w-full">
                          {block.type === 'paragraph' && <textarea value={block.value} onChange={(e) => updateNewsBlock(block.id, e.target.value)} rows="4" className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:border-indigo-600 outline-none" placeholder="Escreva o parágrafo..." required/>}
                          {block.type === 'subtitle' && <input value={block.value} onChange={(e) => updateNewsBlock(block.id, e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-lg font-bold text-lg focus:border-indigo-600 outline-none" placeholder="Subtítulo..." required/>}
                          {block.type === 'image' && (
                            <div className="flex gap-2">
                              <input value={block.value} onChange={(e) => updateNewsBlock(block.id, e.target.value)} className="flex-1 p-3 bg-white border border-slate-200 rounded-lg focus:border-indigo-600 outline-none" placeholder="URL da imagem..." required/>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 border-t border-dashed border-slate-300 pt-4">
                    <button type="button" onClick={() => addNewsBlock('paragraph')} className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-bold text-sm"><Type size={16}/> + Parágrafo</button>
                    <button type="button" onClick={() => addNewsBlock('subtitle')} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm"><Heading size={16}/> + Subtítulo</button>
                    <button type="button" onClick={() => addNewsBlock('image')} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm"><ImageIcon size={16}/> + Imagem</button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-md">Publicar Notícia</button>
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}