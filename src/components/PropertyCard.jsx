import React from 'react';
import { Map as MapIcon, CheckCircle, Share2, Trash2 } from 'lucide-react';

export default function PropertyCard({ property, isOwner, isAdmin, onDelete, onStatusChange, onClick }) {
  const isExpired = property.type !== 'Temporada' && new Date(property.expiresAt) < new Date();
  
  return (
    <div onClick={onClick} className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition group cursor-pointer ${isExpired ? 'opacity-60 grayscale' : ''}`}>
      <div className="h-48 relative overflow-hidden">
        <img src={property.photos[0] || "https://via.placeholder.com/400x300?text=Sem+Foto"} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={property.title} />
        <span className={`absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded ${property.type === 'Venda' ? 'bg-blue-600' : property.type === 'Aluguel' ? 'bg-green-600' : 'bg-purple-600'}`}>
          {property.type}
        </span>
        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-sm font-bold px-2 py-1 rounded backdrop-blur-sm">
          R$ {parseFloat(property.price).toLocaleString('pt-BR')}
          {property.type !== 'Venda' && '/mês'}
        </span>
        
        {property.status !== 'active' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold px-4 py-1 transform -rotate-12 border-2 border-white text-lg uppercase">{property.status}</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-slate-800 mb-1 truncate">{property.title}</h3>
        <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
          <MapIcon size={12}/> {property.privacy === 'exact' ? property.address : "Localização Aproximada"}
        </p>
        
        <div className="flex justify-between border-t pt-3 text-xs text-slate-600 font-medium">
          <span>{property.bedrooms} Quartos</span>
          <span>{property.area}m²</span>
          <span>{property.garage} Vagas</span>
        </div>

        {(isOwner || isAdmin) && (
          <div className="mt-4 pt-3 border-t grid grid-cols-2 gap-2" onClick={e => e.stopPropagation()}>
            {property.status === 'active' ? (
              <button 
                onClick={() => onStatusChange(property.id, property.type === 'Venda' ? 'vendido' : 'alugado')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs py-2 rounded flex items-center justify-center gap-1"
              >
                <CheckCircle size={12}/> {property.type === 'Venda' ? 'Vender' : 'Alugar'}
              </button>
            ) : (
              <button 
                onClick={() => onStatusChange(property.id, 'active')}
                className="bg-green-50 hover:bg-green-100 text-green-600 text-xs py-2 rounded flex items-center justify-center gap-1"
              >
                <Share2 size={12}/> Reativar
              </button>
            )}
            <button 
              onClick={() => onDelete(property.id)}
              className="bg-red-50 hover:bg-red-100 text-red-600 text-xs py-2 rounded flex items-center justify-center gap-1"
            >
              <Trash2 size={12}/> Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}