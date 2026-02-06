import React, { useState } from 'react';
import { uploadFile } from '../utils/uploadHelper';
import { Loader, UploadCloud, X } from 'lucide-react';

export default function VehicleForm({ user, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const photoUrls = [];
      if (files.length > 0) {
        for (const file of files) {
          const url = await uploadFile(file, 'vehicles');
          photoUrls.push(url);
        }
      } else {
        photoUrls.push('https://placehold.co/600x400?text=Sem+Foto');
      }

      const formData = {
        title: e.target.title.value, // ex: Completo, Único dono
        brand: e.target.brand.value,
        model: e.target.model.value,
        year: e.target.year.value,
        price: e.target.price.value,
        km: e.target.km.value,
        fuel: e.target.fuel.value,
        photos: photoUrls,
        ownerId: user.id,
        ownerName: user.name,
        createdAt: new Date().toISOString()
      };
      onSuccess(formData);
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar fotos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <input name="brand" placeholder="Marca (ex: Fiat)" className="input w-full" required/>
        <input name="model" placeholder="Modelo (ex: Uno)" className="input w-full" required/>
      </div>
      
      <input name="title" placeholder="Destaque (ex: Único dono, Baixa KM)" className="input w-full" required/>

      <div className="grid grid-cols-3 gap-3">
        <input name="year" type="number" placeholder="Ano" className="input w-full" required/>
        <input name="km" type="number" placeholder="KM" className="input w-full" required/>
        <select name="fuel" className="input w-full" required>
           <option value="Flex">Flex</option>
           <option value="Gasolina">Gasolina</option>
           <option value="Diesel">Diesel</option>
           <option value="Elétrico">Elétrico</option>
        </select>
      </div>

      <input name="price" type="number" placeholder="Preço (R$)" className="input w-full" required/>

      {/* ÁREA DE UPLOAD */}
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer relative">
        <input 
          type="file" 
          multiple 
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])}
        />
        <div className="flex flex-col items-center text-slate-500">
          <UploadCloud size={32} className="mb-2 text-orange-500"/>
          <span className="font-bold text-sm">Fotos do Veículo</span>
          <span className="text-xs">Clique para selecionar</span>
        </div>
      </div>

      {files.length > 0 && (
        <div className="flex gap-2 overflow-x-auto py-2">
          {files.map((file, idx) => (
            <div key={idx} className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border">
              <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
              <button 
                type="button" 
                onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"
              >
                <X size={12}/>
              </button>
            </div>
          ))}
        </div>
      )}

      <button disabled={loading} className="btn-primary w-full bg-orange-600 hover:bg-orange-700 flex items-center justify-center gap-2">
        {loading ? <Loader className="animate-spin" /> : "Anunciar Veículo"}
      </button>
    </form>
  );
}