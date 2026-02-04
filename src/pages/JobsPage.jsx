import React, { useState } from 'react';
import { Briefcase, Filter } from 'lucide-react';
import { JOB_CATEGORIES } from '../data/mockData';
import JobCard from '../components/JobCard';

export default function JobsPage({ jobsData, onJobClick }) {
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [activeSubcategory, setActiveSubcategory] = useState('Todas');

  // --- LÓGICA DE FILTROS ---
  const categories = ['Todas', ...Object.keys(JOB_CATEGORIES)];
  
  const subcategories = activeCategory !== 'Todas' && JOB_CATEGORIES[activeCategory]
    ? ['Todas', ...JOB_CATEGORIES[activeCategory]]
    : [];

  const filteredJobs = jobsData.filter(job => {
    const matchCategory = activeCategory === 'Todas' ? true : job.category === activeCategory;
    const matchSubcategory = activeSubcategory === 'Todas' ? true : job.subcategory === activeSubcategory;
    return matchCategory && matchSubcategory;
  });

  // Ordenar: Vagas ativas primeiro, depois por data mais recente
  const sortedJobs = filteredJobs.sort((a, b) => {
    const aExpired = new Date(a.expiresAt) < new Date();
    const bExpired = new Date(b.expiresAt) < new Date();
    if (aExpired === bExpired) return new Date(b.createdAt) - new Date(a.createdAt);
    return aExpired ? 1 : -1;
  });

  return (
    <div className="px-4 md:px-0 pb-12 animate-in fade-in">
      <div className="py-8 border-b mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Mural de Empregos</h2>
        <p className="text-slate-500 mt-2">Encontre sua próxima oportunidade profissional em Ouro Branco.</p>
      </div>

      {/* --- FILTROS --- */}
      <div className="space-y-4 mb-8">
        {/* Nível 1: Categorias */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setActiveSubcategory('Todas'); }}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white border text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Nível 2: Subcategorias (Cargos) */}
        {activeCategory !== 'Todas' && (
          <div className="flex gap-2 overflow-x-auto pb-2 animate-in slide-in-from-top-1">
            <div className="flex items-center text-slate-400 mr-2"><Filter size={14}/></div>
            {subcategories.map(sub => (
              <button
                key={sub}
                onClick={() => setActiveSubcategory(sub)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  activeSubcategory === sub
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* --- GRID DE VAGAS --- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedJobs.map(job => (
          <JobCard 
            key={job.id} 
            job={job} 
            onClick={() => onJobClick(job)} 
            isAdmin={false} // Nesta página pública, não mostra botões de admin
          />
        ))}
        
        {sortedJobs.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <Briefcase size={48} className="mx-auto text-slate-300 mb-4"/>
            <h3 className="text-lg font-bold text-slate-500">Nenhuma vaga encontrada</h3>
            <p className="text-slate-400">Tente mudar o filtro ou volte mais tarde.</p>
          </div>
        )}
      </div>
    </div>
  );
}