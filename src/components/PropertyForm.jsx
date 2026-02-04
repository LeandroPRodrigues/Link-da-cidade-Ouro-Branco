import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import LocationPicker from './LocationPicker';

export default function PropertyForm({ user, onSuccess, initialData }) {
  // Estado inicial vazio
  const emptyState = {
    title: '', description: '', type: 'Venda', price: '',
    bedrooms: '', bathrooms: '', garage: '', area: '',
    address: '', privacy: 'exact',
    photoUrl: '',
    contactPhone: '', contactEmail: ''
  };

  const [formData, setFormData] = useState(emptyState);
  const [geo, setGeo] = useState({ lat: null, lng: null });

  // Se receber dados para editar (initialData), preenche o formulário
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.location) setGeo(initialData.location);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Se for edição, mantém o ID e a data de criação. Se for novo, cria.
    const payload = {
      ...formData,
      id: initialData ? initialData.id : Date.now().toString(),
      userId: initialData ? initialData.userId : user.id,
      userName: initialData ? initialData.userName : user.name,
      createdAt: initialData ? initialData.createdAt : new Date().toISOString(),
      expiresAt: initialData ? initialData.expiresAt : new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
      status: initialData ? initialData.status : 'active',
      location: geo,
      photos: [formData.photoUrl], // Mantendo lógica simples de 1 foto por enquanto
    };

    // Chama a função passada pelo pai (seja App ou RealEstatePage)
    onSuccess(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
        <Shield size={16} className="inline mr-1"/>
        <strong>{initialData ? 'Editando Anúncio' : 'Novo Anúncio'}:</strong> {initialData ? 'Atualize os dados abaixo.' : 'Seu anúncio ficará ativo por 30 dias.'}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="label">Título do Anúncio</label>
          <input required className="input" placeholder="Ex: Casa aconchegante no centro" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        
        <div>
          <label className="label">Tipo</label>
          <select className="input bg-white" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option>Venda</option>
            <option>Aluguel</option>
            <option>Temporada</option>
          </select>
        </div>
        <div>
          <label className="label">Valor (R$)</label>
          <input required type="number" className="input" placeholder="0,00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div><label className="label">Quartos</label><input type="number" className="input" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} /></div>
          <div><label className="label">Vagas</label><input type="number" className="input" value={formData.garage} onChange={e => setFormData({...formData, garage: e.target.value})} /></div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><label className="label">Banheiros</label><input type="number" className="input" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} /></div>
          <div><label className="label">Área (m²)</label><input type="number" className="input" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} /></div>
        </div>

        <div className="md:col-span-2">
          <label className="label">Endereço Completo</label>
          <input required className="input" placeholder="Rua, Número, Bairro..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
        </div>

        <div className="md:col-span-2">
          <label className="label mb-2">Localização no Mapa (Clique para marcar)</label>
          <LocationPicker 
            lat={geo.lat} lng={geo.lng} 
            privacy={formData.privacy}
            onChange={(val) => {
              if (val.lat) setGeo(val);
              if (val.privacy) setFormData({...formData, privacy: val.privacy});
            }} 
          />
        </div>

        <div className="md:col-span-2">
          <label className="label">Foto Principal (URL)</label>
          <input required className="input" placeholder="https://..." value={formData.photoUrl} onChange={e => setFormData({...formData, photoUrl: e.target.value})} />
        </div>

        <div className="md:col-span-2">
          <label className="label">Descrição Detalhada</label>
          <textarea className="input h-24" placeholder="Conte mais sobre o imóvel..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>

        <div className="md:col-span-2 bg-slate-50 p-4 rounded-lg border">
          <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase">Dados de Contato</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">WhatsApp / Telefone</label>
              <input required type="tel" className="input" placeholder="31999999999" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} />
            </div>
            <div>
              <label className="label">E-mail (Opcional)</label>
              <input type="email" className="input" placeholder="seu@email.com" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} />
            </div>
          </div>
        </div>
      </div>

      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
        {initialData ? 'Salvar Alterações' : 'Cadastrar Imóvel'}
      </button>
    </form>
  );
}