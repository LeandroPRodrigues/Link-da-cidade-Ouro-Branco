import React, { useState } from 'react';
import { Camera, Save, User, ArrowLeft } from 'lucide-react';
import { formatCPF, validateCPF } from '../utils/cpfValidator';

export default function ProfilePage({ user, db, setUser, onBack }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    cpf: user?.cpf || '',
    birthDate: user?.birthDate || '',
    image: user?.image || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // Comprime a imagem para não sobrecarregar o banco de dados
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 300; // Tamanho máximo para foto de perfil
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
        } else {
          if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
        }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Converte para JPG comprimido
        const compressedImage = canvas.toDataURL('image/jpeg', 0.7);
        setFormData({ ...formData, image: compressedImage });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.cpf && !validateCPF(formData.cpf)) {
      alert("CPF inválido!"); return;
    }
    
    setIsSaving(true);
    try {
      // Como o Admin não está na coleção "users" (é regra direta), não deixamos ele alterar por aqui
      if (user.role === 'admin') {
         alert("O perfil do Administrador Mestre não pode ser alterado por aqui.");
         setIsSaving(false); return;
      }

      await db.updateUserProfile(user.id, formData);
      
      // Atualiza o estado global do site
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      localStorage.setItem('app_user', JSON.stringify(updatedUser));
      
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      alert("Erro ao salvar os dados.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in max-w-3xl mx-auto w-full pb-10">
      
      <div className="flex items-center gap-3 mb-6 px-2">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-50 transition">
          <ArrowLeft size={20} className="text-slate-600"/>
        </button>
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <User className="text-indigo-600" size={28}/> Meu Perfil
        </h2>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* FOTO DE PERFIL */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                {formData.image ? (
                  <img src={formData.image} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-slate-300 uppercase">{formData.name[0]}</span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer shadow-md transition transform hover:scale-110">
                <Camera size={18} />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <p className="text-xs text-slate-400 mt-3">Clique na câmera para alterar</p>
          </div>

          {/* DADOS DO FORMULÁRIO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome Completo</label>
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition" required />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">E-mail (Login)</label>
              <input value={user?.email || ''} disabled className="w-full p-4 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Telefone / WhatsApp</label>
              <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CPF</label>
              <input value={formData.cpf} onChange={e => setFormData({...formData, cpf: formatCPF(e.target.value)})} maxLength={14} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Data de Nascimento</label>
              <input type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition" />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-8 flex justify-end">
            <button disabled={isSaving} type="submit" className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl shadow-md hover:bg-indigo-700 transition hover:-translate-y-0.5 disabled:bg-slate-400">
              <Save size={20}/> {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}