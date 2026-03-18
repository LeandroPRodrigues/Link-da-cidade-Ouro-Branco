import React, { useState } from 'react';
import { Upload, Loader, AlertTriangle } from 'lucide-react';
import { uploadFile } from '../utils/uploadHelper';

export default function ClassifiedForm({ initialData, onSuccess, onCancel, user }) {
  const [formData, setFormData] = useState(initialData || {
    title: '', category: 'Eletrônicos & Celulares', price: '', description: '', image: '', contact: user?.phone || ''
  });
  
  const [isUploading, setIsUploading] = useState(false);

  const handleLocalImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        const url = await uploadFile(file, 'classifieds_images');
        if (url) setFormData({...formData, image: url});
      } catch (error) {
        alert("Erro ao fazer upload da imagem.");
      } finally {
        setIsUploading(false);
      }
    }
    e.target.value = null; 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isUploading) return alert("Aguarde o envio da imagem terminar.");
    onSuccess(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {/* AVISO DE REGRAS DA COMUNIDADE */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex gap-3 items-start">
        <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-red-800">
          <strong>Regras da Comunidade:</strong> É estritamente proibida a publicação de itens ilícitos, drogas, armas, pornografia, serviços de prostituição ou qualquer conteúdo ofensivo. Anúncios irregulares serão excluídos e o usuário banido do portal.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título do Anúncio</label>
          <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: iPhone 13 128GB Usado" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoria</label>
          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600">
            <option value="Eletrônicos & Celulares">Eletrônicos & Celulares</option>
            <option value="Móveis & Decoração">Móveis & Decoração</option>
            <option value="Eletrodomésticos">Eletrodomésticos</option>
            <option value="Moda & Vestuário">Moda & Vestuário</option>
            <option value="Serviços Gerais">Serviços Gerais</option>
            <option value="Ferramentas & Construção">Ferramentas & Construção</option>
            <option value="Artigos Infantis">Artigos Infantis</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Preço (R$)</label>
          <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Ex: 150.00 (Deixe 0 se for a combinar)" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Telefone / WhatsApp (Contato)</label>
          <input required value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} placeholder="(31) 99999-9999" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descrição Detalhada</label>
        <textarea required rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Descreva o estado do produto, tempo de uso ou detalhes do serviço oferecido..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Foto do Produto ou Serviço (Upload ou URL)</label>
        <div className="flex gap-2">
          <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="Link da foto..." className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" />
          <label className={`bg-slate-200 hover:bg-slate-300 text-slate-700 p-3 rounded-xl cursor-pointer flex items-center justify-center transition ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {isUploading ? <Loader size={20} className="animate-spin" /> : <Upload size={20} />}
            <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={handleLocalImageUpload} />
          </label>
        </div>
        {isUploading && <p className="text-xs text-indigo-600 mt-1 font-bold">Enviando imagem, aguarde...</p>}
        {formData.image && !isUploading && <img src={formData.image} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-xl border border-slate-200"/>}
      </div>

      <div className="flex gap-3 pt-6 border-t border-slate-100">
        <button type="submit" className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-xl hover:bg-indigo-700 transition shadow-md">
          {initialData?.id ? 'Atualizar Anúncio' : 'Publicar Anúncio'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 transition">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}