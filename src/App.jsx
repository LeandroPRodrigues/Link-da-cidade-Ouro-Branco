import React, { useState, useEffect } from 'react';
import { Home, Briefcase, Car, Store, Menu, User, LogOut, List, Calendar, Loader, PlusCircle, Bell, Search, Grid, Settings, ShoppingBag, ExternalLink } from 'lucide-react';
import { db } from './utils/database';
import { validateCPF, formatCPF } from './utils/cpfValidator';
import Modal from './components/Modal';

import HomePage, { MiniOffersCarousel, AdsCarousel } from './pages/HomePage';
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
import WeatherWidget from './components/WeatherWidget';
import OffersPage from './pages/OffersPage'; 
import ProfilePage from './pages/ProfilePage';

const APP_BRAND = "Link"; 
const CITY_NAME = "Ouro Branco";

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null); 
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [loading, setLoading] = useState(true);
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedGuideItem, setSelectedGuideItem] = useState(null);
  
  const [newsData, setNewsData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);
  const [jobsData, setJobsData] = useState([]);
  const [vehiclesData, setVehiclesData] = useState([]);
  const [guideData, setGuideData] = useState([]);
  const [adsData, setAdsData] = useState([]);
  const [offersData, setOffersData] = useState([]); 

  const loadAllData = async () => {
    try {
      await db.cleanOldEvents();
      const [n, e, p, j, v, g, a, o] = await Promise.all([
        db.getNews(), db.getEvents(), db.getProperties(), db.getJobs(), db.getVehicles(), db.getGuide(), db.getAds(), db.getOffers()
      ]);
      setNewsData(n); setEventsData(e); setPropertiesData(p); setJobsData(j); setVehiclesData(v); setGuideData(g); setAdsData(a); setOffersData(o);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    const savedUser = localStorage.getItem('app_user');
    if (savedUser) { setUser(JSON.parse(savedUser)); }
    loadAllData(); 
  }, []);
  
  const crud = {
    addNews: async (item) => { await db.addNews(item); setNewsData(await db.getNews()); },
    updateNews: async (item) => { await db.updateNews(item); setNewsData(await db.getNews()); },
    deleteNews: async (id) => { await db.deleteNews(id); setNewsData(await db.getNews()); },
    addEvent: async (item) => { await db.addEvent(item); setEventsData(await db.getEvents()); },
    updateEvent: async (item) => { await db.updateEvent(item); setEventsData(await db.getEvents()); },
    deleteEvent: async (id) => { await db.deleteEvent(id); setEventsData(await db.getEvents()); },
    addProperty: async (item) => { const i = { ...item, ownerId: user.id, ownerName: user.name }; await db.addProperty(i); setPropertiesData(await db.getProperties()); },
    updateProperty: async (item) => { await db.updateProperty(item); setPropertiesData(await db.getProperties()); },
    deleteProperty: async (id) => { await db.deleteProperty(id); setPropertiesData(await db.getProperties()); },
    addJob: async (item) => { await db.addJob(item); setJobsData(await db.getJobs()); },
    updateJob: async (item) => { await db.updateJob(item); setJobsData(await db.getJobs()); },
    deleteJob: async (id) => { await db.deleteJob(id); setJobsData(await db.getJobs()); },
    addVehicle: async (item) => { const i = { ...item, ownerId: user.id, ownerName: user.name }; await db.addVehicle(i); setVehiclesData(await db.getVehicles()); },
    updateVehicle: async (item) => { await db.updateVehicle(item); setVehiclesData(await db.getVehicles()); },
    deleteVehicle: async (id) => { await db.deleteVehicle(id); setVehiclesData(await db.getVehicles()); },
    addGuideItem: async (item) => { await db.addGuideItem(item); setGuideData(await db.getGuide()); },
    updateGuideItem: async (item) => { await db.updateGuideItem(item); setGuideData(await db.getGuide()); },
    deleteGuideItem: async (id) => { await db.deleteGuideItem(id); setGuideData(await db.getGuide()); },
    addAd: async (item) => { await db.addAd(item); setAdsData(await db.getAds()); },
    updateAd: async (item) => { await db.updateAd(item); setAdsData(await db.getAds()); },
    deleteAd: async (id) => { await db.deleteAd(id); setAdsData(await db.getAds()); },
    addOffer: async (item) => { await db.addOffer(item); setOffersData(await db.getOffers()); },
    updateOffer: async (item) => { await db.updateOffer(item); setOffersData(await db.getOffers()); },
    deleteOffer: async (id) => { await db.deleteOffer(id); setOffersData(await db.getOffers()); }
  };

  // =========================================================================
  // SISTEMA DE LIMITES DE CADASTRO (1 PARA UTILIADOR COMUM, ILIMITADO P/ ADMIN)
  // =========================================================================
  const handleAddPropertyClick = (openModalCallback) => { 
    if (!user) { 
      alert("Faça login ou crie uma conta gratuita para anunciar o seu imóvel."); 
      setIsLoginOpen(true); 
      return; 
    } 
    if (user.role !== 'admin') {
      const userProperties = propertiesData.filter(p => p.ownerId === user.id);
      if (userProperties.length >= 1) {
        alert("Atenção: Você já atingiu o limite de 1 imóvel cadastrado no plano gratuito. Para anunciar mais imóveis, entre em contato com o administrador do site.");
        return;
      }
    }
    openModalCallback(); 
  };

  const handleAddVehicleClick = (openModalCallback) => { 
    if (!user) { 
      alert("Faça login ou crie uma conta gratuita para anunciar o seu veículo."); 
      setIsLoginOpen(true); 
      return; 
    } 
    if (user.role !== 'admin') {
      const userVehicles = vehiclesData.filter(v => v.ownerId === user.id);
      if (userVehicles.length >= 1) {
        alert("Atenção: Você já atingiu o limite de 1 veículo cadastrado no plano gratuito. Para anunciar mais veículos, entre em contato com o administrador do site.");
        return;
      }
    }
    openModalCallback(); 
  };
  // =========================================================================
  
  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true);
    const u = await db.loginUser(e.target.email.value, e.target.password.value);
    setLoading(false);
    if(u) { 
      setUser(u); localStorage.setItem('app_user', JSON.stringify(u)); setIsLoginOpen(false); 
      if(u.role === 'admin') setCurrentPage('admin'); 
    } else { alert("E-mail ou senha incorretos."); }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const u = await db.loginWithGoogle();
    setLoading(false);
    if(u) {
      setUser(u); 
      localStorage.setItem('app_user', JSON.stringify(u)); 
      setIsLoginOpen(false);
      if(u.role === 'admin') setCurrentPage('admin');
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = { name: e.target.name.value, email: e.target.email.value, password: e.target.password.value, phone: e.target.phone.value, cpf: e.target.cpf.value, birthDate: e.target.birthDate.value, type: 'user', role: 'user', createdAt: new Date().toISOString() };
    if (!validateCPF(formData.cpf)) { alert("CPF inválido!"); return; }
    setLoading(true);
    if (await db.checkCpfExists(formData.cpf)) { setLoading(false); alert("CPF já cadastrado."); return; }
    try {
      await db.registerUser(formData);
      setLoading(false); alert("Cadastro realizado com sucesso! Faça login para continuar."); setAuthMode('login');
    } catch (err) {
      setLoading(false);
      if (err.code === 'auth/email-already-in-use') alert("E-mail já cadastrado no sistema.");
      else if (err.code === 'auth/weak-password') alert("A senha deve ter no mínimo 6 caracteres.");
      else alert("Erro ao criar conta. Verifique os dados.");
    }
  };
  
  const handleLogout = async () => { 
    await db.logoutUser();
    setUser(null); localStorage.removeItem('app_user'); setCurrentPage('home'); setIsUserMenuOpen(false);
  };

  const NavItem = ({ page, label, icon: Icon, mobileOnly }) => (
    <button onClick={() => { setCurrentPage(page); window.scrollTo(0,0); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${mobileOnly ? 'md:hidden' : ''} ${currentPage === page ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>
      <Icon size={22} strokeWidth={currentPage === page ? 2.5 : 2} /> <span className="hidden md:inline">{label}</span><span className="md:hidden text-[10px] mt-1">{label}</span>
    </button>
  );
  
  const MobileTabItem = ({ page, label, icon: Icon }) => (
    <button onClick={() => { setCurrentPage(page); window.scrollTo(0,0); }} className={`flex flex-col items-center justify-center p-2 w-full transition-colors ${currentPage === page ? 'text-indigo-600' : 'text-slate-400'}`}>
      <Icon size={24} strokeWidth={currentPage === page ? 2.5 : 2} /> <span className="text-[10px] font-medium mt-1">{label}</span>
    </button>
  );

  if (loading && !newsData.length && !user) return (<div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-400"><Loader className="animate-spin mb-4 text-indigo-600" size={48} /><p>Carregando Link da Cidade...</p></div>);

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans text-slate-900">
      
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200 h-16">
        <div className="max-w-[1600px] mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 rounded-lg shadow-lg shadow-indigo-200"><Grid className="text-white" size={20} /></div>
            <div><h1 className="font-extrabold text-xl tracking-tight text-slate-800 leading-none">{APP_BRAND}<span className="text-indigo-600">daCidade</span></h1><p className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">{CITY_NAME}</p></div>
          </div>
          
          <div className="hidden md:flex bg-slate-100 items-center px-4 py-2 rounded-full w-96 border border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-all">
            <Search size={18} className="text-slate-400 mr-2"/><input placeholder="Buscar no Link da Cidade..." className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400"/>
          </div>
          
          <div className="flex items-center gap-3">
            {user ? (
               <div className="flex items-center gap-3">
                 {user.role === 'admin' && (<button onClick={() => setCurrentPage('admin')} className="hidden md:flex items-center gap-2 text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-full font-bold border border-red-100 hover:bg-red-100 transition"><Settings size={14}/> Admin</button>)}
                 
                 <div className="relative">
                   <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1 pr-3 rounded-full border border-transparent hover:border-slate-200 transition" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                     {user.image ? (
                        <img src={user.image} alt="Perfil" className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" />
                     ) : (
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm uppercase text-sm">{user.name[0]}</div>
                     )}
                     <div className="hidden md:block text-left leading-tight"><p className="text-xs font-bold text-slate-700">{user.name.split(' ')[0]}</p><p className="text-[10px] text-slate-400">Minha Conta</p></div>
                   </div>
                   
                   {isUserMenuOpen && (
                     <>
                       <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)}></div>
                       <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in slide-in-from-top-2">
                         <button onClick={() => { setCurrentPage('profile'); setIsUserMenuOpen(false); window.scrollTo(0,0); }} className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors">
                           <User size={16}/> Meu Perfil
                         </button>
                         <div className="h-px bg-slate-100 my-1"></div>
                         <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                           <LogOut size={16}/> Sair do Site
                         </button>
                       </div>
                     </>
                   )}
                 </div>

               </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => { setIsLoginOpen(true); setAuthMode('login'); }} className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-full transition">Entrar</button>
                <button onClick={() => { setIsLoginOpen(true); setAuthMode('register'); }} className="hidden md:flex items-center gap-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-full shadow-md shadow-indigo-200 transition hover:-translate-y-0.5">Cadastrar</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto pt-6 px-0 md:px-4 flex gap-6 min-h-[calc(100vh-64px)]">
        <aside className="hidden lg:block w-64 shrink-0 sticky top-24 h-fit space-y-2">
          <NavItem page="home" label="Feed Inicial" icon={Home} />
          <NavItem page="offers" label="Shopping / Ofertas" icon={ShoppingBag} />
          <NavItem page="news" label="Notícias" icon={List} />
          <NavItem page="events" label="Agenda & Eventos" icon={Calendar} />
          <div className="my-4 border-t border-slate-200 mx-4"></div>
          <p className="px-4 text-xs font-bold text-slate-400 uppercase mb-1">Classificados</p>
          <NavItem page="real_estate" label="Imóveis" icon={Home} />
          <NavItem page="jobs" label="Vagas de Emprego" icon={Briefcase} />
          <NavItem page="vehicles" label="Veículos" icon={Car} />
          <div className="my-4 border-t border-slate-200 mx-4"></div>
          <p className="px-4 text-xs font-bold text-slate-400 uppercase mb-1">Serviços</p>
          <NavItem page="guide" label="Guia Comercial" icon={Store} />
        </aside>

        <main className="flex-1 w-full min-w-0 pb-24 md:pb-10">
          
          <div className="px-4 md:px-0">
             <AdsCarousel ads={adsData} />
          </div>

          {currentPage === 'home' && <HomePage navigate={setCurrentPage} newsData={newsData} eventsData={eventsData} offersData={offersData} user={user} onNewsClick={(n) => { setSelectedNews(n); setCurrentPage('news_detail'); window.scrollTo(0,0); }} />}
          {currentPage === 'offers' && <OffersPage offersData={offersData} />}
          {currentPage === 'news_detail' && <NewsDetailPage news={selectedNews} user={user} onBack={() => setCurrentPage('news')} />}
          {currentPage === 'news' && <NewsPage newsData={newsData} user={user} onNewsClick={(n) => { setSelectedNews(n); setCurrentPage('news_detail'); window.scrollTo(0,0); }} />}
          {currentPage === 'events' && <EventsPage eventsData={eventsData} onEventClick={(evt) => { setSelectedEvent(evt); setCurrentPage('event_detail'); window.scrollTo(0,0); }} />}
          {currentPage === 'event_detail' && <EventDetailPage event={selectedEvent} onBack={() => setCurrentPage('events')} />}
          {currentPage === 'real_estate' && <RealEstatePage user={user} navigate={setCurrentPage} propertiesData={propertiesData} onCrud={crud} checkLimit={handleAddPropertyClick} onSelectProperty={(p) => { setSelectedProperty(p); setCurrentPage('property_detail'); window.scrollTo(0,0); }} />}
          {currentPage === 'property_detail' && <PropertyDetailPage property={selectedProperty} onBack={() => setCurrentPage('real_estate')} />}
          {currentPage === 'jobs' && <JobsPage jobsData={jobsData} onJobClick={(j) => { setSelectedJob(j); setCurrentPage('job_detail'); window.scrollTo(0,0); }} />}
          {currentPage === 'job_detail' && <JobDetailPage job={selectedJob} onBack={() => setCurrentPage('jobs')} />}
          {currentPage === 'vehicles' && <VehiclesPage vehiclesData={vehiclesData} user={user} onCrud={crud} checkLimit={handleAddVehicleClick} onVehicleClick={(v) => { setSelectedVehicle(v); setCurrentPage('vehicle_detail'); window.scrollTo(0,0); }} />}
          {currentPage === 'vehicle_detail' && <VehicleDetailPage vehicle={selectedVehicle} onBack={() => setCurrentPage('vehicles')} />}
          {currentPage === 'guide' && <GuidePage guideData={guideData} crud={crud} onLocalClick={(item) => { setSelectedGuideItem(item); setCurrentPage('guide_detail'); window.scrollTo(0,0); }} />}
          {currentPage === 'guide_detail' && <GuideDetailPage item={selectedGuideItem} onBack={() => setCurrentPage('guide')} />}
          {currentPage === 'admin' && user?.role === 'admin' && <AdminPage newsData={newsData} eventsData={eventsData} propertiesData={propertiesData} jobsData={jobsData} vehiclesData={vehiclesData} guideData={guideData} adsData={adsData} offersData={offersData} crud={crud} />}
          
          {currentPage === 'profile' && user && <ProfilePage user={user} db={db} setUser={setUser} onBack={() => setCurrentPage('home')} />}
        </main>

        <aside className="hidden xl:block w-80 shrink-0 sticky top-24 h-fit space-y-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl group-hover:scale-110 transition duration-700"></div>
            <div className="relative z-10"><WeatherWidget /></div>
          </div>
          <MiniOffersCarousel offers={offersData} navigate={setCurrentPage} />
        </aside>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          <MobileTabItem page="home" label="Início" icon={Home} />
          <MobileTabItem page="offers" label="Shopping" icon={ShoppingBag} />
          <div className="relative -top-5">
            <button onClick={() => { setIsLoginOpen(true); }} className="bg-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-200 hover:scale-105 transition"><PlusCircle size={24} /></button>
          </div>
          <MobileTabItem page="events" label="Agenda" icon={Calendar} />
          <MobileTabItem page="guide" label="Guia" icon={Store} />
        </div>
      </nav>

      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} title={authMode === 'login' ? "Bem-vindo de volta" : "Criar nova conta"}>
        {authMode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input name="email" placeholder="E-mail" className="input w-full bg-slate-50 border-slate-200 focus:bg-white" required/>
            <input name="password" type="password" placeholder="Senha" className="input w-full bg-slate-50 border-slate-200 focus:bg-white" required/>
            <button className="btn-primary w-full bg-indigo-600 hover:bg-indigo-700">Entrar na conta</button>
            <div className="relative flex items-center py-4"><div className="flex-grow border-t border-slate-200"></div><span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase tracking-wider font-bold">OU</span><div className="flex-grow border-t border-slate-200"></div></div>
            <button type="button" onClick={handleGoogleLogin} className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition flex items-center justify-center gap-3 shadow-sm">
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 41.939 C -8.804 40.009 -11.514 38.989 -14.754 38.989 C -19.444 38.989 -23.494 41.689 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
              Continuar com Google
            </button>
            <div className="text-center text-xs mt-4">Não tem conta? <span className="cursor-pointer text-indigo-600 hover:underline font-bold" onClick={() => setAuthMode('register')}>Cadastre-se</span></div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3">
            <input name="name" placeholder="Nome Completo" className="input w-full bg-slate-50 border-slate-200 focus:bg-white" required/>
            <div className="grid grid-cols-2 gap-3"><input name="birthDate" type="date" className="input w-full bg-slate-50 border-slate-200 focus:bg-white" required/><input name="cpf" placeholder="CPF" className="input w-full bg-slate-50 border-slate-200 focus:bg-white" maxLength={14} required onChange={(e) => e.target.value = formatCPF(e.target.value)}/></div>
            <div className="grid grid-cols-2 gap-3"><input name="phone" placeholder="Celular" className="input w-full bg-slate-50 border-slate-200 focus:bg-white" required/><input name="email" type="email" placeholder="E-mail" className="input w-full bg-slate-50 border-slate-200 focus:bg-white" required/></div>
            <input name="password" type="password" placeholder="Senha" className="input w-full bg-slate-50 border-slate-200 focus:bg-white" required/>
            <button className="btn-primary w-full mt-2 bg-indigo-600 hover:bg-indigo-700">Criar Conta</button>
            <div className="relative flex items-center py-2 mt-2"><div className="flex-grow border-t border-slate-200"></div><span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase tracking-wider font-bold">OU</span><div className="flex-grow border-t border-slate-200"></div></div>
            <button type="button" onClick={handleGoogleLogin} className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition flex items-center justify-center gap-3 shadow-sm">
               <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 41.939 C -8.804 40.009 -11.514 38.989 -14.754 38.989 C -19.444 38.989 -23.494 41.689 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
               Inscrever com Google
            </button>
            <div className="text-center text-xs mt-2">Já tem conta? <span className="cursor-pointer text-indigo-600 hover:underline font-bold" onClick={() => setAuthMode('login')}>Faça Login</span></div>
          </form>
        )}
      </Modal>
    </div>
  );
}