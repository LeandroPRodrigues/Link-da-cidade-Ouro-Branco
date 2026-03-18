import React from 'react';
import { Mail, MessageCircle, MapPin, Megaphone, Facebook, Instagram, Youtube, Send } from 'lucide-react';

export default function ContactPage({ settingsData }) {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0 py-10 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* CABEÇALHO DA PÁGINA */}
        <div className="bg-blue-600 p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-lg shrink-0">
              <Send size={40} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Entre em Contato</h1>
              <p className="text-blue-100 font-medium text-lg max-w-xl">
                Estamos aqui para ajudar! Escolha o canal da sua preferência para falar com a nossa equipa.
              </p>
            </div>
          </div>
        </div>
        
        {/* CONTEÚDO PRINCIPAL */}
        <div className="p-8 md:p-12">
          
          {/* CARDS DE CONTACTO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 flex flex-col items-center text-center hover:border-indigo-300 transition-all hover:shadow-md group">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm mb-5 group-hover:scale-110 transition-transform">
                <Mail size={28} />
              </div>
              <h3 className="font-black text-slate-800 text-lg mb-1">E-mail</h3>
              <p className="text-sm text-slate-500 mb-4">Envie-nos uma mensagem a qualquer momento.</p>
              <a href="mailto:linkdacidade@gmail.com" className="font-bold text-indigo-600 hover:text-indigo-800 transition">
                linkdacidade@gmail.com
              </a>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 flex flex-col items-center text-center hover:border-emerald-300 transition-all hover:shadow-md group">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm mb-5 group-hover:scale-110 transition-transform">
                <MessageCircle size={28} />
              </div>
              <h3 className="font-black text-slate-800 text-lg mb-1">WhatsApp</h3>
              <p className="text-sm text-slate-500 mb-5">Atendimento rápido e direto com a nossa equipa.</p>
              {settingsData?.whatsapp ? (
                 <a href={settingsData.whatsapp} target="_blank" rel="noopener noreferrer" className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold py-2.5 px-6 rounded-xl transition shadow-sm w-full">
                   Enviar Mensagem
                 </a>
              ) : (
                 <span className="text-sm font-medium text-slate-400 bg-slate-200 py-2.5 px-6 rounded-xl w-full">
                   Indisponível de momento
                 </span>
              )}
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 flex flex-col items-center text-center hover:border-blue-300 transition-all hover:shadow-md group">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm mb-5 group-hover:scale-110 transition-transform">
                <MapPin size={28} />
              </div>
              <h3 className="font-black text-slate-800 text-lg mb-1">Localização</h3>
              <p className="text-sm text-slate-500 mb-4">Sede das nossas operações.</p>
              <p className="font-bold text-slate-700">
                Ouro Branco<br/>Minas Gerais, Brasil
              </p>
            </div>

          </div>

          {/* BANNER PARA ANUNCIANTES */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 mb-12 shadow-lg relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-black mb-3 flex items-center justify-center md:justify-start gap-3">
                <Megaphone className="text-yellow-300" size={32} /> Quer anunciar no portal?
              </h2>
              <p className="text-indigo-100 text-base md:text-lg">
                Destaque a sua empresa, produtos ou serviços para milhares de moradores de Ouro Branco. Para conhecer os nossos planos e fazer uma parceria, procure-nos através do nosso <strong>e-mail</strong> ou <strong>telefone/WhatsApp</strong>.
              </p>
            </div>
            
            <div className="relative z-10 shrink-0 flex flex-col w-full md:w-auto gap-3">
              <a href="mailto:linkdacidade@gmail.com" className="bg-white text-indigo-700 px-8 py-4 rounded-xl font-black text-center hover:bg-indigo-50 hover:scale-105 transition-all shadow-md">
                Enviar E-mail Comercial
              </a>
              {settingsData?.whatsapp && (
                <a href={settingsData.whatsapp} target="_blank" rel="noopener noreferrer" className="bg-emerald-500 text-white px-8 py-4 rounded-xl font-black text-center hover:bg-emerald-400 hover:scale-105 transition-all shadow-md">
                  Falar no WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* REDES SOCIAIS (Apenas aparece se houver alguma cadastrada) */}
          {(settingsData?.facebook || settingsData?.instagram || settingsData?.youtube) && (
            <div className="text-center border-t border-slate-100 pt-10">
              <h3 className="text-xl font-black text-slate-800 mb-6">Siga as nossas Redes Sociais</h3>
              <div className="flex justify-center gap-4">
                {settingsData.facebook && (
                  <a href={settingsData.facebook} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 shadow-sm">
                    <Facebook size={24} />
                  </a>
                )}
                {settingsData.instagram && (
                  <a href={settingsData.instagram} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all transform hover:scale-110 shadow-sm">
                    <Instagram size={24} />
                  </a>
                )}
                {settingsData.youtube && (
                  <a href={settingsData.youtube} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all transform hover:scale-110 shadow-sm">
                    <Youtube size={24} />
                  </a>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}