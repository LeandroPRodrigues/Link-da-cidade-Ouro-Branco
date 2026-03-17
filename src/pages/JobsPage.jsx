import React, { useState } from 'react';
import { Briefcase, Search, MapPin, PlusCircle, X, Clock } from 'lucide-react';
import JobForm from '../components/JobForm';

export default function JobsPage({ jobsData, onJobClick, checkLimit, onCrud, user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredJobs = jobsData?.filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAddClick = () => {
    if (checkLimit) {
      checkLimit(() => setIsFormOpen(true));
    } else {
      setIsFormOpen(true);
    }
  };

  return (
    <div className="animate-in fade-in pb-10">
      <div className="bg-blue-600 rounded-2xl p-6 md:p-10 text-white mb-8 shadow-sm">
        <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
          <Briefcase size={32} /> Vagas de Emprego
        </h1>
        <p className="text-blue-100 mb-8 max-w-xl text-sm md:text-base">Encontre a sua próxima oportunidade em Ouro Branco e região, ou anuncie uma vaga para a sua empresa.</p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Buscar por cargo, empresa ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-blue-300 shadow-sm font-medium"
            />
          </div>
          <button onClick={handleAddClick} className="bg-white text-blue-600 px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition shadow-sm whitespace-nowrap">
            <PlusCircle size={20} /> Cadastrar Vaga
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.length > 0 ? filteredJobs.map(job => (
          <div key={job.id} onClick={() => onJobClick && onJobClick(job)} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:border-blue-300 transition-all hover:shadow-md group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-800 leading-tight mb-1 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                <p className="text-sm font-medium text-slate-600">{job.company}</p>
              </div>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1.5 rounded uppercase tracking-wider shrink-0">{job.type}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100">
              <span className="flex items-center gap-1 font-medium"><MapPin size={14}/> {job.location}</span>
              {job.salary && <span className="font-bold text-emerald-600 border border-emerald-100 bg-emerald-50 px-2 py-0.5 rounded">{job.salary}</span>}
              <span className="flex items-center gap-1 font-medium ml-auto"><Clock size={14}/> {new Date(job.createdAt || job.date).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500">
            Nenhuma vaga encontrada com estes termos.
          </div>
        )}
      </div>

      {/* MODAL DO FORMULÁRIO DE VAGA */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto custom-scrollbar relative">
            <button onClick={() => setIsFormOpen(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black text-slate-800 mb-6 border-b border-slate-100 pb-4">Anunciar Vaga de Emprego</h2>
            <JobForm 
              onSuccess={(data) => {
                onCrud.addJob(data);
                setIsFormOpen(false);
                alert("Vaga publicada com sucesso! Ela ficará visível por 30 dias.");
              }}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}