import React, { useState, useEffect } from 'react';
import { 
  Home, Briefcase, Car, Store, Menu, User, Radio, LogOut, 
  List, Calendar, Loader, PlusCircle
} from 'lucide-react';

import { db } from './utils/database';
import { validateCPF, formatCPF } from './utils/cpfValidator'; // Importa o validador
import Modal from './components/Modal';

// Páginas
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import RealEstatePage from './pages/RealEstatePage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AdminPage from './pages/AdminPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import VehiclesPage from './pages/VehiclesPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import GuidePage from './pages/GuidePage';
import GuideDetailPage from './pages/GuideDetailPage';

const APP_BRAND = "Link da Cidade"; 
const CITY_NAME = "Ouro Branco";

export default function App() {
  // --- ESTADOS GLOBAIS ---
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null); 
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Estados de Seleção
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedGuideItem, setSelectedGuideItem] = useState(null);
  
  // Dados
  const [newsData, setNewsData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);
  const [jobsData, setJobsData] = useState([]);
  const [vehiclesData, setVehiclesData] = useState([]);
  const [guideData, setGuideData] = useState([]);

  // --- CARREGAMENTO INICIAL ---
  const loadAllData = async () => {
    try {
      const [n, e, p, j, v, g] = await Promise.all([
        db.getNews(), db.getEvents(), db.getProperties(), db.getJobs(), db.getVehicles(), db.getGuide()
      ]);
      setNewsData(n); setEventsData(e); setPropertiesData(p); setJobsData(j); setVehiclesData(v); setGuideData(g);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAllData(); }, []);
  
  // --- CRUD (Injetando ownerId) ---
  const crud = {
    addNews: async (item) => { await db.addNews(item); setNewsData(await db.getNews()); },
    updateNews: async (item) => { await db.updateNews(item); setNewsData(await db.getNews()); },
    deleteNews: async (id) => { await db.deleteNews(id); setNewsData(await db.getNews()); },
    
    addEvent: async (item) => { await db.addEvent(item); setEventsData(await db.getEvents()); },
    updateEvent: async (item) => { await db.updateEvent(item); setEventsData(await db.getEvents()); },
    deleteEvent: async (id) => { await db.deleteEvent(id); setEventsData(await db.getEvents()); },

    // Para Imóveis e Veículos, adicionamos o ID do dono
    addProperty: async (item) => { 
      // Vincula ao usuário atual
      const itemWithUser = { ...item, ownerId: user.id, ownerName: user.name };
      await db.addProperty(itemWithUser); 
      setPropertiesData(await db.getProperties()); 
    },
    updateProperty: async (item) => { await db.updateProperty(item); setPropertiesData(await db.getProperties()); },
    deleteProperty: async (id) => { await db.deleteProperty(id); setPropertiesData(await db.getProperties()); },

    addJob: async (item) => { await db.addJob(item); setJobsData(await db.getJobs()); },
    updateJob: async (item) => { await db.updateJob(item); setJobsData(await db.getJobs()); },
    deleteJob: async (id) => { await db.deleteJob(id); setJobsData(await db.getJobs()); },

    addVehicle: async (item) => { 
      const itemWithUser = { ...item, ownerId: user.id, ownerName: user.name };
      await db.addVehicle(itemWithUser); 
      setVehiclesData(await db.getVehicles()); 
    },
    updateVehicle: async (item) => { await db.updateVehicle(item); setVehiclesData(await db.getVehicles()); },
    deleteVehicle: async (id) => { await db.deleteVehicle(id); setVehiclesData(await db.getVehicles()); },

    addGuideItem: async (item) => { await db.addGuideItem(item); setGuideData(await db.getGuide()); },
    updateGuideItem: async (item) => { await db.updateGuideItem(item); setGuideData(await db.getGuide()); },
    deleteGuideItem: async (id) => { await db.deleteGuideItem(id); setGuideData(await db.getGuide()); }
  };

  // --- REGRAS DE LIMITES PARA USUÁRIOS COMUNS ---
  const handleAddPropertyClick = (openModalCallback) => {
    if (!user) { alert("Faça login para anunciar."); setIsLoginOpen(true); return; }
    if (user.role === 'admin') { openModalCallback(); return; } // Admin ilimitado

    const myProperties = propertiesData.filter(p => p.ownerId === user.id);
    if (myProperties.length >= 1) {
      alert("Limite atingido! Você só pode cadastrar 1 imóvel gratuitamente.");
    } else {
      openModalCallback();
    }
  };

  const handleAddVehicleClick = (openModalCallback) => {
    if (!user) { alert("Faça login para anunciar."); setIsLoginOpen(true); return; }
    if (user.role === 'admin') { openModalCallback(); return; } // Admin ilimitado

    const myVehicles = vehiclesData.filter(v => v.ownerId === user.id);
    if (myVehicles.length >= 2) {
      alert("Limite atingido! Você só pode cadastrar 2 veículos gratuitamente.");
    } else {
      openModalCallback();
    }
  };

  // --- AUTENTICAÇÃO ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const u = await db.findUser(e.target.email.value, e.target.password.value);
    setLoading(false);
    
    if(u) { 
      setUser(u); 
      setIsLoginOpen(false); 
      if(u.role === 'admin') setCurrentPage('admin'); 
    } else {
      alert("E-mail ou senha incorretos.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      phone: e.target.phone.value,
      cpf: e.target.cpf.value,
      birthDate: e.target.birthDate.value,
      type: 'user',
      role: 'user',
      createdAt: new Date().toISOString()
    };

    // Validações
    if (!validateCPF(formData.cpf)) { alert("CPF inválido!"); return; }
    
    setLoading(true);
    
    // Verifica duplicidade
    const cpfExists = await db.checkCpfExists(formData.cpf);
    if (cpfExists) { setLoading(false); alert("Este CPF já possui cadastro."); return; }

    const emailExists = await db.checkEmailExists(formData.email);
    if (emailExists) { setLoading(false); alert("Este E-mail já está em uso."); return; }

    // Salva
    await db.saveUser(formData);
    setLoading(false);
    alert("Cadastro realizado com sucesso! Faça login."); 
    setAuthMode('login');
  };

  const handleLogout = () => { setUser(null); setCurrentPage('home'); };

  // --- COMPONENTES AUXILIARES ---
  const NavItem = ({ page, label, icon: Icon }) => (
    <button onClick={() => { setCurrentPage(page); setIsMobileMenuOpen(false); }} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm font-medium ${currentPage === page ? 'bg-slate-100 text-blue-700' : 'text-slate-600 hover:text-blue-600'}`}>
      {Icon && <Icon size={18} />} {label}
    </button>
  );

  // Intercepta a abertura do modal de criação dentro das páginas
  // Passamos uma versão modificada do 'onCrud' ou controlamos via props, 
  // mas aqui vamos passar a função de verificação para as páginas.
  
  if (loading && !newsData.length && !user) return (<div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-400"><Loader className="animate-spin mb-4 text-blue-600" size={48} /><p>Carregando...</p></div>);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- CABEÇALHO --- */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm"><Radio className="text-white" size={20} /></div>
            <div className="leading-tight"><h1 className="font-bold text-lg tracking-tight text-slate-800">Link<span className="text-blue-600">daCidade</span></h1><p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Portal Oficial</p></div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <NavItem page="home" label="Início" />
            <NavItem page="news" label="Notícias" />
            <NavItem page="real_estate" label="Imóveis" />
            <NavItem page="events" label="Eventos" />
            <NavItem page="jobs" label="Empregos" />
            <NavItem page="vehicles" label="Veículos" icon={Car} />
            <NavItem page="guide" label="Guia" icon={Store} />
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
               <div className="flex items-center gap-3">
                 {/* SOMENTE ADMIN VÊ O BOTÃO ADMIN */}
                 {user.role === 'admin' && <button onClick={() => setCurrentPage('admin')} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded font-bold border border-red-200">Admin</button>}
                 
                 <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1 pr-3 rounded-full border border-transparent hover:border-slate-200 transition" onClick={handleLogout}>
                   <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold border border-slate-300 uppercase">{user.name[0]}</div>
                   <LogOut size={14} className="text-slate-400 ml-1"/>
                 </div>
               </div>
            ) : (
              <div className="flex gap-2">
                {/* BOTÕES SEPARADOS DE ENTRAR E CADASTRAR */}
                <button onClick={() => { setIsLoginOpen(true); setAuthMode('register'); }} className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 px-4 py-2 rounded-lg transition">
                  Cadastrar
                </button>
                <button onClick={() => { setIsLoginOpen(true); setAuthMode('login'); }} className="flex items-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-sm transition">
                  <User size={18} /> Entrar
                </button>
              </div>
            )}
            <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu /></button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
            <NavItem page="home" label="Início" icon={Home}/>
            <NavItem page="news" label="Notícias" icon={List}/>
            <NavItem page="real_estate" label="Imóveis" icon={Home}/>
            <NavItem page="events" label="Eventos" icon={Calendar}/>
            <NavItem page="jobs" label="Empregos" icon={Briefcase}/>
            <NavItem page="vehicles" label="Veículos" icon={Car}/>
            <NavItem page="guide" label="Guia" icon={Store}/>
            {!user && <button onClick={() => { setIsLoginOpen(true); setAuthMode('register'); }} className="w-full text-left px-3 py-2 text-sm font-bold text-blue-600">Cadastrar</button>}
          </div>
        )}
      </header>

      {/* --- ROTEADOR --- */}
      <main className="max-w-7xl mx-auto min-h-[calc(100vh-64px)]">
        {currentPage === 'home' && <HomePage navigate={setCurrentPage} newsData={newsData} eventsData={eventsData} onNewsClick={(n) => { setSelectedNews(n); setCurrentPage('news_detail'); window.scrollTo(0,0); }} />}
        
        {currentPage === 'news_detail' && <NewsDetailPage news={selectedNews} onBack={() => setCurrentPage('news')} />}
        {currentPage === 'news' && <NewsPage newsData={newsData} onNewsClick={(n) => { setSelectedNews(n); setCurrentPage('news_detail'); window.scrollTo(0,0); }} />}
        
        {currentPage === 'events' && <EventsPage eventsData={eventsData} onEventClick={(evt) => { setSelectedEvent(evt); setCurrentPage('event_detail'); window.scrollTo(0,0); }} />}
        {currentPage === 'event_detail' && <EventDetailPage event={selectedEvent} onBack={() => setCurrentPage('events')} />}
        
        {/* Passando a regra de limite para a página de imóveis */}
        {currentPage === 'real_estate' && (
          <RealEstatePage 
            user={user} 
            navigate={setCurrentPage} 
            propertiesData={propertiesData} 
            onCrud={crud} 
            checkLimit={handleAddPropertyClick} // <--- AQUI
            onSelectProperty={(p) => { setSelectedProperty(p); setCurrentPage('property_detail'); window.scrollTo(0,0); }} 
          />
        )}
        {currentPage === 'property_detail' && <PropertyDetailPage property={selectedProperty} onBack={() => setCurrentPage('real_estate')} />}
        
        {currentPage === 'jobs' && <JobsPage jobsData={jobsData} onJobClick={(j) => { setSelectedJob(j); setCurrentPage('job_detail'); window.scrollTo(0,0); }} />}
        {currentPage === 'job_detail' && <JobDetailPage job={selectedJob} onBack={() => setCurrentPage('jobs')} />}
        
        {/* Passando a regra de limite para a página de veículos */}
        {currentPage === 'vehicles' && (
          <VehiclesPage 
            vehiclesData={vehiclesData} 
            user={user} 
            onCrud={crud} 
            checkLimit={handleAddVehicleClick} // <--- AQUI
            onVehicleClick={(v) => { setSelectedVehicle(v); setCurrentPage('vehicle_detail'); window.scrollTo(0,0); }} 
          />
        )}
        {currentPage === 'vehicle_detail' && <VehicleDetailPage vehicle={selectedVehicle} onBack={() => setCurrentPage('vehicles')} />}
        
        {currentPage === 'guide' && <GuidePage guideData={guideData} onLocalClick={(item) => { setSelectedGuideItem(item); setCurrentPage('guide_detail'); window.scrollTo(0,0); }} />}
        {currentPage === 'guide_detail' && <GuideDetailPage item={selectedGuideItem} onBack={() => setCurrentPage('guide')} />}

        {/* PROTEÇÃO DA ROTA ADMIN */}
        {currentPage === 'admin' && user?.role === 'admin' ? (
          <AdminPage 
            newsData={newsData} eventsData={eventsData} propertiesData={propertiesData} 
            jobsData={jobsData} vehiclesData={vehiclesData} guideData={guideData} 
            crud={crud}
          />
        ) : currentPage === 'admin' ? (
           <div className="flex flex-col items-center justify-center py-20">
             <AlertTriangle size={48} className="text-red-500 mb-4"/>
             <h2 className="text-2xl font-bold">Acesso Negado</h2>
             <p>Você não tem permissão para acessar esta página.</p>
             <button onClick={() => setCurrentPage('home')} className="mt-4 text-blue-600 hover:underline">Voltar para Início</button>
           </div>
        ) : null}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 px-4 mt-auto text-center text-xs">
        © 2026 {APP_BRAND} {CITY_NAME}. Todos os direitos reservados.
      </footer>

      {/* --- MODAL LOGIN / CADASTRO (ATUALIZADO) --- */}
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} title={authMode === 'login' ? "Acesse sua conta" : "Crie sua conta grátis"}>
        {authMode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* HINT ADMIN REMOVIDO DAQUI */}
            <input name="email" placeholder="E-mail" className="input w-full" required/>
            <input name="password" type="password" placeholder="Senha" className="input w-full" required/>
            <button className="btn-primary w-full">Entrar</button>
            <div className="text-center text-xs mt-4">
              Não tem conta? <span className="cursor-pointer text-blue-600 hover:underline font-bold" onClick={() => setAuthMode('register')}>Cadastre-se</span>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3">
            <input name="name" placeholder="Nome Completo" className="input w-full" required/>
            <div className="grid grid-cols-2 gap-3">
              <input name="birthDate" type="date" className="input w-full" required title="Data de Nascimento"/>
              <input name="cpf" placeholder="CPF (somente números)" className="input w-full" maxLength={14} required 
                     onChange={(e) => e.target.value = formatCPF(e.target.value)}/>
            </div>
            <div className="grid grid-cols-2 gap-3">
               <input name="phone" placeholder="Celular" className="input w-full" required/>
               <input name="email" type="email" placeholder="E-mail" className="input w-full" required/>
            </div>
            <input name="password" type="password" placeholder="Senha" className="input w-full" required/>
            
            <button className="btn-primary w-full mt-2">Criar Conta</button>
            <div className="text-center text-xs mt-4">
              Já tem conta? <span className="cursor-pointer text-blue-600 hover:underline font-bold" onClick={() => setAuthMode('login')}>Faça Login</span>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

const styles = document.createElement('style');
styles.innerHTML = `
  .input { @apply border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 border-slate-300; }
  .label { @apply block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide; }
  .btn-primary { @apply bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
  .animate-blob { animation: blob 7s infinite; }
`;
document.head.appendChild(styles);