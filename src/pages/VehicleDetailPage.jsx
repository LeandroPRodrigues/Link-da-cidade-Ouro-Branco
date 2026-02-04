import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Calendar, Gauge, Fuel, Settings, MapPin, CheckCircle, Shield } from 'lucide-react';

export default function VehicleDetailPage({ vehicle, onBack }) {
  const [activePhoto, setActivePhoto] = useState(0);

  if (!vehicle) return null;

  // Link do WhatsApp
  const handleWhatsApp = () => {
    const message = `Olá! Vi seu anúncio do *${vehicle.title}* no Link da Cidade e tenho interesse.`;
    const cleanPhone = vehicle.contactPhone.replace(/\D/g,'');
    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="animate-in fade-in pb-12">
      {/* Botão Voltar */}
      <div className="px-4 py-6 max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition">
          <ArrowLeft size={20}/> Voltar para classificados
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-0 grid md:grid-cols-3 gap-8">
        
        {/* --- COLUNA ESQUERDA: FOTOS --- */}
        <div className="md:col-span-2 space-y-4">
          {/* Foto Principal */}
          <div className="aspect-[4/3] bg-black rounded-xl overflow-hidden relative shadow-sm">
            <img 
              src={vehicle.photos[activePhoto]} 
              className="w-full h-full object-contain" 
              alt={vehicle.title} 
            />
          </div>
          
          {/* Miniaturas */}
          {vehicle.photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {vehicle.photos.map((photo, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActivePhoto(idx)}
                  className={`w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition ${activePhoto === idx ? 'border-blue-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={photo} className="w-full h-full object-cover" alt={`foto ${idx}`}/>
                </button>
              ))}
            </div>
          )}

          {/* Descrição */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm mt-6">
            <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">Sobre o Veículo</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{vehicle.description}</p>
          </div>
        </div>

        {/* --- COLUNA DIREITA: INFORMAÇÕES --- */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Card de Preço e Título */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
            <h1 className="text-2xl font-bold text-slate-800 leading-tight mb-1">{vehicle.title}</h1>
            <p className="text-slate-500 mb-6">{vehicle.brand} {vehicle.model}</p>
            
            <div className="text-3xl font-bold text-slate-900 mb-6">
              {parseFloat(vehicle.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>

            <button 
              onClick={handleWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg transform active:scale-95"
            >
              <MessageCircle size={24}/> Enviar Mensagem
            </button>
            <p className="text-xs text-center text-slate-400 mt-2">Negociação direta com o vendedor</p>
          </div>

          {/* Ficha Técnica */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 px-6 py-3 border-b font-bold text-slate-700">Ficha Técnica</div>
            <div className="p-4 grid grid-cols-2 gap-y-4 text-sm">
               <div>
                 <span className="block text-xs text-slate-400">Ano</span>
                 <span className="font-bold text-slate-700 flex items-center gap-1"><Calendar size={14}/> {vehicle.year}</span>
               </div>
               <div>
                 <span className="block text-xs text-slate-400">Quilometragem</span>
                 <span className="font-bold text-slate-700 flex items-center gap-1"><Gauge size={14}/> {vehicle.km.toLocaleString()} km</span>
               </div>
               <div>
                 <span className="block text-xs text-slate-400">Combustível</span>
                 <span className="font-bold text-slate-700 flex items-center gap-1"><Fuel size={14}/> {vehicle.fuel}</span>
               </div>
               <div>
                 <span className="block text-xs text-slate-400">Câmbio</span>
                 <span className="font-bold text-slate-700 flex items-center gap-1"><Settings size={14}/> {vehicle.transmission}</span>
               </div>
               <div>
                 <span className="block text-xs text-slate-400">Cor</span>
                 <span className="font-bold text-slate-700">{vehicle.color}</span>
               </div>
               <div>
                 <span className="block text-xs text-slate-400">Final da Placa</span>
                 <span className="font-bold text-slate-700">{vehicle.plateEnd}</span>
               </div>
            </div>
          </div>

          {/* Aviso de Segurança */}
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-xs text-orange-800 flex gap-3">
             <Shield className="shrink-0" size={24}/>
             <div>
               <p className="font-bold mb-1">Dica de Segurança</p>
               <p>Nunca faça depósitos antecipados. Veja o carro pessoalmente antes de fechar negócio. O Link da Cidade apenas exibe anúncios.</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}