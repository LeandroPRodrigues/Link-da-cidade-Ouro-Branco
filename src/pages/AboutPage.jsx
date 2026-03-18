import React from 'react';
import { Info, MapPin, Users, TrendingUp, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0 py-10 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* CABEÇALHO DA PÁGINA */}
        <div className="bg-blue-600 p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-lg shrink-0">
              <Info size={40} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Muito Prazer, somos o Link da Cidade!</h1>
              <p className="text-blue-100 font-medium text-lg max-w-xl">
                O coração digital de Ouro Branco. Feito por ouro-branquenses, para ouro-branquenses.
              </p>
            </div>
          </div>
        </div>
        
        {/* CONTEÚDO PRINCIPAL */}
        <div className="p-8 md:p-12">
          <div className="prose prose-slate md:prose-lg max-w-none text-slate-600">
            <p className="lead text-xl text-slate-700 font-medium mb-8">
              Nascido aos pés da imponente Serra de Ouro Branco, o <strong>Link da Cidade</strong> não é apenas um portal na internet; é um projeto de vida que reflete o orgulho da nossa terra, o calor da nossa gente e a força do nosso trabalho.
            </p>

            <h2 className="text-2xl font-black text-slate-800 border-b border-slate-100 pb-3 mb-5 mt-10">Nossas Raízes</h2>
            <p>
              Sabemos que Ouro Branco é uma cidade única. Uma terra que mistura a sua rica herança histórica com a força do desenvolvimento industrial e universitário. No entanto, percebemos que faltava um espaço que unisse tudo isso: um ponto de encontro onde o vizinho pudesse encontrar a notícia do seu bairro, o jovem achasse a sua primeira oportunidade de emprego, e o comerciante local tivesse voz para mostrar o seu trabalho para toda a cidade.
            </p>
            <p>
              Foi para preencher essa lacuna que o Link da Cidade surgiu. Nós somos a ponte entre a tradição do nosso comércio e a inovação do mundo digital.
            </p>

            <h2 className="text-2xl font-black text-slate-800 border-b border-slate-100 pb-3 mb-6 mt-12">Nossos Pilares</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors">
                <MapPin size={28} className="text-blue-600 mb-4" />
                <h3 className="font-bold text-slate-800 text-lg mb-2">Foco Local</h3>
                <p className="text-sm text-slate-600">Tudo o que acontece em Ouro Branco passa por aqui. Valorizamos a nossa cultura, os nossos eventos e a nossa rotina.</p>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-colors">
                <TrendingUp size={28} className="text-emerald-600 mb-4" />
                <h3 className="font-bold text-slate-800 text-lg mb-2">Impulso Econômico</h3>
                <p className="text-sm text-slate-600">Fortalecemos o comércio local através do nosso Guia Comercial e vitrine de Ofertas, ajudando o dinheiro a girar dentro da nossa cidade.</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-purple-300 transition-colors">
                <Users size={28} className="text-purple-600 mb-4" />
                <h3 className="font-bold text-slate-800 text-lg mb-2">Geração de Oportunidades</h3>
                <p className="text-sm text-slate-600">Conectamos talentos às empresas da região através de um banco de vagas atualizado e classificados seguros para todos.</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-pink-300 transition-colors">
                <Heart size={28} className="text-pink-600 mb-4" />
                <h3 className="font-bold text-slate-800 text-lg mb-2">Senso de Comunidade</h3>
                <p className="text-sm text-slate-600">Um espaço aberto e democrático, construído com a colaboração e a confiança de cada morador ouro-branquense.</p>
              </div>
            </div>

            <h2 className="text-2xl font-black text-slate-800 border-b border-slate-100 pb-3 mb-5 mt-12">Construa com a gente</h2>
            <p>
              O <strong>Link da Cidade</strong> é feito por você e para você. Se tem um negócio local, anuncie. Se está a procurar um novo caminho profissional, explore as nossas vagas. Se quer apenas saber o que está a acontecer na nossa amada Ouro Branco, sinta-se em casa.
            </p>
            <p className="font-bold text-blue-700 text-lg text-center mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
              Juntos, fazemos Ouro Branco ir mais longe!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}