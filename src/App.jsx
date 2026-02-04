import React, { useState, useEffect } from 'react';
import { 
  Home, Briefcase, Car, Store, Menu, User, Radio, LogOut, 
  AlertTriangle, List, Calendar, Loader
} from 'lucide-react';

// --- IMPORT DOS UTILITÁRIOS ---
import { db } from './utils/database';

// --- IMPORT DOS COMPONENTES VISUAIS ---
import Modal from './components/Modal';

// --- IMPORT DAS PÁGINAS ---
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

// --- CONFIGURAÇÃO ---
const APP_BRAND = "Link da Cidade"; 
const CITY_NAME = "Ouro Branco";

export default function App() {
  // --- ESTADOS GLOBAIS ---
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null); 
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true); // <--- NOVO: Estado de carregamento
  
  // Estados de Seleção
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedGuideItem, setSelectedGuideItem] = useState(null);
  
  // --- ESTADOS DE DADOS ---
  const [newsData, setNewsData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);
  const [jobsData, setJobsData] = useState([]);
  const [vehiclesData, setVehiclesData] = useState([]);
  const [guideData, setGuideData] = useState([]);

  // --- CARREGAMENTO INICIAL (DO FIREBASE) ---
  const loadAllData = async () => {
    try {
      // Busca todas as coleções em paralelo para ser mais rápido
      const [n, e, p, j, v, g] = await Promise.all([
        db.getNews(),
        db.getEvents(),
        db.getProperties(),
        db.getJobs(),
        db.getVehicles(),
        db.getGuide()
      ]);

      setNewsData(n);
      setEventsData(e);
      setPropertiesData(p);
      setJobsData(j);
      setVehiclesData(v);
      setGuideData(g);
    } catch (error) {
      console.error("Erro ao carregar dados do Firebase:", error);
      alert("Erro de conexão. Verifique se o banco de dados foi criado no Firebase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadAllData();
  }, []);
  
  // --- FUNÇÕES DE GERENCIAMENTO (CRUD CONECTADO AO FIREBASE) ---
  // A lógica agora é: Envia pro banco -> Recarrega a lista do banco
  const crud = {
    // Notícias
    addNews: async (item) => { await db.addNews(item); const d = await db.getNews(); setNewsData(d); },
    updateNews: async (item) => { await db.updateNews(item); const d = await db.getNews(); setNewsData(d); },
    deleteNews: async (id) => { await db.deleteNews(id); const d = await db.getNews(); setNewsData(d); },
    
    // Eventos
    addEvent: async (item) => { await db.addEvent(item); const d = await db.getEvents(); setEventsData(d); },
    updateEvent: async (item) => { await db.updateEvent(item); const d = await db.getEvents(); setEventsData(d); },
    deleteEvent: async (id) => { await db.deleteEvent(id); const d = await db.getEvents(); setEventsData(d); },

    // Imóveis
    addProperty: async (item) => { await db.addProperty(item); const d = await db.getProperties(); setPropertiesData(d); },
    updateProperty: async (item) => { await db.updateProperty(item); const d = await db.getProperties(); setPropertiesData(d); },
    deleteProperty: async (id) => { await db.deleteProperty(id); const d = await db.getProperties(); setPropertiesData(d); },

    // Empregos
    addJob: async (item) => { await db.addJob(item); const d = await db.getJobs(); setJobsData(d); },
    updateJob: async (item) => { await db.updateJob(item); const d = await db.getJobs(); setJobsData(d); },
    deleteJob: async (id) => { await db.deleteJob(id); const d = await db.getJobs(); setJobsData(d); },

    // Veículos
    addVehicle: async (item) => { await db.addVehicle(item); const d = await db.getVehicles(); setVehiclesData(d); },
    updateVehicle: async (item) => { await db.updateVehicle(item); const d = await db.getVehicles(); setVehiclesData(d); },
    deleteVehicle: async (id) => { await db.deleteVehicle(id); const d = await db.getVehicles(); setVehiclesData(d); },

    // Guia
    addGuideItem: async (item) => { await db.addGuideItem(item); const d = await db.getGuide(); setGuideData(d); },
    updateGuideItem: async (item) => { await db.updateGuideItem(item); const d = await db.getGuide(); setGuideData(d); },
    deleteGuideItem: async (id) => { await db.deleteGuideItem(id); const d = await db.getGuide(); setGuideData(d); }
  };

  // --- FUNÇÕES DE AUTENTICAÇÃO ---
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
      alert("Dados inválidos. (Admin: admin@link.com / admin123)");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    await db.saveUser({ 
      name: e.target.name.value, 
      email: e.target.email.value, 
      password: e.target.password.value, 
      type: e.target.accountType.value, 
      role: 'user' 
    });
    setLoading(false);
    alert("Cadastrado! Faça login."); 
    setAuthMode('login');
  };

  const handleLogout = () => { setUser(null); setCurrentPage('home'); };

  const NavItem = ({ page, label, icon: Icon }) => (
    <button 
      onClick={() => { setCurrentPage(page); setIsMobileMenuOpen(false); }} 
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm font-medium ${currentPage === page ? 'bg-slate-100 text-blue-700' : 'text-slate-600 hover:text-blue-600'}`}
    >
      {Icon && <Icon size={18} />} {label}
    </button>
  );

  // --- TELA DE CARREGAMENTO ---
  if (loading && !newsData.length && !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-400">
        <Loader className="animate-spin mb-4 text-blue-600" size={48} />
        <p>Conectando ao banco de dados...</p>
      </div>
    );
  }

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
                 {user.role === 'admin' && <button onClick={() => setCurrentPage('admin')} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded font-bold border border-red-200">Admin</button>}
                 <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1 pr-3 rounded-full border border-transparent hover:border-slate-200 transition" onClick={handleLogout}>
                   <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold border border-slate-300 uppercase">{user.name[0]}</div>
                   <LogOut size={14} className="text-slate-400 ml-1"/>
                 </div>
               </div>
            ) : (
              <button onClick={() => { setIsLoginOpen(true); setAuthMode('login'); }} className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-blue-600 px-4 py-2 rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition"><User size={18} /> Entrar</button>
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
          </div>
        )}
      </header>

      {/* --- CONTEÚDO PRINCIPAL (ROTEADOR) --- */}
      <main className="max-w-7xl mx-auto min-h-[calc(100vh-64px)]">
        
        {currentPage === 'home' && (
          <HomePage 
            navigate={setCurrentPage} 
            newsData={newsData} 
            eventsData={eventsData}
            onNewsClick={(n) => { setSelectedNews(n); setCurrentPage('news_detail'); window.scrollTo(0,0); }} 
          />
        )}

        {currentPage === 'news_detail' && (
          <NewsDetailPage 
            news={selectedNews} 
            onBack={() => setCurrentPage(selectedNews ? 'news' : 'home')} 
          />
        )}
        
        {currentPage === 'news' && (
          <NewsPage 
            newsData={newsData} 
            onNewsClick={(n) => { setSelectedNews(n); setCurrentPage('news_detail'); window.scrollTo(0,0); }} 
          />
        )}
        
        {currentPage === 'events' && (
          <EventsPage 
            eventsData={eventsData} 
            onEventClick={(evt) => { setSelectedEvent(evt); setCurrentPage('event_detail'); window.scrollTo(0,0); }} 
          />
        )}

        {currentPage === 'event_detail' && (
          <EventDetailPage 
            event={selectedEvent} 
            onBack={() => setCurrentPage('events')} 
          />
        )}

        {currentPage === 'real_estate' && (
          <RealEstatePage 
            user={user} 
            navigate={setCurrentPage} 
            propertiesData={propertiesData} 
            onCrud={crud} 
            onSelectProperty={(p) => { setSelectedProperty(p); setCurrentPage('property_detail'); window.scrollTo(0,0); }} 
          />
        )}

        {currentPage === 'property_detail' && (
          <PropertyDetailPage 
            property={selectedProperty} 
            onBack={() => setCurrentPage('real_estate')} 
          />
        )}

        {currentPage === 'jobs' && (
          <JobsPage 
            jobsData={jobsData} 
            onJobClick={(j) => { setSelectedJob(j); setCurrentPage('job_detail'); window.scrollTo(0,0); }} 
          />
        )}

        {currentPage === 'job_detail' && (
          <JobDetailPage 
            job={selectedJob} 
            onBack={() => setCurrentPage('jobs')} 
          />
        )}

        {currentPage === 'vehicles' && (
          <VehiclesPage 
            vehiclesData={vehiclesData} 
            user={user}
            onCrud={crud}
            onVehicleClick={(v) => { setSelectedVehicle(v); setCurrentPage('vehicle_detail'); window.scrollTo(0,0); }} 
          />
        )}

        {currentPage === 'vehicle_detail' && (
          <VehicleDetailPage 
            vehicle={selectedVehicle} 
            onBack={() => setCurrentPage('vehicles')} 
          />
        )}

        {/* --- ROTAS DO GUIA --- */}
        {currentPage === 'guide' && (
          <GuidePage 
            guideData={guideData} 
            onLocalClick={(item) => { setSelectedGuideItem(item); setCurrentPage('guide_detail'); window.scrollTo(0,0); }} 
          />
        )}
        
        {currentPage === 'guide_detail' && (
          <GuideDetailPage 
            item={selectedGuideItem} 
            onBack={() => setCurrentPage('guide')} 
          />
        )}

        {/* --- PAINEL ADMIN --- */}
        {currentPage === 'admin' && user?.role === 'admin' && (
          <AdminPage 
            newsData={newsData} 
            eventsData={eventsData}
            propertiesData={propertiesData}
            jobsData={jobsData}
            vehiclesData={vehiclesData}
            guideData={guideData}
            crud={crud}
          />
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 px-4 mt-auto text-center text-xs">
        © 2026 {APP_BRAND} {CITY_NAME}. Todos os direitos reservados.
      </footer>

      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} title={authMode === 'login' ? "Acesse sua conta" : "Cadastre-se"}>
        {authMode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="bg-yellow-50 p-3 text-xs border border-yellow-200 rounded">Admin: admin@link.com / admin123</div>
            <input name="email" placeholder="E-mail" className="input w-full" required/>
            <input name="password" type="password" placeholder="Senha" className="input w-full" required/>
            <button className="btn-primary w-full">Entrar</button>
            <div className="text-center text-xs mt-4 cursor-pointer text-blue-600 hover:underline" onClick={() => setAuthMode('register')}>Criar conta</div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="border p-2 rounded cursor-pointer hover:bg-slate-50 has-[:checked]:border-blue-500"><input type="radio" name="accountType" value="user" defaultChecked className="hidden"/> Pessoa Física</label>
              <label className="border p-2 rounded cursor-pointer hover:bg-slate-50 has-[:checked]:border-blue-500"><input type="radio" name="accountType" value="company" className="hidden"/> Empresa</label>
            </div>
            <input name="name" placeholder="Nome Completo" className="input w-full" required/>
            <input name="email" placeholder="E-mail" className="input w-full" required/>
            <input name="password" type="password" placeholder="Senha" className="input w-full" required/>
            <button className="btn-primary w-full">Cadastrar</button>
            <div className="text-center text-xs mt-4 cursor-pointer text-blue-600 hover:underline" onClick={() => setAuthMode('login')}>Já tenho conta</div>
          </form>
        )}
      </Modal>
    </div>
  );
}

// Estilos Globais
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