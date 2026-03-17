import React, { useState, useEffect, useCallback } from 'react';
import { Home, Briefcase, Car, Store, Menu, User, LogOut, List, Calendar, Loader, PlusCircle, Search, Grid, Settings, ShoppingBag, Facebook, Instagram, Youtube } from 'lucide-react';
import { db } from './utils/database';
import { validateCPF, formatCPF } from './utils/cpfValidator';
import Modal from './components/Modal';

import HomePage, { MiniOffersCarousel, AdsCarousel, SidebarAd, MiniPropertiesCarousel } from './pages/HomePage';
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
import OfferDetailPage from './pages/OfferDetailPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SearchPage from './pages/SearchPage'; // Import da nova página de buscas

import logoImg from './logo.jpg'; 

const APP_BRAND = "Link"; 
const CITY_NAME = "Ouro Branco";

const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.004 2C6.48 2 2.004 6.476 2.004 12C2.004 13.824 2.49 15.54 3.328 17.034L2 22L7.098 20.686C8.56 21.524 10.236 22 12.004 22C17.528 22 22.004 17.524 22.004 12C22.004 6.476 17.528 2 12.004 2ZM17.18 16.538C16.99 17.076 16.038 17.514 15.534 17.576C15.06 17.632 14.45 17.682 12.392 16.83C9.314 15.556 7.324 12.438 7.17 12.238C7.02 12.038 5.898 10.554 5.898 9.014C5.898 7.474 6.678 6.726 7 6.406C7.272 6.136 7.726 6.002 8.164 6.002C8.304 6.002 8.432 6.008 8.542 6.014C8.868 6.028 9.032 6.046 9.25 6.568C9.52 7.218 10.176 8.818 10.254 8.98C10.334 9.14 10.412 9.356 10.306 9.566C10.206 9.778 10.12 9.872 9.96 10.058C9.8 10.244 9.654 10.38 9.498 10.584C9.354 10.768 9.192 10.966 9.37 11.274C9.544 11.576 10.15 12.564 11.05 13.364C12.21 14.398 13.16 14.726 13.496 14.866C13.75 14.972 14.052 14.954 14.234 14.756C14.464 14.506 14.752 14.12 15.042 13.726C15.248 13.446 15.5 13.404 15.766 13.504C16.038 13.6 17.49 14.318 17.79 14.468C18.09 14.618 18.29 14.692 18.364 14.82C18.438 14.948 18.438 15.548 18.18 16.538Z"/>
  </svg>
);

const createSlug = (text) => {
  if (!text) return '';
  return text.toString().toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
};

const GlobalAdsCarousel = ({ ads }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const topAds = ads?.filter(ad => ad.position !== 'middle' && ad.position !== 'sidebar') || [];

  useEffect(() => {
    if (topAds.length <= 1) return;
    const interval = setInterval(() => { setCurrentIndex((prev) => (prev + 1) % topAds.length); }, 5000); 
    return () => clearInterval(interval);
  }, [topAds.length]);

  if (topAds.length === 0) return null;

  const ad = topAds[currentIndex];

  return (
    <div className="mb-6 w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50 relative h-36 md:h-56 group animate-in fade-in">
      {ad.link ? (
        <a href={ad.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 w-full h-full block">
           <img key={ad.id} src={ad.image} alt={ad.title || 'Publicidade'} className="w-full h-full object-cover animate-in fade-in duration-500" />
        </a>
      ) : (
        <div className="absolute inset-0 w-full h-full block">
           <img key={ad.id} src={ad.image} alt={ad.title || 'Publicidade'} className="w-full h-full object-cover animate-in fade-in duration-500" />
        </div>
      )}
      <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider backdrop-blur-sm z-10 pointer-events-none">
        Publicidade
      </div>
      {topAds.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-20">
          {topAds.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentIndex(idx)} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-5 bg-indigo-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null); 
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [loading, setLoading] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Estado para busca
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedGuideItem, setSelectedGuideItem] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null); 
  
  const [newsData, setNewsData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);
  const [jobsData, setJobsData] = useState([]);
  const [vehiclesData, setVehiclesData] = useState([]);
  const [guideData, setGuideData] = useState([]);
  const [adsData, setAdsData] = useState([]);
  const [offersData, setOffersData] = useState([]); 
  const [settingsData, setSettingsData] = useState({});

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const resolveUrlPath = useCallback((pathname, dataSets) => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) { setCurrentPage('home'); return; }

    const route = parts[0];
    const id = parts[1]; 

    switch(route) {
      case 'admin': setCurrentPage('admin'); break;
      case 'perfil': setCurrentPage('profile'); break;
      case 'quem-somos': setCurrentPage('about'); break;
      case 'contato': setCurrentPage('contact'); break;
      case 'busca': setCurrentPage('search'); break;
      
      case 'ofertas':
        if (id && dataSets.offers) {
          const item = dataSets.offers.find(i => String(i.id) === String(id));
          if (item) { setSelectedOffer(item); setCurrentPage('offer_detail'); return; }
        }
        setCurrentPage('offers'); break;

      case 'noticias':
        if (id && dataSets.news) {
          const item = dataSets.news.find(i => createSlug(i.title) === id);
          if (item) { setSelectedNews(item); setCurrentPage('news_detail'); return; }
        }
        setCurrentPage('news'); break;

      case 'agenda':
        if (id && dataSets.events) {
          const item = dataSets.events.find(i => String(i.id) === String(id));
          if (item) { setSelectedEvent(item); setCurrentPage('event_detail'); return; }
        }
        setCurrentPage('events'); break;

      case 'imoveis':
        if (id && dataSets.real_estate) {
          const item = dataSets.real_estate.find(i => String(i.id) === String(id));
          if (item) { setSelectedProperty(item); setCurrentPage('property_detail'); return; }
        }
        setCurrentPage('real_estate'); break;

      case 'vagas':
        if (id && dataSets.jobs) {
          const item = dataSets.jobs.find(i => String(i.id) === String(id));
          if (item) { setSelectedJob(item); setCurrentPage('job_detail'); return; }
        }
        setCurrentPage('jobs'); break;

      case 'veiculos':
        if (id && dataSets.vehicles) {
          const item = dataSets.vehicles.find(i => String(i.id) === String(id));
          if (item) { setSelectedVehicle(item); setCurrentPage('vehicle_detail'); return; }
        }
        setCurrentPage('vehicles'); break;

      case 'guia':
        if (id && dataSets.guide) {
          const item = dataSets.guide.find(i => String(i.id) === String(id));
          if (item) { setSelectedGuideItem(item); setCurrentPage('guide_detail'); return; }
        }
        setCurrentPage('guide'); break;

      default:
        setCurrentPage('home');
    }
  }, []);

  const loadAllData = async () => {
    try {
      await db.cleanOldEvents();
      const [n, e, p, j, v, g, a, o, s] = await Promise.all([
        db.getNews(), db.getEvents(), db.getProperties(), db.getJobs(), db.getVehicles(), db.getGuide(), db.getAds(), db.getOffers(), db.getSettings()
      ]);
      setNewsData(n); setEventsData(e); setPropertiesData(p); setJobsData(j); setVehiclesData(v); setGuideData(g); setAdsData(a); setOffersData(o); setSettingsData(s);
      
      resolveUrlPath(window.location.pathname, {
          news: n, events: e, real_estate: p, jobs: j, vehicles: v, guide: g, offers: o
      });
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

  useEffect(() => {
    if (loading) return; 

    let newUrl = '/';
    let pageTitle = `${APP_BRAND} da Cidade | ${CITY_NAME}`;

    if (currentPage === 'offers') { newUrl = '/ofertas'; pageTitle = `Shopping e Ofertas | ${APP_BRAND} da Cidade`; }
    else if (currentPage === 'admin') { newUrl = '/admin'; pageTitle = 'Painel Administrativo'; }
    else if (currentPage === 'profile') { newUrl = '/perfil'; pageTitle = 'Meu Perfil'; }
    else if (currentPage === 'about') { newUrl = '/quem-somos'; pageTitle = `Quem Somos | ${APP_BRAND} da Cidade`; }
    else if (currentPage === 'contact') { newUrl = '/contato'; pageTitle = `Contato | ${APP_BRAND} da Cidade`; }
    else if (currentPage === 'search') { newUrl = '/busca'; pageTitle = `Resultados da Busca | ${APP_BRAND} da Cidade`; }
    else if (currentPage === 'news') { newUrl = '/noticias'; pageTitle = `Notícias de ${CITY_NAME}`; }
    else if (currentPage === 'events') { newUrl = '/agenda'; pageTitle = `Agenda de Eventos | ${CITY_NAME}`; }
    else if (currentPage === 'real_estate') { newUrl = '/imoveis'; pageTitle = `Imóveis em ${CITY_NAME}`; }
    else if (currentPage === 'jobs') { newUrl = '/vagas'; pageTitle = `Vagas de Emprego em ${CITY_NAME}`; }
    else if (currentPage === 'vehicles') { newUrl = '/veiculos'; pageTitle = `Veículos em ${CITY_NAME}`; }
    else if (currentPage === 'guide') { newUrl = '/guia'; pageTitle = `Guia Comercial de ${CITY_NAME}`; }
    
    else if (currentPage === 'news_detail' && selectedNews) { 
        newUrl = `/noticias/${createSlug(selectedNews.title)}`;
        pageTitle = `${selectedNews.title} | Notícias`;
    }
    else if (currentPage === 'offer_detail' && selectedOffer) { 
        newUrl = `/ofertas/${selectedOffer.id}`;
        pageTitle = `Oferta: ${selectedOffer.title}`;
    }
    else if (currentPage === 'event_detail' && selectedEvent) { 
        newUrl = `/agenda/${selectedEvent.id}`;
        pageTitle = `Evento: ${selectedEvent.title}`;
    }
    else if (currentPage === 'property_detail' && selectedProperty) { 
        newUrl = `/imoveis/${selectedProperty.id}`;
        pageTitle = `${selectedProperty.title} | Imóveis`;
    }
    else if (currentPage === 'job_detail' && selectedJob) { 
        newUrl = `/vagas/${selectedJob.id}`;
        pageTitle = `Vaga: ${selectedJob.title}`;
    }
    else if (currentPage === 'vehicle_detail' && selectedVehicle) { 
        newUrl = `/veiculos/${selectedVehicle.id}`;
        pageTitle = `${selectedVehicle.title} | Veículos`;
    }
    else if (currentPage === 'guide_detail' && selectedGuideItem) { 
        newUrl = `/guia/${selectedGuideItem.id}`;
        pageTitle = `${selectedGuideItem.name} | Guia Comercial`;
    }

    if (window.location.pathname !== newUrl) {
      window.history.pushState(null, '', newUrl);
    }
    document.title = pageTitle;
  }, [currentPage, selectedNews, selectedOffer, selectedEvent, selectedProperty, selectedJob, selectedVehicle, selectedGuideItem, loading]);

  useEffect(() => {
    const handlePopState = () => {
      resolveUrlPath(window.location.pathname, {
        news: newsData, events: eventsData, real_estate: propertiesData, 
        jobs: jobsData, vehicles: vehiclesData, guide: guideData, offers: offersData
      });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [resolveUrlPath, newsData, eventsData, propertiesData, jobsData, vehiclesData, guideData, offersData]);
  
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
    deleteOffer: async (id) => { await db.deleteOffer(id); setOffersData(await db.getOffers()); },
    updateSettings: async (item) => { await db.updateSettings(item); setSettingsData(await db.getSettings()); }
  };

  const handleAddPropertyClick = (openModalCallback) => { 
    if (!user) { alert("Faça login ou crie uma conta gratuita para anunciar."); setIsLoginOpen(true); return; } 
    if (user.role !== 'admin' && propertiesData.filter(p => p.ownerId === user.id).length >= 1) {
      alert("Limite de 1 imóvel cadastrado no plano gratuito atingido."); return;
    }
    openModalCallback(); 
  };

  const handleAddVehicleClick = (openModalCallback) => { 
    if (!user) { alert("Faça login ou crie uma conta gratuita para anunciar."); setIsLoginOpen(true); return; } 
    if (user.role !== 'admin' && vehiclesData.filter(v => v.ownerId === user.id).length >= 1) {
      alert("Limite de 1 veículo cadastrado no plano gratuito atingido."); return;
    }
    openModalCallback(); 
  };
  
  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true);
    const u = await db.loginUser(e.target.email.value, e.target.password.value);
    setLoading(false);
    if(u) { setUser(u); localStorage.setItem('app_user', JSON.stringify(u)); setIsLoginOpen(false); if(u.role === 'admin') setCurrentPage('admin'); } else { alert("E-mail ou senha incorretos."); }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const u = await db.loginWithGoogle();
    setLoading(false);
    if(u) { setUser(u); localStorage.setItem('app_user', JSON.stringify(u)); setIsLoginOpen(false); if(u.role === 'admin') setCurrentPage('admin'); }
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
      setLoading(false); alert("Erro ao criar conta.");
    }
  };
  
  const handleLogout = async () => { 
    await db.logoutUser(); setUser(null); localStorage.removeItem('app_user'); setCurrentPage('home'); setIsUserMenuOpen(false);
  };

  const handleNewsClick = (n) => {
    db.incrementNewsView(n.id, n._collection);
    setSelectedNews(n);
    setCurrentPage('news_detail');
    window.scrollTo(0,0);
  };

  // FUNÇÃO DE BUSCA GLOBAL
  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.searchQuery.value.trim();
    if (query) {
      setSearchQuery(query);
      setCurrentPage('search');
      window.scrollTo(0,0);
    }
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
      
      <div className="sticky top-0 z-50">
        
        {/* FAIXA 1: TOPO AZUL COM REDES SOCIAIS, LINKS, DATA/HORA E USUÁRIO */}
        <div className="bg-blue-600 text-blue-50 text-sm py-3 px-4 flex justify-between items-center shadow-md">
          <div className="max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0">
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-5 font-medium tracking-wide">
              
              {/* Redes Sociais */}
              <div className="flex items-center gap-3">
                {settingsData.facebook && <a href={settingsData.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition transform hover:scale-110"><Facebook size={20} /></a>}
                {settingsData.instagram && <a href={settingsData.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition transform hover:scale-110"><Instagram size={20} /></a>}
                {settingsData.youtube && <a href={settingsData.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white transition transform hover:scale-110"><Youtube size={20} /></a>}
                {settingsData.showWhatsapp && settingsData.whatsapp && <a href={settingsData.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 transition transform hover:scale-110"><WhatsAppIcon size={20} /></a>}
              </div>

              <span className="text-blue-400/50 hidden md:inline">|</span>

              {/* Links Institucionais */}
              <button onClick={() => setCurrentPage('about')} className={`hover:text-white transition ${currentPage === 'about' ? 'text-white font-bold' : ''}`}>Quem Somos</button>
              
              <span className="text-blue-400/50 hidden md:inline">|</span>
              
              <button onClick={() => setCurrentPage('contact')} className={`hover:text-white transition ${currentPage === 'contact' ? 'text-white font-bold' : ''}`}>Contato</button>
              
              <span className="text-blue-400/50 hidden md:inline">|</span>

              {/* Data e Hora */}
              <div className="hidden lg:block text-blue-100">
                {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • <span className="font-bold text-white">{currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            </div>

            {/* DIREITA: Conta do Usuário / Login */}
            <div className="flex items-center gap-3">
              {user ? (
                 <div className="flex items-center gap-3">
                   {user.role === 'admin' && (<button onClick={() => setCurrentPage('admin')} className="hidden md:flex items-center gap-2 text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full font-bold transition shadow-sm"><Settings size={16}/> Admin</button>)}
                   
                   <div className="relative">
                     <div className="flex items-center gap-2 cursor-pointer bg-blue-700/50 hover:bg-blue-700 p-1.5 pr-4 rounded-full transition border border-blue-400/30" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                       {user.image ? (
                          <img src={user.image} alt="Perfil" className="w-8 h-8 rounded-full object-cover border border-white/50 shadow-sm" />
                       ) : (
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold shadow-sm uppercase text-xs">{user.name[0]}</div>
                       )}
                       <div className="text-left leading-tight"><p className="text-sm font-bold text-white tracking-wide">{user.name.split(' ')[0]}</p></div>
                     </div>
                     
                     {isUserMenuOpen && (
                       <>
                         <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)}></div>
                         <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in slide-in-from-top-2 text-slate-800">
                           <button onClick={() => { setCurrentPage('profile'); setIsUserMenuOpen(false); window.scrollTo(0,0); }} className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors">
                             <User size={18}/> Meu Perfil
                           </button>
                           <div className="h-px bg-slate-100 my-1"></div>
                           <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                             <LogOut size={18}/> Sair do Site
                           </button>
                         </div>
                       </>
                     )}
                   </div>
                 </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button onClick={() => { setIsLoginOpen(true); setAuthMode('login'); }} className="text-sm font-bold text-white hover:text-blue-200 transition">Entrar</button>
                  <button onClick={() => { setIsLoginOpen(true); setAuthMode('register'); }} className="text-sm font-bold bg-white text-blue-700 hover:bg-blue-50 px-5 py-2 rounded-full shadow-md transition hover:-translate-y-0.5">Cadastrar</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FAIXA 2: LOGO E BARRA DE BUSCA (Lado a lado) */}
        <header className="bg-white shadow-sm border-b border-slate-200 relative z-40">
          <div className="max-w-[1600px] mx-auto px-4 h-20 flex items-center justify-between gap-4 md:gap-12">
            
            {/* LOGO */}
            <div className="flex items-center cursor-pointer group h-14 md:h-16 shrink-0" onClick={() => setCurrentPage('home')}>
              <img 
                src={logoImg} 
                alt={`${APP_BRAND} da Cidade ${CITY_NAME}`} 
                className="h-full w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
            
            {/* BARRA DE PESQUISA FUNCIONAL */}
            <form onSubmit={handleSearch} className="flex-1 max-w-3xl flex bg-slate-50 items-center px-4 md:px-5 py-2.5 md:py-3 rounded-full border border-slate-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-inner">
              <Search size={20} className="text-slate-400 mr-2 md:mr-3 shrink-0"/>
              <input name="searchQuery" defaultValue={searchQuery} placeholder="Buscar notícias, vagas, imóveis, empresas..." className="bg-transparent outline-none text-sm md:text-base w-full placeholder:text-slate-400 font-medium text-slate-700"/>
              <button type="submit" className="hidden">Buscar</button>
            </form>
            
          </div>
        </header>

      </div>

      <div className="max-w-[1600px] mx-auto pt-6 px-0 md:px-4 flex gap-6 min-h-[calc(100vh-144px)]">
        <aside className="hidden lg:block w-64 shrink-0 sticky top-48 h-fit space-y-2">
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
          
          {/* SÓ MOSTRA O CARROSSEL NO HOME */}
          {currentPage === 'home' && (
            <div className="px-4 md:px-0">
               <GlobalAdsCarousel ads={adsData} />
            </div>
          )}

          {currentPage === 'home' && <HomePage 
              navigate={setCurrentPage} 
              newsData={newsData} 
              eventsData={eventsData} 
              offersData={offersData} 
              jobsData={jobsData}
              adsData={adsData}
              user={user} 
              onNewsClick={handleNewsClick} 
              onJobClick={(j) => { setSelectedJob(j); setCurrentPage('job_detail'); window.scrollTo(0,0); }}
          />}
          
          {currentPage === 'search' && <SearchPage 
            query={searchQuery}
            newsData={newsData} guideData={guideData} jobsData={jobsData} propertiesData={propertiesData} vehiclesData={vehiclesData} eventsData={eventsData} offersData={offersData}
            onNewsClick={handleNewsClick}
            onGuideClick={(item) => { setSelectedGuideItem(item); setCurrentPage('guide_detail'); window.scrollTo(0,0); }}
            onJobClick={(j) => { setSelectedJob(j); setCurrentPage('job_detail'); window.scrollTo(0,0); }}
            onPropertyClick={(p) => { setSelectedProperty(p); setCurrentPage('property_detail'); window.scrollTo(0,0); }}
            onVehicleClick={(v) => { setSelectedVehicle(v); setCurrentPage('vehicle_detail'); window.scrollTo(0,0); }}
            onEventClick={(evt) => { setSelectedEvent(evt); setCurrentPage('event_detail'); window.scrollTo(0,0); }}
            onOfferClick={(o) => { setSelectedOffer(o); setCurrentPage('offer_detail'); window.scrollTo(0,0); }}
          />}

          {currentPage === 'offers' && <OffersPage offersData={offersData} onOfferClick={(o) => { setSelectedOffer(o); setCurrentPage('offer_detail'); window.scrollTo(0,0); }} />}
          {currentPage === 'offer_detail' && <OfferDetailPage offer={selectedOffer} onBack={() => setCurrentPage('offers')} />}

          {currentPage === 'news_detail' && <NewsDetailPage news={selectedNews} user={user} onBack={() => setCurrentPage('news')} />}
          {currentPage === 'news' && <NewsPage newsData={newsData} user={user} onNewsClick={handleNewsClick} />}
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
          {currentPage === 'admin' && user?.role === 'admin' && <AdminPage newsData={newsData} eventsData={eventsData} propertiesData={propertiesData} jobsData={jobsData} vehiclesData={vehiclesData} guideData={guideData} adsData={adsData} offersData={offersData} settingsData={settingsData} crud={crud} />}
          
          {currentPage === 'profile' && user && <ProfilePage user={user} db={db} setUser={setUser} onBack={() => setCurrentPage('home')} />}
          
          {currentPage === 'about' && <AboutPage />}
          {currentPage === 'contact' && <ContactPage settingsData={settingsData} />}
        </main>

        <aside className="hidden xl:block w-80 shrink-0 sticky top-48 h-fit space-y-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl group-hover:scale-110 transition duration-700"></div>
            <div className="relative z-10"><WeatherWidget /></div>
          </div>
          
          <MiniOffersCarousel offers={offersData} navigate={setCurrentPage} onOfferClick={(o) => { setSelectedOffer(o); setCurrentPage('offer_detail'); window.scrollTo(0,0); }} />
          
          <SidebarAd ads={adsData} />
          
          <MiniPropertiesCarousel 
            properties={propertiesData} 
            navigate={setCurrentPage} 
            onPropertyClick={(p) => { setSelectedProperty(p); setCurrentPage('property_detail'); window.scrollTo(0,0); }} 
            onCadastrarClick={() => {
              if (!user) { alert("Faça login ou cadastre-se para anunciar um imóvel."); setIsLoginOpen(true); return; }
              setCurrentPage('real_estate'); window.scrollTo(0,0);
            }} 
          />
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
               Inscrever com Google
            </button>
            <div className="text-center text-xs mt-2">Já tem conta? <span className="cursor-pointer text-indigo-600 hover:underline font-bold" onClick={() => setAuthMode('login')}>Faça Login</span></div>
          </form>
        )}
      </Modal>
    </div>
  );
}