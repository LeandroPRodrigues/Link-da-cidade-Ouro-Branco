import React from 'react';
import { Calendar, Gauge, Fuel, Settings, Edit, Trash2 } from 'lucide-react';

export default function VehicleCard({ vehicle, isOwner, isAdmin, onEdit, onDelete, onClick }) {
  // Formata Preço
  const priceFormatted = parseFloat(vehicle.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border overflow-hidden cursor-pointer hover:shadow-md hover:border-blue-300 transition group flex flex-col h-full"
    >
      {/* Imagem de Capa */}
      <div className="h-48 relative overflow-hidden bg-slate-100">
        <img 
          src={vehicle.photos[0] || 'https://via.placeholder.com/400x300?text=Sem+Foto'} 
          alt={vehicle.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">
          {vehicle.year}
        </div>
        {vehicle.status !== 'active' && (
           <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
             <span className="bg-red-600 text-white font-bold px-3 py-1 -rotate-12 border border-white">VENDIDO / INATIVO</span>
           </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1 group-hover:text-blue-600 transition">
          {vehicle.brand} {vehicle.model}
        </h3>
        <p className="text-xs text-slate-500 mb-3 truncate" title={vehicle.title}>{vehicle.title}</p>
        
        <div className="text-xl font-bold text-slate-900 mb-4">
          {priceFormatted}
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-xs text-slate-600 mb-4">
          <div className="flex items-center gap-1"><Gauge size={14} className="text-slate-400"/> {vehicle.km.toLocaleString()} km</div>
          <div className="flex items-center gap-1"><Fuel size={14} className="text-slate-400"/> {vehicle.fuel}</div>
          <div className="flex items-center gap-1"><Settings size={14} className="text-slate-400"/> {vehicle.transmission}</div>
          <div className="flex items-center gap-1"><Calendar size={14} className="text-slate-400"/> Final {vehicle.plateEnd}</div>
        </div>

        {/* Botões de Ação (Para Admin ou Dono) */}
        {(isOwner || isAdmin) && (
          <div className="border-t pt-3 flex gap-2 mt-auto" onClick={e => e.stopPropagation()}>
            <button onClick={() => onEdit(vehicle)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold py-2 rounded flex items-center justify-center gap-1 transition">
              <Edit size={14}/> Editar
            </button>
            <button onClick={() => onDelete(vehicle.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-2 rounded flex items-center justify-center gap-1 transition">
              <Trash2 size={14}/> Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}