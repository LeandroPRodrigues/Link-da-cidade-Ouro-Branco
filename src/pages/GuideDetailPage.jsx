import React from 'react';
import { ArrowLeft, MapPin, Phone, MessageCircle, Share2, Clock, Globe } from 'lucide-react';

export default function GuideDetailPage({ item, onBack }) {
  if (!item) return null;

  const cleanPhone = item.phone.replace(/\D/g, '');
  const isMobile = cleanPhone.length >= 10 && cleanPhone.startsWith('319');

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.name,
        text: `Confira ${item.name} no Guia Comercial de Ouro Branco.`,
        url: window.location.href
      });
    } else {
      alert("Link copiado para a área de transferência!");
    }
  };

  return (
    <div className="animate-in fade-in bg-white min-h-screen pb-12">
      {/* Cabeçalho */}
      <div className="bg-slate-50 border-b px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition mb-4">
            <ArrowLeft size={20}/> Voltar para o Guia
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wide mb-2 inline-block">
                {item.category}
              </span>
              <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">{item.name}</h1>
              <p className="text-slate-500 text-lg">{item.description}</p>
            </div>
            <button onClick={handleShare} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition">
              <Share2 size={20}/>
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-3xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        
        {/* Coluna Esquerda: Informações */}
        <div className="md:col-span-2 space-y-8">
          {/* Contato Rápido */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Phone size={20} className="text-green-600"/> Contato
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {isMobile && (
                <a 
                  href={`https://wa.me/55${cleanPhone}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle size={20}/> WhatsApp
                </a>
              )}
              <a 
                href={`tel:${cleanPhone}`} 
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <Phone size={20}/> Ligar Agora
              </a>
            </div>
            <p className="text-center text-xl font-bold text-slate-800 mt-4 select-all">{item.phone}</p>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <MapPin size={20} className="text-blue-600"/> Endereço
            </h3>
            <p className="text-slate-600 text-lg border-l-4 border-blue-200 pl-4 py-1">
              {item.address}
            </p>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' Ouro Branco MG ' + item.address)}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline text-sm mt-2 inline-block font-medium"
            >
              Ver no Google Maps &rarr;
            </a>
          </div>

          {/* Sobre (Simulado) */}
          <div>
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Globe size={20} className="text-purple-600"/> Informações Adicionais
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Este estabelecimento está listado no Guia Comercial oficial da cidade. 
              Para horários de funcionamento específicos ou agendamentos, entre em contato diretamente pelos telefones listados acima.
            </p>
          </div>
        </div>

        {/* Coluna Direita: Imagem (Opcional, se tiver) */}
        <div className="md:col-span-1">
           {item.image && (
             <div className="rounded-xl overflow-hidden shadow-sm border">
               <img src={item.image} alt={item.name} className="w-full h-48 object-cover"/>
             </div>
           )}
           <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-xs text-yellow-800">
             <p className="font-bold mb-1">Nota:</p>
             <p>As informações são de responsabilidade do estabelecimento e podem sofrer alterações sem aviso prévio.</p>
           </div>
        </div>

      </div>
    </div>
  );
}