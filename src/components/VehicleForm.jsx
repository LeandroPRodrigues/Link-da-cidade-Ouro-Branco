import React, { useState } from 'react';
import { uploadFile } from '../utils/uploadHelper';
import { Loader, UploadCloud, X, CheckSquare } from 'lucide-react';

// Banco de dados expandido com as marcas e modelos mais populares no Brasil
const CAR_DATABASE = {
  "Chevrolet": ["Agile", "Astra", "Blazer", "Camaro", "Captiva", "Celta", "Chevette", "Classic", "Cobalt", "Corsa", "Cruze", "Equinox", "Kadett", "Meriva", "Montana", "Monza", "Onix", "Opala", "Prisma", "S10", "Spin", "Tracker", "Trailblazer", "Vectra", "Zafira"],
  "Fiat": ["Argo", "Bravo", "Cronos", "Doblo", "Ducato", "Fastback", "Fiorino", "Freemont", "Idea", "Linea", "Marea", "Mobi", "Palio", "Punto", "Pulse", "Siena", "Stilo", "Strada", "Tempra", "Titano", "Toro", "Uno"],
  "Volkswagen": ["Amarok", "Bora", "Brasília", "CrossFox", "Fox", "Fusca", "Gol", "Golf", "Jetta", "Kombi", "Nivus", "Parati", "Passat", "Polo", "Quantum", "Santana", "Saveiro", "SpaceFox", "Taos", "T-Cross", "Tiguan", "Up!", "Virtus", "Voyage"],
  "Ford": ["Bronco", "Corcel", "Courier", "Del Rey", "EcoSport", "Edge", "Escort", "F-1000", "F-250", "Fiesta", "Focus", "Fusion", "Ka", "Maverick", "Mustang", "Pampa", "Ranger", "Territory", "Versailles"],
  "Toyota": ["Bandeirante", "Camry", "Corolla", "Corolla Cross", "Etios", "Fielder", "Hilux", "Prius", "RAV4", "SW4", "Yaris"],
  "Honda": ["Accord", "City", "Civic", "CR-V", "Fit", "HR-V", "WR-V", "ZR-V"],
  "Honda (Motos)": ["Biz 110i", "Biz 125", "Bros 160", "CB 300F", "CB 500F", "CB 500X", "CG 160 Fan", "CG 160 Titan", "CG 160 Start", "Elite 125", "PCX", "Pop 110i", "Tornado", "Twister", "XRE 190", "XRE 300"],
  "Hyundai": ["Azera", "Creta", "Elantra", "HB20", "HB20S", "HR", "i30", "ix35", "Santa Fe", "Sonata", "Tucson", "Veloster", "Veracruz"],
  "Renault": ["Captur", "Clio", "Duster", "Fluence", "Kangoo", "Kwid", "Logan", "Master", "Megane", "Oroch", "Sandero", "Scenic", "Symbol", "Zoe"],
  "Jeep": ["Cherokee", "Commander", "Compass", "Gladiator", "Grand Cherokee", "Renegade", "Wrangler"],
  "Nissan": ["Frontier", "GT-R", "Kicks", "Leaf", "Livina", "March", "Sentra", "Tiida", "Versa", "X-Trail"],
  "Peugeot": ["206", "207", "208", "2008", "307", "308", "3008", "408", "5008", "Boxer", "Expert", "Hoggar", "Partner"],
  "Citroën": ["Aircross", "Berlingo", "C3", "C3 Picasso", "C4 Cactus", "C4 Lounge", "C4 Pallas", "Jumper", "Jumpy", "Xsara Picasso"],
  "Yamaha (Motos)": ["Crosser 150", "Factor 150", "Fazer 250", "Fluo", "Lander 250", "MT-03", "MT-07", "MT-09", "Neo 125", "NMAX", "R3", "Ténéré 250", "XJ6", "XMAX", "YBR 125"],
  "Suzuki": ["Burgman", "Grand Vitara", "GSX", "Intruder", "Jimny", "S-Cross", "Swift", "Vitara", "V-Strom", "Yes 125"],
  "BMW": ["F 850 GS", "G 310 R", "R 1250 GS", "S 1000 RR", "Série 1", "Série 3", "Série 5", "X1", "X3", "X4", "X5", "X6", "Z4"],
  "Kawasaki (Motos)": ["Ninja 300", "Ninja 400", "Versys", "Vulcan S", "Z300", "Z400", "Z650", "Z900", "ZX-10R"],
  "Audi": ["A1", "A3", "A4", "A5", "A6", "e-tron", "Q3", "Q5", "Q7", "Q8", "TT"],
  "Mercedes-Benz": ["AMG GT", "Classe A", "Classe B", "Classe C", "Classe E", "GLA", "GLC", "GLE", "SLK", "Sprinter", "Vito"],
  "Kia": ["Bongo", "Carnival", "Cerato", "Optima", "Picanto", "Sorento", "Soul", "Sportage"],
  "Mitsubishi": ["ASX", "Eclipse Cross", "L200 Triton", "Lancer", "Outlander", "Pajero", "Pajero Dakar", "Pajero TR4"],
  "Volvo": ["C30", "S60", "V40", "XC40", "XC60", "XC90"],
  "BYD": ["Dolphin", "Dolphin Mini", "Han", "Seal", "Song Plus", "Yuan Plus"],
  "GWM": ["Haval H6", "Ora 03"],
  "Chery / CAOA": ["Arrizo 6", "Celer", "iCar", "QQ", "Tiggo 2", "Tiggo 3X", "Tiggo 5X", "Tiggo 7", "Tiggo 8"]
};

// Organiza as marcas por ordem alfabética
const BRANDS = Object.keys(CAR_DATABASE).sort();

// Lista completa de Opcionais e Acessórios
const VEHICLE_FEATURES = [
  "Ar Condicionado", "Direção Hidráulica", "Direção Elétrica", "Vidros Elétricos",
  "Travas Elétricas", "Alarme", "Kit Multimídia", "Bancos de Couro", 
  "Teto Solar", "Teto Panorâmico", "Rodas de Liga Leve", "Sensor de Estacionamento", 
  "Câmera de Ré", "Computador de Bordo", "Farol de Neblina", "Farol de LED",
  "Freio ABS", "Airbag Duplo", "Airbag Lateral", "Piloto Automático", 
  "Controle de Tração", "Tração 4x4", "Retrovisores Elétricos", "Sensor de Chuva", 
  "Câmbio Borboleta", "Partida Start/Stop", "Único Dono", "IPVA Pago"
];

export default function VehicleForm({ user, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  
  // Estado para armazenar os opcionais marcados
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  // Função para marcar/desmarcar opcionais
  const toggleFeature = (feature) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

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
        title: e.target.title.value, 
        brand: e.target.brand.value,
        model: e.target.model.value,
        year: e.target.year.value,
        price: e.target.price.value,
        km: e.target.km.value,
        fuel: e.target.fuel.value,
        transmission: e.target.transmission.value, 
        plateEnd: e.target.plateEnd.value, 
        
        // Novos campos adicionados
        phone: e.target.phone.value,
        email: e.target.email.value,
        description: e.target.description.value,
        features: selectedFeatures, // Array com todos os opcionais marcados
        
        photos: photoUrls,
        ownerId: user.id,
        ownerName: user.name,
        status: 'active', 
        createdAt: new Date().toISOString()
      };
      
      onSuccess(formData);
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar anúncio.");
    } finally {
      setLoading(false);
    }
  };

  const availableModels = CAR_DATABASE[selectedBrand] ? CAR_DATABASE[selectedBrand].sort() : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* SEÇÃO 1: VEÍCULO */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Dados do Veículo</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <select 
            name="brand" 
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="input w-full bg-white font-medium" 
            required
          >
            <option value="" disabled>Selecione a Marca...</option>
            {BRANDS.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
          
          <select 
            name="model" 
            disabled={!selectedBrand}
            className="input w-full bg-white font-medium disabled:bg-slate-100 disabled:text-slate-400" 
            required
          >
            <option value="" disabled selected>Selecione o Modelo...</option>
            {availableModels.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
        
        <input name="title" placeholder="Título Breve (ex: Lindo carro, Único dono, Completo)" className="input w-full bg-white font-bold" required/>

        <div className="grid grid-cols-3 gap-3">
          <input name="year" type="number" placeholder="Ano (ex: 2018)" className="input w-full bg-white" required/>
          <input name="km" type="number" placeholder="KM" className="input w-full bg-white" required/>
          <select name="fuel" className="input w-full bg-white" required>
             <option value="" disabled selected>Combustível</option>
             <option value="Flex">Flex</option>
             <option value="Gasolina">Gasolina</option>
             <option value="Diesel">Diesel</option>
             <option value="Elétrico">Elétrico</option>
             <option value="Híbrido">Híbrido</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select name="transmission" className="input w-full bg-white" required>
             <option value="" disabled selected>Câmbio...</option>
             <option value="Manual">Manual</option>
             <option value="Automático">Automático</option>
          </select>
          <input name="plateEnd" type="number" placeholder="Final da Placa (ex: 9)" min="0" max="9" className="input w-full bg-white" required/>
        </div>
      </div>

      {/* SEÇÃO 2: VALOR E DESCRIÇÃO */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Preço de Venda (R$)</label>
          <input name="price" type="number" placeholder="Ex: 45000" className="input w-full text-lg font-bold text-green-700" required/>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descrição do Anúncio</label>
          <textarea 
            name="description" 
            rows="4" 
            placeholder="Conte mais detalhes sobre o veículo: estado de conservação, motivo da venda, se aceita troca..." 
            className="input w-full resize-none"
            required
          ></textarea>
        </div>
      </div>

      {/* SEÇÃO 3: OPCIONAIS E ACESSÓRIOS */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
          <CheckSquare size={16} className="text-blue-500"/> Opcionais e Acessórios do Veículo
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200 h-64 overflow-y-auto">
          {VEHICLE_FEATURES.map(feature => (
            <label key={feature} className="flex items-start gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                checked={selectedFeatures.includes(feature)}
                onChange={() => toggleFeature(feature)}
              />
              <span className="text-sm text-slate-700 group-hover:text-blue-600 transition select-none leading-tight">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      {/* SEÇÃO 4: CONTATO */}
      <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 space-y-3">
        <h3 className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-2">Seus Contatos para Venda</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
             <label className="block text-xs text-orange-700 mb-1">WhatsApp / Telefone</label>
             <input name="phone" defaultValue={user?.phone || ''} placeholder="(00) 00000-0000" className="input w-full bg-white border-orange-200 focus:border-orange-500" required/>
          </div>
          <div>
             <label className="block text-xs text-orange-700 mb-1">E-mail de Contato</label>
             <input name="email" type="email" defaultValue={user?.email || ''} placeholder="seu@email.com" className="input w-full bg-white border-orange-200 focus:border-orange-500" required/>
          </div>
        </div>
      </div>

      {/* ÁREA DE UPLOAD DE FOTOS */}
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer relative">
        <input 
          type="file" 
          multiple 
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])}
        />
        <div className="flex flex-col items-center text-slate-500">
          <UploadCloud size={32} className="mb-2 text-blue-500"/>
          <span className="font-bold text-sm">Adicionar Fotos do Veículo</span>
          <span className="text-xs">A primeira foto será a capa do anúncio</span>
        </div>
      </div>

      {files.length > 0 && (
        <div className="flex gap-2 overflow-x-auto py-2">
          {files.map((file, idx) => (
            <div key={idx} className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border-2 border-slate-200 shadow-sm">
              <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
              {idx === 0 && <span className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-[10px] font-bold text-center py-0.5">CAPA</span>}
              <button 
                type="button" 
                onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg shadow-sm hover:bg-red-600 transition"
              >
                <X size={14}/>
              </button>
            </div>
          ))}
        </div>
      )}

      <button disabled={loading} className="btn-primary w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 py-4 text-lg">
        {loading ? <Loader className="animate-spin" /> : "Publicar Anúncio Agora"}
      </button>
    </form>
  );
}