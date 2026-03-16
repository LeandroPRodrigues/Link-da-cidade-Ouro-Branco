import React, { useState } from 'react';
import LocationPicker from './LocationPicker';
import { Upload } from 'lucide-react';

export default function PropertyForm({ initialData, onSuccess, onCancel }) {
  const [formData, setFormData] = useState(initialData || {
    title: '', type: 'Venda', price: '', bedrooms: '', bathrooms: '', 
    garage: '', area: '', description: '', image: '', 
    address: '', lat: null, lng: null
  });

  const handleLocalImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({...formData, image: reader.result});
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.lat) {
      alert("Por favor, selecione ou digite a localização no mapa antes de salvar.");
      return;
    }
    // Formata o array de fotos para o padrão do site
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
              <option>Venda</option><option>Aluguel</option>
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
          <label className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-3 rounded-xl cursor-pointer flex items-center justify-center transition">
            <Upload size={20} />
            <input type="file" accept="image/*" className="hidden" onChange={handleLocalImageUpload} />
          </label>
        </div>
        {formData.image && <img src={formData.image} alt="Preview" className="mt-2 h-24 w-full object-cover rounded-xl"/>}
      </div>

      <div className="pt-4 border-t border-slate-100">
        {/* AQUI ENTRA O NOSSO MAPA INTELIGENTE */}
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