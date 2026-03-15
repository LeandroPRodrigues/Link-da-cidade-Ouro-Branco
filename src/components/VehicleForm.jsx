import React, { useState } from 'react';
import { uploadFile } from '../utils/uploadHelper';
import { Loader, UploadCloud, X } from 'lucide-react';

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

export default function VehicleForm({ user, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  
  // Estado para sabermos qual marca foi selecionada e filtrarmos os modelos
  const [selectedBrand, setSelectedBrand] = useState('');

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
        photos: photoUrls,
        ownerId: user.id,
        ownerName: user.name,
        status: 'active', 
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

  // Pega os modelos da marca selecionada e ordena de A a Z
  const availableModels = CAR_DATABASE[selectedBrand] ? CAR_DATABASE[selectedBrand].sort() : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* SELETORES RIGOROSOS DE MARCA E MODELO (MENUS SUSPENSOS) */}
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
          disabled={!selectedBrand} // Fica bloqueado se não escolher a marca primeiro
          className="input w-full bg-white font-medium disabled:bg-slate-100 disabled:text-slate-400" 
          required
        >
          <option value="" disabled selected>Selecione o Modelo...</option>
          {availableModels.map(model => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>
      
      <input name="title" placeholder="Destaque (ex: Único dono, Baixa KM, Completo)" className="input w-full" required/>

      <div className="grid grid-cols-3 gap-3">
        <input name="year" type="number" placeholder="Ano (ex: 2018)" className="input w-full" required/>
        <input name="km" type="number" placeholder="KM" className="input w-full" required/>
        <select name="fuel" className="input w-full" required>
           <option value="" disabled selected>Combustível...</option>
           <option value="Flex">Flex</option>
           <option value="Gasolina">Gasolina</option>
           <option value="Diesel">Diesel</option>
           <option value="Elétrico">Elétrico</option>
           <option value="Híbrido">Híbrido</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <select name="transmission" className="input w-full" required>
           <option value="" disabled selected>Câmbio...</option>
           <option value="Manual">Manual</option>
           <option value="Automático">Automático</option>
        </select>
        <input name="plateEnd" type="number" placeholder="Final da Placa (ex: 9)" min="0" max="9" className="input w-full" required/>
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
          <span className="text-xs">Clique para selecionar (Máx 5 recomendadas)</span>
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
                className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl shadow-sm"
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