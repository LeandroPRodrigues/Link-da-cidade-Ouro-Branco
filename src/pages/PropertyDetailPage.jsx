import React, { useState } from 'react';
import { ArrowLeft, Map as MapIcon, Phone, MessageCircle, Mail } from 'lucide-react';
import LocationPicker from '../components/LocationPicker';

export default function PropertyDetailPage({ property, onBack }) {
  const [showPhone, setShowPhone] = useState(false);

  if (!property) return null;

  const handleWhatsApp = () => {
    if (!property.contactPhone) return alert("Telefone não informado");
    
    // Gera o link para WhatsApp
    const message = `Olá, vi o imóvel "${property.title}" no Link da Cidade e tenho interesse. Link: https://linkdacidade.com.br/imovel/${property.id}`;
    const cleanPhone = property.contactPhone.replace(/\D/g,'');
    const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
  };

  return (
    <div className="px-4 md:px-0 pb-12 animate-in fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 mt-6 font-medium"><ArrowLeft size={20}/> Voltar para lista</button>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <img src={property.photos[0]} className="w-full h-[400px] object-cover" alt={property.title} />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block ${property.type === 'Venda' ? 'bg-blue-600' : property.type === 'Aluguel' ? 'bg-green-600' : 'bg-purple-600'}`}>{property.type}</span>
                  <h1 className="text-3xl font-bold text-slate-800">{property.title}</h1>
                  <p className="text-slate-500 flex items-center gap-1 mt-1"><MapIcon size={16}/> {property.privacy === 'exact' ? property.address : "Localização Aproximada (Bairro)"}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">R$ {parseFloat(property.price).toLocaleString('pt-BR')}</p>
                  {property.type !== 'Venda' && <p className="text-sm text-slate-500">/mês</p>}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 py-6 border-t border-b border-slate-100 text-center">
                <div><span className="block font-bold text-xl text-slate-700">{property.bedrooms}</span><span className="text-xs text-slate-500">Quartos</span></div>
                <div><span className="block font-bold text-xl text-slate-700">{property.bathrooms}</span><span className="text-xs text-slate-500">Banheiros</span></div>
                <div><span className="block font-bold text-xl text-slate-700">{property.garage}</span><span className="text-xs text-slate-500">Vagas</span></div>
                <div><span className="block font-bold text-xl text-slate-700">{property.area}</span><span className="text-xs text-slate-500">m²</span></div>
              </div>

              <div className="mt-6">
                <h3 className="font-bold text-lg mb-2">Sobre o Imóvel</h3>
                <p className="text-slate-600 leading-relaxed">{property.description || "Sem descrição informada."}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          {/* Card Contato */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-bold text-lg mb-4">Interessado?</h3>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600 uppercase text-xl">{property.userName[0]}</div>
              <div>
                <p className="font-bold text-slate-800">{property.userName}</p>
                <p className="text-xs text-slate-500">Anunciante</p>
              </div>
            </div>
            
            <button onClick={() => setShowPhone(!showPhone)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 mb-2">
              <Phone size={20}/> {showPhone ? property.contactPhone || "Não informado" : "Ver Telefone"}
            </button>
            
            <button onClick={handleWhatsApp} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 mb-2">
              <MessageCircle size={20}/> WhatsApp / Mensagem
            </button>

            {property.contactEmail && (
              <a href={`mailto:${property.contactEmail}?subject=Interesse no imóvel: ${property.title}`} className="block w-full bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-lg hover:bg-slate-50 transition text-center flex items-center justify-center gap-2">
                <Mail size={20}/> Enviar E-mail
              </a>
            )}
          </div>

          {/* Card Mapa */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <h3 className="font-bold text-sm mb-3 text-slate-700">Localização</h3>
            <div className="h-48 rounded-lg overflow-hidden relative">
              <LocationPicker lat={property.location?.lat || -20.5} lng={property.location?.lng || -43.7} privacy={property.privacy} readOnly />
            </div>
            {property.privacy === 'approx' && <p className="text-xs text-slate-500 mt-2 text-center bg-blue-50 p-2 rounded">O anunciante optou por mostrar apenas a região aproximada.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}