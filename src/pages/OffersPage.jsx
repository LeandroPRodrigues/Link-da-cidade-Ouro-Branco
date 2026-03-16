import React from 'react';
import { ShoppingBag, Tag, ExternalLink } from 'lucide-react';

export default function OffersPage({ offersData, onOfferClick }) {
  const offers = offersData || [];

  return (
    <div className="animate-in fade-in pb-10">
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-8 rounded-2xl shadow-md mb-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
            <ShoppingBag size={32} /> Shopping Ouro Branco
          </h1>
          <p className="text-pink-100 font-medium">As melhores ofertas, descontos e cupons separados para si.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {offers.map(offer => {
          const hasDiscount = offer.originalPrice && Number(offer.originalPrice) > Number(offer.price);
          const discountPct = hasDiscount ? Math.round(((offer.originalPrice - offer.price) / offer.originalPrice) * 100) : 0;

          return (
            <div key={offer.id} onClick={() => onOfferClick(offer)} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition cursor-pointer group flex flex-col">
              <div className="h-48 bg-white p-4 relative flex items-center justify-center border-b border-slate-50">
                {hasDiscount && (
                  <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-sm z-10">
                    -{discountPct}%
                  </span>
                )}
                <img src={offer.image} alt={offer.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-500 mix-blend-multiply" />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider mb-1">{offer.category}</span>
                <h3 className="font-bold text-slate-800 text-sm leading-snug mb-3 line-clamp-2 flex-1">{offer.title}</h3>
                
                <div className="mt-auto">
                  {hasDiscount && (
                    <p className="text-xs text-slate-400 line-through mb-0.5">
                      {Number(offer.originalPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  )}
                  <p className="text-xl font-black text-emerald-600 mb-3">
                    {Number(offer.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                  <button className="w-full py-2.5 bg-slate-50 hover:bg-indigo-50 text-indigo-600 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                    Ver Detalhes <ExternalLink size={14}/>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {offers.length === 0 && (
         <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
           <Tag size={48} className="mx-auto text-slate-200 mb-4" />
           <p className="text-slate-500 font-medium">Nenhuma oferta disponível no momento.</p>
         </div>
      )}
    </div>
  );
}