import React, { useState } from 'react';
import { ArrowLeft, MapPin, Phone, MessageCircle, Share2, Clock, Globe, Copy, X } from 'lucide-react';
import LocationPicker from '../components/LocationPicker';

export default function GuideDetailPage({ item, onBack }) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (!item) return null;

  const cleanPhone = item.phone ? item.phone.replace(/\D/g, '') : '';
  const isMobile = cleanPhone.length >= 10 && cleanPhone.startsWith('319');

  // --- FUNÇÕES DO MODAL DE COMPARTILHAMENTO ---
  const currentUrl = window.location.href;
  const shareText = `Confira a empresa ${item.name} no Guia Comercial do Link da Cidade Ouro Branco.`;

  const shareToWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} - ${currentUrl}`)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    alert("Link copiado com sucesso! Cole nas suas redes sociais.");
    setIsShareModalOpen(false);
  };

  return (
    <div className="animate-in fade-in bg-white min-h-screen pb-12 relative">
      
      {/* MODAL DE COMPARTILHAMENTO */}
      {isShareModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" 
          onClick={() => setIsShareModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-xl text-slate-800">Compartilhar Empresa</h3>
              <button 
                onClick={() => setIsShareModalOpen(false)} 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition"
              >
                <X size={20}/>
              </button>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={shareToWhatsApp} 
                className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition shadow-sm"
              >
                <MessageCircle size={20}/> Enviar no WhatsApp
              </button>
              
              <button 
                onClick={shareToFacebook} 
                className="w-full bg-[#1877F2] hover:bg-[#155fc2] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition shadow-sm"
              >
                 Compartilhar no Facebook
              </button>

              <button 
                onClick={copyToClipboard} 
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition"
              >
                <Copy size={20}/> Copiar Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition mb-6 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 w-fit"
          >
            <ArrowLeft size={18}/> Voltar para o Guia
          </button>
          
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded uppercase tracking-wider mb-3 inline-block shadow-sm">
                {item.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 leading-tight">{item.name}</h1>
              {item.description && <p className="text-slate-500 text-lg font-medium">{item.description}</p>}
            </div>
            
            <button 
              onClick={() => setIsShareModalOpen(true)} 
              className="p-3 text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-600 hover:text-white rounded-xl transition shadow-sm shrink-0"
              title="Compartilhar"
            >
              <Share2 size={24}/>
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        
        {/* Coluna Esquerda: Informações */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Contato Rápido */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="font-black text-slate-800 text-xl mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Phone size={24} className="text-emerald-500"/> Entrar em Contato
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {isMobile && (
                <a 
                  href={`https://wa.me/55${cleanPhone}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <MessageCircle size={20}/> Chamar no WhatsApp
                </a>
              )}
              {cleanPhone ? (
                <a 
                  href={`tel:${cleanPhone}`} 
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <Phone size={20}/> Ligar Agora
                </a>
              ) : (
                <span className="flex-1 bg-slate-50 text-slate-400 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-200">Sem Telefone Registrado</span>
              )}
            </div>
            {item.phone && <p className="text-center text-2xl font-black text-slate-800 mt-6 select-all">{item.phone}</p>}
          </div>

          {/* Endereço E MAPA */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="font-black text-slate-800 text-xl mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin size={24} className="text-blue-500"/> Localização
            </h3>
            
            <p className="text-slate-700 font-medium text-lg border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-xl mb-6">
              {item.address || "Endereço completo não informado"}
            </p>
            
            {/* O NOVO MAPA INTEGRADO */}
            <div className="h-64 w-full rounded-xl overflow-hidden border border-slate-200 relative mb-4 shadow-inner">
              <LocationPicker 
                lat={item.location?.lat || -20.5236} 
                lng={item.location?.lng || -43.6914} 
                readOnly 
              />
            </div>

            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' Ouro Branco MG ' + (item.address || ''))}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-blue-50 border border-blue-100 hover:bg-blue-600 hover:text-white text-blue-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
            >
              Abrir Rota no Google Maps →
            </a>
          </div>

          {/* Sobre / Informações Adicionais */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="font-black text-slate-800 text-xl mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Globe size={24} className="text-purple-500"/> Informações Adicionais
            </h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              Este estabelecimento está listado no Guia Comercial oficial do <strong>Link da Cidade</strong>. 
              Para consultar horários de funcionamento específicos, agendamentos ou disponibilidade de produtos, entre em contato diretamente pelos telefones listados acima.
            </p>
          </div>
        </div>

        {/* Coluna Direita: Imagem */}
        <div className="md:col-span-1">
           {item.image && (
             <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 mb-6 bg-slate-50">
               <img src={item.image} alt={item.name} className="w-full h-auto object-cover"/>
             </div>
           )}
           <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-200 text-sm text-yellow-800 shadow-sm">
             <p className="font-black mb-2 uppercase tracking-wider text-xs">⚠️ Aviso Importante:</p>
             <p className="leading-relaxed font-medium">As informações e os serviços prestados são de total responsabilidade do estabelecimento e podem sofrer alterações sem aviso prévio. O portal não faz a intermediação de vendas do guia.</p>
           </div>
        </div>

      </div>
    </div>
  );
}