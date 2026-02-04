import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Image as ImageIcon, ChevronDown, Check } from 'lucide-react';

// --- BASE DE DADOS DE VEÍCULOS (Exemplo Completo) ---
const CARS_DB = {
  "Audi": ["A3", "A4", "A5", "Q3", "Q5", "Q7", "TT", "e-tron"],
  "BMW": ["Série 1", "Série 3", "Série 5", "X1", "X3", "X5", "X6", "Z4"],
  "Caoa Chery": ["Tiggo 2", "Tiggo 5X", "Tiggo 7", "Tiggo 8", "Arrizo 5", "Arrizo 6", "iCar"],
  "Chevrolet": ["Onix", "Onix Plus", "Tracker", "S10", "Spin", "Cruze", "Equinox", "Trailblazer", "Montana", "Camaro", "Celta", "Classic", "Corsa", "Agile", "Prisma", "Cobalt", "Astra", "Vectra", "Omega", "Opala", "Chevette"],
  "Citroën": ["C3", "C4 Cactus", "C4 Lounge", "Aircross", "C3 Picasso", "Jumpy"],
  "Fiat": ["Strada", "Mobi", "Argo", "Cronos", "Pulse", "Fastback", "Toro", "Fiorino", "Ducato", "Uno", "Palio", "Siena", "Grand Siena", "Punto", "Linea", "Idea", "Stilo", "Bravo", "Doblo", "Tempra", "Tipo", "Marea", "147"],
  "Ford": ["Ranger", "Maverick", "Mustang", "Territory", "Bronco", "Transit", "Ka", "Ka Sedan", "Fiesta", "Focus", "EcoSport", "Fusion", "Edge", "Escort", "Corcel", "Del Rey", "F1000"],
  "Honda": ["Civic", "City", "City Hatch", "HR-V", "ZR-V", "CR-V", "Accord", "Fit", "WR-V"],
  "Hyundai": ["HB20", "HB20S", "Creta", "Tucson", "Santa Fe", "Palisade", "Ioniq", "Kona", "i30", "ix35", "Azera", "Elantra", "HB20X"],
  "Jeep": ["Renegade", "Compass", "Commander", "Wrangler", "Gladiator", "Grand Cherokee"],
  "Kia": ["Sportage", "Stonic", "Niro", "Cerato", "Sorento", "Picanto", "Soul", "Carnival"],
  "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Range Rover Evoque", "Range Rover Velar"],
  "Mercedes-Benz": ["Classe A", "Classe C", "Classe E", "GLA", "GLB", "GLC", "GLE", "Sprinter"],
  "Mitsubishi": ["L200 Triton", "Pajero Sport", "Eclipse Cross", "ASX", "Outlander", "Lancer"],
  "Nissan": ["Kicks", "Versa", "Sentra", "Frontier", "Leaf", "March", "Tiida", "Livina"],
  "Peugeot": ["208", "2008", "3008", "Expert", "Partner", "206", "207", "307", "308", "408"],
  "Renault": ["Kwid", "Stepway", "Logan", "Sandero", "Duster", "Oroch", "Captur", "Master", "Megane", "Clio", "Scenic", "Fluence", "Symbol"],
  "Toyota": ["Corolla", "Corolla Cross", "Hilux", "SW4", "Yaris", "Yaris Sedan", "RAV4", "Camry", "Prius", "Etios", "Fielder", "Bandeirante"],
  "Volkswagen": ["Polo", "Virtus", "Nivus", "T-Cross", "Taos", "Tiguan", "Amarok", "Jetta", "Saveiro", "Gol", "Voyage", "Fox", "Up", "SpaceFox", "Golf", "Parati", "Santana", "Fusca", "Kombi", "Brasilia", "Passat"],
  "Volvo": ["XC40", "XC60", "XC90", "C40", "S60", "V60"]
};

// Gerar lista de anos (2026 até 1926)
const YEARS_LIST = Array.from({ length: 101 }, (_, i) => (2026 - i).toString());

// --- COMPONENTE SELECT PESQUISÁVEL CORRIGIDO ---
const SearchableSelect = ({ label, options, value, onChange, placeholder, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      // CORREÇÃO: Usar event.target em vez de event.current
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    // Usamos mousedown para capturar o clique antes do blur
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Filtra as opções
  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="label">{label}</label>
      <div 
        className={`input w-full flex items-center justify-between cursor-pointer bg-white ${disabled ? 'bg-slate-100 opacity-60 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-slate-900' : 'text-slate-400'}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} className="text-slate-400"/>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-lg shadow-xl mt-1 max-h-60 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
          <input 
            autoFocus
            className="p-2 border-b border-slate-100 outline-none text-sm bg-slate-50 sticky top-0"
            placeholder="Digite para buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // Impede que clicar no input feche o menu
            onClick={(e) => e.stopPropagation()}
          />
          <div className="overflow-y-auto flex-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div 
                  key={opt}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-orange-50 hover:text-orange-700 flex justify-between items-center ${value === opt ? 'bg-orange-100 text-orange-800 font-bold' : 'text-slate-600'}`}
                  onClick={(e) => {
                    e.stopPropagation(); // Impede borbulhamento indesejado
                    onChange(opt);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  {opt}
                  {value === opt && <Check size={14}/>}
                </div>
              ))
            ) : (
              <div className="p-3 text-xs text-slate-400 text-center">
                "{searchTerm}" não encontrado.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- FORMULÁRIO PRINCIPAL ---
export default function VehicleForm({ user, onSuccess, initialData }) {
  const [formData, setFormData] = useState({
    title: '', brand: '', model: '', year: '', price: '', km: '',
    color: '', fuel: 'Flex', transmission: 'Manual', plateEnd: '',
    description: '', contactPhone: '', photos: []
  });

  const [photoInput, setPhotoInput] = useState('');

  // Carrega dados iniciais
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Atualiza título automaticamente
  useEffect(() => {
    if (!initialData && formData.brand && formData.model) {
      setFormData(prev => ({
        ...prev,
        title: `${prev.brand} ${prev.model} ${prev.year} Completo`
      }));
    }
  }, [formData.brand, formData.model, formData.year]);

  const handleBrandChange = (brand) => {
    setFormData(prev => ({ ...prev, brand, model: '' }));
  };

  const handleAddPhoto = () => {
    if (!photoInput) return;
    if (formData.photos.length >= 5) return alert("Máximo de 5 fotos permitido.");
    setFormData({ ...formData, photos: [...formData.photos, photoInput] });
    setPhotoInput('');
  };

  const handleRemovePhoto = (index) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData({ ...formData, photos: newPhotos });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.photos.length === 0) return alert("Adicione pelo menos 1 foto.");
    if (!formData.brand || !formData.model || !formData.year) return alert("Preencha Marca, Modelo e Ano.");

    const payload = {
      ...formData,
      id: initialData ? initialData.id : Date.now().toString(),
      userId: initialData ? initialData.userId : user.id,
      status: initialData ? initialData.status : 'active',
      createdAt: initialData ? initialData.createdAt : new Date().toISOString()
    };

    onSuccess(payload);
  };

  // Listas Dinâmicas
  const brandList = Object.keys(CARS_DB).sort();
  const modelList = formData.brand ? (CARS_DB[formData.brand] || []).sort() : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 text-sm text-orange-800">
        <strong>Venda seu Carro:</strong> Preencha os dados com atenção. Seu anúncio aparecerá imediatamente.
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        
        {/* Marca */}
        <SearchableSelect 
          label="Marca" 
          placeholder="Selecione a marca..." 
          options={brandList}
          value={formData.brand}
          onChange={handleBrandChange}
        />

        {/* Modelo */}
        <SearchableSelect 
          label="Modelo" 
          placeholder={formData.brand ? "Selecione o modelo..." : "Selecione a marca primeiro"} 
          options={modelList}
          value={formData.model}
          onChange={(m) => setFormData({...formData, model: m})}
          disabled={!formData.brand}
        />

        {/* Ano */}
        <SearchableSelect 
          label="Ano" 
          placeholder="Ano Fab." 
          options={YEARS_LIST}
          value={formData.year}
          onChange={(y) => setFormData({...formData, year: y})}
        />

        <div>
          <label className="label">Preço (R$)</label>
          <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="input w-full" placeholder="0,00"/>
        </div>

        <div className="md:col-span-2">
          <label className="label">Título do Anúncio</label>
          <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input w-full font-bold" placeholder="Ex: Fiat Palio 1.0 Completo"/>
          <p className="text-[10px] text-slate-400 mt-1">Sugerido: Marca + Modelo + Versão</p>
        </div>
        
        <div><label className="label">Quilometragem</label><input required type="number" value={formData.km} onChange={e => setFormData({...formData, km: e.target.value})} className="input w-full" placeholder="Km"/></div>
        <div><label className="label">Cor</label><input required value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="input w-full" placeholder="Ex: Prata"/></div>
      </div>

      <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded border">
        <div>
           <label className="label">Combustível</label>
           <select className="input bg-white w-full" value={formData.fuel} onChange={e => setFormData({...formData, fuel: e.target.value})}>
             <option>Flex</option><option>Gasolina</option><option>Etanol</option><option>Diesel</option><option>Elétrico</option><option>Híbrido</option>
           </select>
        </div>
        <div>
           <label className="label">Câmbio</label>
           <select className="input bg-white w-full" value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})}>
             <option>Manual</option><option>Automático</option><option>CVT</option>
           </select>
        </div>
        <div>
           <label className="label">Final da Placa</label>
           <select className="input bg-white w-full" value={formData.plateEnd} onChange={e => setFormData({...formData, plateEnd: e.target.value})}>
             <option value="">...</option>
             {[1,2,3,4,5,6,7,8,9,0].map(n => <option key={n}>{n}</option>)}
           </select>
        </div>
      </div>

      <div>
        <label className="label">Descrição Completa</label>
        <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input w-full h-24" placeholder="Opcionais, estado de conservação, revisões..."/>
      </div>
      <div>
        <label className="label">WhatsApp para Contato</label>
        <input required type="tel" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} className="input w-full border-green-300 bg-green-50" placeholder="Somente números"/>
      </div>

      <div className="border-t pt-4">
        <label className="label mb-2">Fotos do Veículo ({formData.photos.length}/5)</label>
        
        <div className="flex gap-2 mb-3">
          <input 
            value={photoInput} 
            onChange={e => setPhotoInput(e.target.value)} 
            className="input flex-1 text-sm" 
            placeholder="Cole a URL da imagem aqui (https://...)" 
            disabled={formData.photos.length >= 5}
          />
          <button type="button" onClick={handleAddPhoto} disabled={formData.photos.length >= 5} className="bg-slate-200 hover:bg-slate-300 px-4 rounded text-slate-700 disabled:opacity-50">
            <Plus size={20}/>
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2">
           {formData.photos.map((url, idx) => (
             <div key={idx} className="relative aspect-square bg-slate-100 rounded border overflow-hidden group">
               <img src={url} className="w-full h-full object-cover" alt="preview"/>
               <button type="button" onClick={() => handleRemovePhoto(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition">
                 <X size={12}/>
               </button>
             </div>
           ))}
           {Array.from({ length: 5 - formData.photos.length }).map((_, i) => (
             <div key={`empty-${i}`} className="aspect-square bg-slate-50 rounded border border-dashed flex items-center justify-center text-slate-300">
               <ImageIcon size={20}/>
             </div>
           ))}
        </div>
      </div>

      <button className="btn-primary w-full bg-orange-600 hover:bg-orange-700">
        {initialData ? 'Salvar Alterações' : 'Anunciar Veículo'}
      </button>
    </form>
  );
}