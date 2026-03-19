import React, { useState } from 'react';
import { 
  ArrowLeft, Map as MapIcon, Phone, MessageCircle, 
  Mail, Share2, Copy, X 
} from 'lucide-react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places'];

export default function PropertyDetailPage({ property, onBack }) {
  const [showPhone, setShowPhone] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Carrega a API do Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  if (!property) return null;

  // Define o centro do mapa com base no imóvel ou usa o centro de Ouro Branco como fallback
  const mapCenter = {
    lat: property.location?.lat || -20.5236,
    lng: property.location?.lng || -43.6914
  };

  // --- FUNÇÃO DE CONTATO VIA WHATSAPP ---
  const handleWhatsApp = () => {
    if (!property.contactPhone) return alert("Telefone não informado");
    const message = `Olá, vi o imóvel "${property.title}" no Link da Cidade e tenho interesse. Link: https://linkdacidade.com.br/imoveis/${property.id}`;
    const cleanPhone = property.contactPhone.replace(/\D/g,'');
    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // --- FUNÇÕES DO MODAL DE COMPARTILHAMENTO ---
  const currentUrl = window.location.href;
  const shareText = `Dê uma olhada neste imóvel em Ouro Branco: ${property.title} por R$ ${parseFloat(property.price).toLocaleString('pt-BR')}.`;

  const shareToWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} - ${currentUrl}`)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    alert("Link do imóvel copiado com sucesso! Cole nas suas redes sociais.");
    setIsShareModalOpen(false);
  };

  return (
    <div className="px-4 md:px-0 pb-12 animate-in fade-in max-w-6xl mx-auto relative">
      
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
              <h3 className="font-black text-xl text-slate-800">Compartilhar Imóvel</h3>
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
                <Copy size={20}/> Copiar Link (Para Instagram, etc)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CABEÇALHO DE NAVEGAÇÃO */}
      <div className="flex items-center justify-between mb-6 mt-6">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors"
        >
          <ArrowLeft size={20}/> Voltar para lista
        </button>
        
        <button 
          onClick={() => setIsShareModalOpen(true)} 
          className="flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl font-bold transition shadow-sm"
        >
          <Share2 size={18} /> <span className="hidden sm:inline">Compartilhar Imóvel</span>
        </button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* COLUNA ESQUERDA: FOTO E DETALHES */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            
            <div className="relative">
              <img 
                src={property.photos?.[0] || property.image} 
                className="w-full h-[400px] object-cover" 
                alt={property.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
              <span className={`absolute bottom-4 left-4 text-white text-xs font-black px-3 py-1.5 rounded uppercase tracking-wider shadow-sm ${property.type === 'Venda' ? 'bg-blue-600' : property.type === 'Aluguel' ? 'bg-emerald-600' : 'bg-purple-600'}`}>
                {property.type}
              </span>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4 border-b border-slate-100 pb-6">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight mb-2">
                    {property.title}
                  </h1>
                  <p className="text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                    <MapIcon size={16} className="text-slate-400"/> 
                    {property.privacy === 'exact' ? property.address : "Localização Aproximada (Bairro)"}
                  </p>
                </div>
                <div className="text-left md:text-right shrink-0">
                  <p className="text-3xl font-black text-emerald-600">
                    R$ {parseFloat(property.price).toLocaleString('pt-BR')}
                  </p>
                  {property.type !== 'Venda' && (
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">por mês</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 py-4 mb-6 text-center bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="block font-black text-xl text-slate-800">{property.bedrooms || '-'}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quartos</span>
                </div>
                <div>
                  <span className="block font-black text-xl text-slate-800">{property.bathrooms || '-'}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Banheiros</span>
                </div>
                <div>
                  <span className="block font-black text-xl text-slate-800">{property.garage || '-'}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vagas</span>
                </div>
                <div>
                  <span className="block font-black text-xl text-slate-800">{property.area || '-'}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">m²</span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-black text-lg text-slate-800 mb-3 flex items-center gap-2">
                  Sobre o Imóvel
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {property.description || "Sem descrição informada pelo anunciante."}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setIsShareModalOpen(true)} 
                  className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition"
                >
                  <Share2 size={18} /> Partilhar com um amigo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: CONTATO E MAPA */}
        <div className="md:col-span-1 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-black text-slate-800 text-lg mb-6 border-b border-slate-100 pb-3">
              Falar com Anunciante
            </h3>
            
            <div className="flex items-center gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white uppercase text-lg shadow-inner">
                {property.ownerName ? property.ownerName[0] : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-800 line-clamp-1">{property.ownerName || 'Anunciante'}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Proprietário / Corretor</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => setShowPhone(!showPhone)} 
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
              >
                <Phone size={18}/> {showPhone ? property.contactPhone || "Não informado" : "Ver Telefone"}
              </button>
              
              <button 
                onClick={handleWhatsApp} 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle size={18}/> Enviar WhatsApp
              </button>

              {property.contactEmail && (
                <a 
                  href={`mailto:${property.contactEmail}?subject=Interesse no imóvel: ${property.title}`} 
                  className="w-full bg-white border border-slate-200 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition flex items-center justify-center gap-2"
                >
                  <Mail size={18}/> Enviar E-mail
                </a>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-black text-slate-800 text-lg mb-4 border-b border-slate-100 pb-3">Localização</h3>
            
            <div className="h-56 rounded-xl overflow-hidden relative border border-slate-200">
              {!isLoaded ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-500">
                  Carregando mapa...
                </div>
              ) : (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={mapCenter}
                  zoom={property.privacy === 'approx' ? 14 : 16}
                  options={{
                    disableDefaultUI: true, // Remove botões extras para ficar mais clean
                    zoomControl: true, // Mantém apenas o controle de zoom
                    gestureHandling: 'cooperative' // Evita que o mapa dê zoom sozinho ao rolar a página no celular
                  }}
                >
                  {/* Só mostra o pino exato se a privacidade não for aproximada */}
                  {property.privacy !== 'approx' && (
                    <Marker position={mapCenter} />
                  )}
                </GoogleMap>
              )}
            </div>
            
            {property.privacy === 'approx' && (
              <p className="text-[11px] font-bold text-indigo-700 mt-4 text-center bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                O anunciante optou por mostrar apenas a região aproximada no mapa.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}