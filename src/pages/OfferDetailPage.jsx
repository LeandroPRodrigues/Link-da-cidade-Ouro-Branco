import React from 'react';
import { ChevronLeft, ExternalLink, ShoppingBag, Tag } from 'lucide-react';

export default function OfferDetailPage({ offer, onBack }) {
  if (!offer) return null;

  const discount = offer.originalPrice && offer.price ? Math.round(((offer.originalPrice - offer.price) / offer.originalPrice) * 100) : 0;

  return (
    <div className="animate-in fade-in pb-10">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-600 transition">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <ShoppingBag className="text-pink-500" /> Detalhes da Oferta
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-8 bg-slate-50 flex items-center justify-center relative">
          {discount > 0 && (
            <div className="absolute top-4 left-4 bg-emerald-500 text-white font-black px-3 py-1 rounded-lg text-sm shadow-md">
              -{discount}% OFF
            </div>
          )}
          <img src={offer.image} alt={offer.title} className="w-full max-w-sm h-64 object-contain mix-blend-multiply" />
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <span className="inline-block bg-pink-100 text-pink-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider w-max mb-4">
            {offer.category}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-4 leading-tight">{offer.title}</h2>

          <div className="mb-8">
            {offer.originalPrice && (
              <p className="text-slate-400 line-through text-lg mb-1">
                De: {Number(offer.originalPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            )}
            <p className="text-4xl font-black text-emerald-600 flex items-center gap-2">
              {Number(offer.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <Tag size={14}/> Preço sujeito a alteração na loja oficial
            </p>
          </div>

          <a 
            href={offer.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-indigo-600 text-white font-black text-lg py-4 px-6 rounded-xl text-center hover:bg-indigo-700 transition shadow-lg flex items-center justify-center gap-2 hover:-translate-y-1"
          >
            <ExternalLink size={24} />
            Acessar Oferta na Loja
          </a>
        </div>
      </div>
    </div>
  );
}