import React from 'react';
import { MapPin, Phone, MessageCircle } from 'lucide-react';

export default function GuideCard({ item, isAdmin, onEdit, onDelete }) {
  // Tenta identificar se o telefone é celular para gerar link de WhatsApp
  const cleanPhone = item.phone.replace(/\D/g, '');
  const isMobile = cleanPhone.length >= 10 && cleanPhone.startsWith('319');
  
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition flex flex-col h-full group">
      <div className="h-32 bg-slate-100 relative overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm">
          {item.category.split(' ')[0]}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-slate-800 mb-1 leading-tight">{item.name}</h3>
        <p className="text-xs text-slate-500 mb-3">{item.description}</p>
        
        <div className="text-xs text-slate-600 space-y-2 mb-4 flex-1">
          <div className="flex items-start gap-2">
            <MapPin size={14} className="shrink-0 text-blue-500 mt-0.5"/>
            <span>{item.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} className="shrink-0 text-green-600"/>
            <span className="font-bold">{item.phone}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-auto">
          {isMobile ? (
             <a 
               href={`https://wa.me/55${cleanPhone}`} 
               target="_blank" 
               rel="noreferrer"
               className="col-span-2 bg-green-50 text-green-700 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-green-100 transition"
             >
               <MessageCircle size={16}/> WhatsApp
             </a>
          ) : (
             <a 
               href={`tel:${cleanPhone}`} 
               className="col-span-2 bg-slate-50 text-slate-700 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition"
             >
               <Phone size={16}/> Ligar
             </a>
          )}

          {isAdmin && (
            <div className="col-span-2 flex gap-2 pt-2 border-t">
              <button onClick={() => onEdit(item)} className="flex-1 text-xs bg-blue-50 text-blue-600 py-1.5 rounded font-bold hover:bg-blue-100">Editar</button>
              <button onClick={() => onDelete(item.id)} className="flex-1 text-xs bg-red-50 text-red-600 py-1.5 rounded font-bold hover:bg-red-100">Excluir</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}