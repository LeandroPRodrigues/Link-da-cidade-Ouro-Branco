import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function SectionHeader({ title, link, linkText }) {
  return (
    <div className="flex justify-between items-end mb-6">
      <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-blue-600 pl-3">
        {title}
      </h2>
      {link && (
        <button 
          onClick={link} 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
        >
          {linkText || "Ver todos"} <ChevronRight size={16}/>
        </button>
      )}
    </div>
  );
}