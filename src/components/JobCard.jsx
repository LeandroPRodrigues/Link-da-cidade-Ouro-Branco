import React from 'react';
import { MapPin, Clock, DollarSign } from 'lucide-react';

export default function JobCard({ job, isAdmin, onEdit, onDelete, onClick }) {
  // Cálculo de dias restantes
  const today = new Date();
  const expireDate = new Date(job.expiresAt);
  const diffTime = expireDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isExpired = diffDays < 0;

  // Formatação de Salário
  const formatSalary = (val) => val ? val : 'A combinar';

  // Cores por tipo de contrato
  const getTypeColor = (type) => {
    switch(type) {
      case 'CLT': return 'bg-blue-100 text-blue-700';
      case 'Estágio': return 'bg-green-100 text-green-700';
      case 'PJ': return 'bg-purple-100 text-purple-700';
      default: return 'bg-orange-100 text-orange-700';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border p-5 cursor-pointer transition hover:shadow-md hover:border-blue-300 group relative flex flex-col justify-between h-full ${isExpired ? 'opacity-60 grayscale' : ''}`}
    >
      <div>
        {/* Cabeçalho do Card */}
        <div className="flex justify-between items-start mb-3">
          <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide ${getTypeColor(job.type)}`}>
            {job.type}
          </span>
          {isExpired && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-1 rounded uppercase">Expirada</span>}
        </div>

        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition leading-tight mb-1">{job.title}</h3>
        <p className="text-sm font-medium text-slate-500 mb-4">{job.company}</p>

        {/* Detalhes */}
        <div className="space-y-2 text-sm text-slate-600 mb-4">
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-green-600 shrink-0"/>
            <span className="font-medium truncate">{formatSalary(job.salary)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-slate-400 shrink-0"/>
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className={isExpired ? 'text-red-500' : diffDays <= 5 ? 'text-orange-500' : 'text-slate-400'}/>
            <span className={isExpired ? 'text-red-600 font-bold' : diffDays <= 5 ? 'text-orange-600 font-medium' : ''}>
              {isExpired ? 'Encerrada' : `Expira em ${diffDays} dias`}
            </span>
          </div>
        </div>
      </div>

      {/* Botões de Admin */}
      {isAdmin && (
        <div className="border-t pt-3 flex gap-2 mt-auto" onClick={e => e.stopPropagation()}>
          <button onClick={() => onEdit(job)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-2 rounded transition">Editar</button>
          <button onClick={() => onDelete(job.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-2 rounded transition">Excluir</button>
        </div>
      )}
    </div>
  );
}