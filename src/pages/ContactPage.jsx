import React from 'react';
import { Mail, MessageCircle, MapPin } from 'lucide-react';

export default function ContactPage({ settingsData }) {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0 py-10 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
        <div className="mb-8 border-b border-slate-100 pb-6 text-center">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Fale Connosco</h1>
          <p className="text-slate-500 font-medium mt-2">Estamos aqui para ajudar. Escolha o melhor canal para nos contactar.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center hover:border-indigo-300 transition-colors">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm mb-4">
              <Mail size={24} />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">E-mail</h3>
            <p className="text-sm text-slate-500">contato@linkdacidade.com</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm mb-4">
              <MessageCircle size={24} />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">WhatsApp</h3>
            <p className="text-sm text-slate-500 mb-3">Atendimento rápido</p>
            {settingsData?.whatsapp ? (
               <a href={settingsData.whatsapp} target="_blank" rel="noopener noreferrer" className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 px-4 rounded-lg transition shadow-sm w-full">Enviar Mensagem</a>
            ) : (
               <span className="text-xs text-slate-400">Indisponível de momento</span>
            )}
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center hover:border-indigo-300 transition-colors">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm mb-4">
              <MapPin size={24} />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Localização</h3>
            <p className="text-sm text-slate-500">Ouro Branco, Minas Gerais<br/>Brasil</p>
          </div>

        </div>
      </div>
    </div>
  );
}