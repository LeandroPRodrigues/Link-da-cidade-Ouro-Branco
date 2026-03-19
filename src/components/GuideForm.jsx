import React, { useState, useEffect, useRef } from 'react';
import { GUIDE_CATEGORIES } from '../data/mockData';
import LocationPicker from './LocationPicker';
import { Upload, XCircle, Link2 } from 'lucide-react'; // Ícones necessários

export default function GuideForm({ onSuccess, initialData }) {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '', 
    category: '', 
    phone: '', 
    description: '', 
    imageUrl: '' // Mantemos como opcional
  });

  const [localImage, setLocalImage] = useState({
    file: null,
    preview: initialData?.image || null
  });

  const [locationData, setLocationData] = useState({
    address: '',
    lat: null,
    lng: null,
    privacy: 'exact'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || '',
        phone: initialData.phone || '',
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || ''
      });
      
      setLocalImage({ file: null, preview: initialData.image || null });

      if (initialData.location) {
        setLocationData(initialData.location);
      } else if (initialData.address) {
        setLocationData(prev => ({ ...prev, address: initialData.address }));
      }
    }
  }, [initialData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalImage({ file: file, preview: reader.result });
        setFormData({...formData, imageUrl: ''}); // Limpa o campo de link se escolher foto local
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setLocalImage({ file: null, preview: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prioriza a imagem do upload, se não houver, usa o link
    let finalImage = localImage.preview || formData.imageUrl;

    const payload = {
      ...formData,
      address: locationData.address,
      location: locationData,
      id: initialData ? initialData.id : Date.now(),
      image: finalImage || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400"
    };
    onSuccess(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label font-semibold">Nome do Estabelecimento *</label>
        <input 
          required 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})} 
          className="input w-full font-bold" 
          placeholder="Ex: Farmácia Central"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label font-semibold">Categoria *</label>
          <select 
            required 
            value={formData.category} 
            onChange={e => setFormData({...formData, category: e.target.value})} 
            className="input w-full bg-white"
          >
            <option value="">Selecione...</option>
            {GUIDE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label className="label font-semibold">Telefone / WhatsApp *</label>
          <input 
            required 
            value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})} 
            className="input w-full" 
            placeholder="(31) 99999-9999"
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mt-2">
        <LocationPicker 
          locationData={locationData}
          setLocationData={setLocationData}
          variant="guide" 
        />
        <p className="text-xs text-gray-500 mt-2 text-center">
          Dica: Pode arrastar o mapa ou clicar nele para afinar a localização exata do negócio.
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mt-4">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Foto da Fachada ou Logotipo
        </label>
        
        {/* OPÇÃO 1: Upload do dispositivo */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 block mb-2">Carregar do seu dispositivo</label>
          {localImage.preview ? (
            <div className="relative w-40 h-28 border border-gray-300 rounded-lg overflow-hidden group">
              <img src={localImage.preview} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-red-600/80 text-white rounded-full p-1"
              >
                <XCircle size={18} />
              </button>
            </div>
          ) : (
            <div 
              className="w-40 h-28 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-6 h-6 text-indigo-500" />
              <span className="text-xs text-gray-500 mt-1">Escolher Foto</span>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* OPÇÃO 2: Link de Imagem */}
        <div>
          <label className="text-xs text-gray-500 block mb-1">Ou forneça um link para a imagem (Opcional)</label>
          <div className="relative">
            <Link2 className="absolute left-3 top-3 text-gray-400" size={16} />
            <input 
              value={formData.imageUrl} 
              onChange={e => {
                setFormData({...formData, imageUrl: e.target.value});
                if (e.target.value) handleRemoveImage();
              }} 
              disabled={!!localImage.preview} 
              className="input w-full pl-9 text-sm" 
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      <div>
        <label className="label font-semibold">Descrição Curta</label>
        <input 
          value={formData.description} 
          onChange={e => setFormData({...formData, description: e.target.value})} 
          className="input w-full" 
          placeholder="Ex: Aberto 24h, Especialista em..."
        />
      </div>

      <button type="submit" className="btn-primary w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 mt-4 rounded-md transition-colors">
        {initialData ? 'Atualizar Local' : 'Cadastrar Local'}
      </button>
    </form>
  );
}