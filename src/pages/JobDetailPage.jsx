import React from 'react';
import { ArrowLeft, MapPin, DollarSign, Briefcase, Clock, Calendar, AlertCircle } from 'lucide-react';

export default function JobDetailPage({ job, onBack }) {
  if (!job) return null;

  // Verifica expiração
  const today = new Date();
  const expireDate = new Date(job.expiresAt);
  const diffTime = expireDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isExpired = diffDays < 0;

  return (
    <div className="animate-in fade-in pb-12">
      {/* Botão Voltar */}
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition">
          <ArrowLeft size={20}/> Voltar para lista
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-0 grid md:grid-cols-3 gap-8">
        
        {/* --- COLUNA PRINCIPAL (Detalhes) --- */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
            {isExpired && (
              <div className="absolute top-0 left-0 right-0 bg-red-50 text-red-600 text-center text-xs font-bold py-1 border-b border-red-100">
                VAGA ENCERRADA / EXPIRADA
              </div>
            )}
            
            <div className="flex justify-between items-start mb-4 mt-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{job.title}</h1>
                <h2 className="text-lg font-medium text-blue-600">{job.company}</h2>
              </div>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wide">
                {job.type}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-8 border-b pb-8">
              <span className="flex items-center gap-1"><MapPin size={16}/> {job.location}</span>
              <span className="flex items-center gap-1"><DollarSign size={16}/> {job.salary || 'A combinar'}</span>
              <span className="flex items-center gap-1"><Briefcase size={16}/> {job.subcategory}</span>
              <span className="flex items-center gap-1"><Calendar size={16}/> Publicado em {new Date(job.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-bold text-slate-800 mb-3">Descrição da Vaga</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-800 mb-3">Requisitos</h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-line">
                  {job.requirements || "Não especificado."}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* --- COLUNA LATERAL (Candidatura) --- */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 sticky top-24">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Interessado?</h3>
            
            {isExpired ? (
              <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-lg text-center">
                <AlertCircle className="mx-auto mb-2" size={24}/>
                <p className="font-bold">Processo Encerrado</p>
                <p className="text-xs mt-1">O prazo para esta vaga expirou.</p>
              </div>
            ) : (
              <>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-800 font-medium mb-1">Como se candidatar:</p>
                  <p className="text-slate-700 font-bold break-words">{job.contact}</p>
                </div>
                
                <div className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
                   <Clock size={12}/> Vaga expira em {diffDays} dias
                </div>

                <div className="mt-6 pt-6 border-t text-[10px] text-slate-400 leading-tight text-center">
                  O Link da Cidade apenas divulga as vagas. Não nos responsabilizamos pelo processo seletivo das empresas.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}