import React, { useState } from 'react';
import LocationPicker from './LocationPicker';
import { Upload, Loader } from 'lucide-react';
import { uploadFile } from '../utils/uploadHelper';

export default function PropertyForm({ initialData, onSuccess, onCancel, isAdmin }) {
  const [formData, setFormData] = useState(initialData || {
    title: '', type: 'Venda', price: '', bedrooms: '', bathrooms: '', 
    garage: '', area: '', description: '', image: '', 
    address: '', lat: null, lng: null, featured: false
  });
  
  const [isUploading, setIsUploading] = useState(false);

  const handleLocalImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        const url = await uploadFile(file, 'properties_images');
        if (url) {
          setFormData({...formData, image: url});
        }
      } catch (error) {
        console.error(error);
        alert("Erro ao fazer upload da imagem. Verifique se o arquivo não é muito grande ou sua conexão.");
      } finally {
        setIsUploading(false);
      }
    }
    e.target.value = null; 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isUploading) {
       alert("Aguarde o envio da imagem terminar.");
       return;
    }
    if (!formData.lat) {
      alert("Por favor, selecione ou digite a localização no mapa antes de salvar.");
      return;
    }
    const finalData = { ...formData, photos: formData.image ? [formData.image] : [] };
    onSuccess(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título do Anúncio</label>
          <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo</label>
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600">
              <option value="Venda">Venda</option>
              <option value="Aluguel">Aluguel</option>
              <option value="Temporada">Temporada</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Preço (R$)</label>
            <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Quartos</label><input type="number" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" /></div>
        <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Banh.</label><input type="number" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" /></div>
        <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vagas</label><input type="number" value={formData.garage} onChange={e => setFormData({...formData, garage: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" /></div>
        <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Área m²</label><input type="number" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" /></div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descrição do Imóvel</label>
        <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Foto Principal (URL ou Upload)</label>
        <div className="flex gap-2">
          <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="Link da foto..." className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" />
          <label className={`bg-slate-200 hover:bg-slate-300 text-slate-700 p-3 rounded-xl cursor-pointer flex items-center justify-center transition ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {isUploading ? <Loader size={20} className="animate-spin" /> : <Upload size={20} />}
            <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={handleLocalImageUpload} />
          </label>
        </div>
        {isUploading && <p className="text-xs text-indigo-600 mt-1 font-bold">Enviando imagem, aguarde...</p>}
        {formData.image && !isUploading && <img src={formData.image} alt="Preview" className="mt-2 h-24 w-full object-cover rounded-xl"/>}
      </div>

      {isAdmin && (
        <div className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl mt-4">
          <input type="checkbox" id="featured" checked={formData.featured || false} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
          <label htmlFor="featured" className="text-sm font-bold text-indigo-900 cursor-pointer select-none">Destacar este imóvel na Página Inicial (Apenas Admin)</label>
        </div>
      )}

      <div className="pt-4 border-t border-slate-100 mt-4">
        <LocationPicker 
          locationData={{ address: formData.address, lat: formData.lat, lng: formData.lng }}
          setLocationData={(data) => setFormData({ ...formData, address: data.address, lat: data.lat, lng: data.lng })}
        />
      </div>

      <div className="flex gap-3 pt-6">
        <button type="submit" className="flex-1 bg-emerald-600 text-white font-black py-4 rounded-xl hover:bg-emerald-700 transition shadow-md">
          {initialData?.id ? 'Atualizar Imóvel' : 'Publicar Imóvel'}
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