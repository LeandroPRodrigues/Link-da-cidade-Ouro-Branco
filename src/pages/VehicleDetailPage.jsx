import React, { useState } from 'react';
import { ArrowLeft, MapPin, Share2, Phone, Mail, MessageCircle, Calendar, Gauge, Fuel, Settings, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function VehicleDetailPage({ vehicle, onBack }) {
  const [currentImage, setCurrentImage] = useState(0);

  if (!vehicle) return null;

  const priceFormatted = parseFloat(vehicle.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const photos = vehicle.photos || ['https://via.placeholder.com/800x600?text=Sem+Foto'];

  const handleWhatsApp = () => {
    // Limpa o número de telefone (remove parênteses, traços e espaços)
    const cleanPhone = vehicle.phone ? vehicle.phone.replace(/\D/g, '') : '';
    const message = `Olá! Vi o anúncio do seu ${vehicle.brand} ${vehicle.model} no portal Link da Cidade. Ainda está disponível?`;
    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % photos.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + photos.length) % photos.length);

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 pb-12 px-4 md:px-0 max-w-5xl mx-auto">
      
      {/* HEADER DE NAVEGAÇÃO */}
      <div className="flex items-center justify-between mb-6 pt-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          <ArrowLeft size={20} /> <span className="font-bold text-sm">Voltar aos Veículos</span>
        </button>
        <div className="flex gap-2">
          <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500 hover:text-blue-600 transition" onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert("Link copiado!"))}>
            <Share2 size={20}/>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* COLUNA ESQUERDA: FOTOS E DESCRIÇÃO */}
        <div className="md:col-span-2 space-y-6">
          
          {/* GALERIA DE FOTOS */}
          <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100">
            <div className="relative h-[300px] md:h-[450px] bg-slate-900 rounded-2xl overflow-hidden group">
              <img src={photos[currentImage]} alt="Veículo" className="w-full h-full object-contain" />
              
              {/* Controles do Carrossel */}
              {photos.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full shadow-lg transition opacity-0 group-hover:opacity-100"><ChevronLeft size={24}/></button>
                  <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full shadow-lg transition opacity-0 group-hover:opacity-100"><ChevronRight size={24}/></button>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {photos.map((_, idx) => (
                      <button key={idx} onClick={() => setCurrentImage(idx)} className={`w-2.5 h-2.5 rounded-full shadow-sm transition-all ${currentImage === idx ? 'bg-blue-500 w-6' : 'bg-white/60 hover:bg-white'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Miniaturas */}
            {photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-2 mt-1 scrollbar-hide">
                {photos.map((photo, idx) => (
                  <button key={idx} onClick={() => setCurrentImage(idx)} className={`h-16 w-24 shrink-0 rounded-xl overflow-hidden border-2 transition ${currentImage === idx ? 'border-blue-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={photo} className="w-full h-full object-cover" alt={`Miniatura ${idx + 1}`}/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DESCRIÇÃO DO VENDEDOR */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              Sobre este veículo
            </h3>
            <p className="text-slate-600 whitespace-pre-line leading-relaxed">
              {vehicle.description || "O vendedor não forneceu uma descrição detalhada para este anúncio."}
            </p>
          </div>

          {/* OPCIONAIS E ACESSÓRIOS */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Opcionais e Acessórios</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                {vehicle.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 size={18} className="text-blue-500 shrink-0"/>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* COLUNA DIREITA: PREÇO, RESUMO E CONTATO */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-24">
            
            {/* Cabeçalho do Anúncio */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{vehicle.brand}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight mb-2">
                {vehicle.model}
              </h1>
              <p className="text-slate-500 font-medium mb-4">{vehicle.title}</p>
              <div className="text-4xl font-black text-blue-600 tracking-tight">
                {priceFormatted}
              </div>
            </div>

            <hr className="border-slate-100 mb-6" />

            {/* Ficha Técnica Rápida */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-2xl">
                <Calendar size={20} className="text-blue-500"/>
                <span className="text-xs text-slate-500 font-bold uppercase">Ano</span>
                <span className="font-bold text-slate-800">{vehicle.year}</span>
              </div>
              <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-2xl">
                <Gauge size={20} className="text-blue-500"/>
                <span className="text-xs text-slate-500 font-bold uppercase">Quilometragem</span>
                <span className="font-bold text-slate-800">{vehicle.km ? vehicle.km.toLocaleString() : 'N/I'} km</span>
              </div>
              <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-2xl">
                <Settings size={20} className="text-blue-500"/>
                <span className="text-xs text-slate-500 font-bold uppercase">Câmbio</span>
                <span className="font-bold text-slate-800">{vehicle.transmission || 'N/I'}</span>
              </div>
              <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-2xl">
                <Fuel size={20} className="text-blue-500"/>
                <span className="text-xs text-slate-500 font-bold uppercase">Combustível</span>
                <span className="font-bold text-slate-800">{vehicle.fuel}</span>
              </div>
            </div>

            {/* Caixa do Vendedor */}
            <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
              <h4 className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-4">Informações do Vendedor</h4>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-200 text-orange-700 rounded-full flex items-center justify-center font-bold text-xl uppercase">
                  {vehicle.ownerName ? vehicle.ownerName[0] : 'V'}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{vehicle.ownerName || 'Vendedor'}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={12}/> Ouro Branco - MG</p>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-3">
                <button 
                  onClick={handleWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <MessageCircle size={22} /> Chamar no WhatsApp
                </button>
                
                {vehicle.email && (
                  <a href={`mailto:${vehicle.email}`} className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
                    <Mail size={18} className="text-slate-400" /> Enviar E-mail
                  </a>
                )}
              </div>
            </div>
            
            <p className="text-[10px] text-center text-slate-400 mt-6 leading-relaxed">
              O Link da Cidade não participa das negociações. Nunca deposite dinheiro antes de ver o veículo e o vendedor pessoalmente em local seguro.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}