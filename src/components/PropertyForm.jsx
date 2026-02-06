import React, { useState } from 'react';
import { uploadFile } from '../utils/uploadHelper';
import { Loader, UploadCloud, X } from 'lucide-react';

export default function PropertyForm({ user, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]); // Guarda os arquivos selecionados

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Faz upload das imagens primeiro
      const photoUrls = [];
      if (files.length > 0) {
        for (const file of files) {
          const url = await uploadFile(file, 'properties');
          photoUrls.push(url);
        }
      } else {
        // Usa uma imagem padrão se não tiver fotos (opcional)
        photoUrls.push('https://placehold.co/600x400?text=Sem+Foto');
      }

      // 2. Cria o objeto final
      const formData = {
        title: e.target.title.value,
        type: e.target.type.value,
        price: e.target.price.value,
        location: e.target.location.value,
        bedrooms: e.target.bedrooms.value,
        bathrooms: e.target.bathrooms.value,
        area: e.target.area.value,
        photos: photoUrls, // Salva os links gerados pelo Google
        ownerId: user.id,
        ownerName: user.name,
        createdAt: new Date().toISOString()
      };

      onSuccess(formData);
    } catch (error) {
      console.error("Erro no upload", error);
      alert("Erro ao enviar imagens. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" placeholder="Título do Anúncio (ex: Casa no Centro)" className="input w-full" required/>
      
      <div className="grid grid-cols-2 gap-3">
        <select name="type" className="input w-full" required>
          <option value="Venda">Venda</option>
          <option value="Aluguel">Aluguel</option>
        </select>
        <input name="price" type="number" placeholder="Preço (R$)" className="input w-full" required/>
      </div>

      <input name="location" placeholder="Bairro / Localização" className="input w-full" required/>

      <div className="grid grid-cols-3 gap-3">
        <input name="bedrooms" type="number" placeholder="Quartos" className="input w-full" required/>
        <input name="bathrooms" type="number" placeholder="Banheiros" className="input w-full" required/>
        <input name="area" type="number" placeholder="Área (m²)" className="input w-full" required/>
      </div>

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
          <UploadCloud size={32} className="mb-2 text-indigo-500"/>
          <span className="font-bold text-sm">Clique para enviar fotos</span>
          <span className="text-xs">JPG ou PNG (Do seu dispositivo)</span>
        </div>
      </div>

      {/* PREVIEW DAS FOTOS */}
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

      <button disabled={loading} className="btn-primary w-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2">
        {loading ? <Loader className="animate-spin" /> : "Publicar Anúncio"}
      </button>
    </form>
  );
}