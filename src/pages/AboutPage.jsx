import React from 'react';
import { Info } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0 py-10 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Info size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Quem Somos</h1>
            <p className="text-slate-500 font-medium">Conheça o Link da Cidade Ouro Branco</p>
          </div>
        </div>
        
        <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-headings:text-slate-800">
          <h3>Nossa Missão</h3>
          <p>O <strong>Link da Cidade</strong> nasceu com o propósito de conectar os moradores, comércios e oportunidades de Ouro Branco num só lugar. Queremos ser o ponto de partida digital para tudo o que acontece na nossa região.</p>
          
          <h3>O que oferecemos</h3>
          <ul>
             <li><strong>Notícias:</strong> Informação local em tempo real, com cobertura dos principais eventos da cidade.</li>
             <li><strong>Guia Comercial:</strong> Encontre facilmente lojas, serviços e profissionais perto de si.</li>
             <li><strong>Classificados:</strong> Espaço seguro para anunciar e encontrar imóveis e veículos.</li>
             <li><strong>Oportunidades:</strong> Portal dedicado a conectar quem procura emprego com as empresas locais.</li>
          </ul>
          
          <h3>Faça Parte</h3>
          <p>Este é um espaço construído para a comunidade. Se tem um negócio, anuncie connosco. Se tem uma notícia, partilhe. O Link da Cidade é o seu portal!</p>
        </div>
      </div>
    </div>
  );
}