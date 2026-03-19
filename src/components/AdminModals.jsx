import React from 'react';
import { X, Upload, Loader, Type, Heading, Image as ImageIcon, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import PropertyForm from './PropertyForm';
import VehicleForm from './VehicleForm';
import LocationPicker from './LocationPicker';

// ==========================================
// 1. MODAL DE EDIÇÃO DE USUÁRIOS
// ==========================================
export const AdminUserModal = ({ editingUser, setEditingUser, handleSaveUser }) => {
  if (!editingUser) return null;

  return (
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
  );
};

// ==========================================
// 2. MODAL GERAL DE EDIÇÃO/CRIAR ANÚNCIOS
// ==========================================
export const AdminEditModal = ({ 
  modalOpen, setModalOpen, activeTab, editingItem, setEditingItem, 
  handleFormSubmit, isUploading, crud, newsBlocks, setNewsBlocks, 
  handleLocalImageUpload, handleNewsMultiImageUpload, 
  addNewsBlock, updateNewsBlockField, removeNewsBlock, moveNewsBlock 
}) => {
  if (!modalOpen) return null;

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
      <div key={field} className="border border-slate-200 rounded-xl p-4 bg-slate-50 mt-4 mb-4">
        <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{label}</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input value={val} onChange={onChange} className="flex-1 p-3 bg-white border border-slate-200 rounded-lg focus:border-indigo-600 outline-none" placeholder="Cole o Link da imagem..." required={required && !val}/>
          <label className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {isUploading ? <Loader size={20} className="animate-spin"/> : <Upload size={20} />}
            <span className="text-sm">Upload do PC/Celular</span>
            {/* Aqui fazemos o upload real para o banco de dados (Firebase Storage) */}
            <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={(e) => handleLocalImageUpload(e, (url) => setEditingItem({...editingItem, [field]: url}))} />
          </label>
        </div>
        {isUploading && <p className="text-xs text-indigo-600 mt-2 font-bold flex items-center gap-1"><Loader size={12} className="animate-spin"/> Enviando imagem, aguarde...</p>}
        {val && !isUploading && <img src={val} alt="Preview" className="mt-4 h-32 w-auto max-w-full object-contain rounded-lg border border-slate-200 bg-white p-1 shadow-sm"/>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto custom-scrollbar relative shadow-xl">
        <button onClick={() => setModalOpen(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition z-10"><X size={24} /></button>
        
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
            <button onClick={() => setModalOpen(false)} className="w-full mt-3 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">Cancelar e Voltar</button>
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
                {renderImagePicker("Foto do Produto")}
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
                {renderImagePicker("Capa do Evento")}
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

            {activeTab === 'guide' && (
              <>
                {renderField("Nome do Estabelecimento", "name", "text", true)}
                <div className="grid grid-cols-2 gap-4">
                  {renderField("Categoria", "category", "select", true, ["Saúde & Bem-estar", "Emergência & Serviços Públicos", "Educação & Ensino", "Supermercados & Alimentação", "Automotivo & Transportes", "Construção & Casa", "Bancos & Financeiro", "Hotéis & Pousadas", "Religião & Igrejas", "Esportes & Academias", "Beleza & Estética", "Outros"])}
                  {renderField("Telefone / Celular", "phone")}
                </div>
                
                {/* --- SEÇÃO DO MAPA CORRIGIDA (SEM CAMPO DE ENDEREÇO DUPLICADO) --- */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 mt-4 mb-4">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-3">Endereço e Localização Exata</label>
                  <LocationPicker 
                    locationData={{ 
                      address: editingItem?.address || '', 
                      lat: editingItem?.location?.lat || -20.5236, 
                      lng: editingItem?.location?.lng || -43.6914,
                      privacy: 'exact'
                    }} 
                    setLocationData={(data) => setEditingItem({ 
                      ...editingItem, 
                      address: data.address, 
                      location: { lat: data.lat, lng: data.lng, privacy: 'exact' } 
                    })} 
                    variant="guide" 
                  />
                  <p className="text-[10px] text-slate-500 mt-2 text-center">
                    Busque o endereço e arraste o marcador para o local exato da empresa.
                  </p>
                </div>
                
                {renderField("Breve Descrição (Opcional)", "description", "textarea")}
                
                {/* O renderImagePicker já possui opção de link e upload de foto juntos! */}
                {renderImagePicker("Logotipo ou Foto da Fachada", "image")}
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
                              <div className="flex flex-col sm:flex-row gap-2">
                                <input value={Array.isArray(block.value) ? block.value.join(', ') : (block.value || '')} onChange={(e) => { const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean); updateNewsBlockField(block.id, 'value', arr.length > 0 ? arr : ''); }} className="flex-1 p-3 bg-white border border-slate-200 rounded-lg focus:border-indigo-600 outline-none" placeholder="Cole URLs separadas por vírgula (ou faça upload)..." required={!(block.value && block.value.length > 0)} />
                                <label className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                  {isUploading ? <Loader size={20} className="animate-spin"/> : <Upload size={20} />}
                                  <span className="text-sm">Upload</span>
                                  <input type="file" multiple accept="image/*" className="hidden" disabled={isUploading} onChange={(e) => handleNewsMultiImageUpload(e, block.id, block.value)} />
                                </label>
                              </div>
                              {(Array.isArray(block.value) ? block.value : (block.value ? [block.value] : [])).length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-2 mb-2 p-3 bg-white border border-slate-200 rounded-lg">
                                  {(Array.isArray(block.value) ? block.value : (block.value ? [block.value] : [])).map((imgUrl, i) => (
                                    <div key={i} className="relative group w-24 h-24">
                                       <img src={imgUrl} alt={`Preview ${i}`} className="w-full h-full object-cover rounded-md border border-slate-200" />
                                       <button type="button" onClick={() => { const currentArr = Array.isArray(block.value) ? block.value : [block.value]; const newArr = currentArr.filter((_, index) => index !== i); updateNewsBlockField(block.id, 'value', newArr.length > 0 ? newArr : ''); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-sm"><X size={14} /></button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <input value={block.caption || ''} onChange={(e) => updateNewsBlockField(block.id, 'caption', e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:border-indigo-600 outline-none text-sm italic" placeholder="Legenda da foto ou do carrossel (Opcional)..." />
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
  );
};