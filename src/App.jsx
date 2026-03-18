import React, { useState, useEffect, useCallback } from 'react';
import { Home, Briefcase, Car, Store, Menu, User, LogOut, List, Calendar, Loader, PlusCircle, Search, Grid, Settings, ShoppingBag, Facebook, Instagram, Youtube, X, Tag } from 'lucide-react';
import { db } from './utils/database';
import { validateCPF, formatCPF } from './utils/cpfValidator';
import Modal from './components/Modal';

import PropertyForm from './components/PropertyForm';
import VehicleForm from './components/VehicleForm';
import JobForm from './components/JobForm';
import GuideForm from './components/GuideForm';
import ClassifiedForm from './components/ClassifiedForm';

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
import SearchPage from './pages/SearchPage';
import ClassifiedsPage from './pages/ClassifiedsPage';

import logoImg from './logo.jpg'; 

const APP_BRAND = "Link"; 
const CITY_NAME = "Ouro Branco";

// Ícones compactos
const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.004 2C6.48 2 2.004 6.476 2.004 12C2.004 13.824 2.49 15.54 3.328 17.034L2 22L7.098 20.686C8.56 21.524 10.236 22 12.004 22C17.528 22 22.004 17.524 22.004 12C22.004 6.476 17.528 2 12.004 2ZM17.18 16.538C16.99 17.076 16.038 17.514 15.534 17.576C15.06 17.632 14.45 17.682 12.392 16.83C9.314 15.556 7.324 12.438 7.17 12.238C7.02 12.038 5.898 10.554 5.898 9.014C5.898 7.474 6.678 6.726 7 6.406C7.272 6.136 7.726 6.002 8.164 6.002C8.304 6.002 8.432 6.008 8.542 6.014C8.868 6.028 9.032 6.046 9.25 6.568C9.52 7.218 10.176 8.818 10.254 8.98C10.334 9.14 10.412 9.356 10.306 9.566C10.206 9.778 10.12 9.872 9.96 10.058C9.8 10.244 9.654 10.38 9.498 10.584C9.354 10.768 9.192 10.966 9.37 11.274C9.544 11.576 10.15 12.564 11.05 13.364C12.21 14.398 13.16 14.726 13.496 14.866C13.75 14.972 14.052 14.954 14.234 14.756C14.464 14.506 14.752 14.12 15.042 13.726C15.248 13.446 15.5 13.404 15.766 13.504C16.038 13.6 17.49 14.318 17.79 14.468C18.09 14.618 18.29 14.692 18.364 14.82C18.438 14.948 18.438 15.548 18.18 16.538Z"/>
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const createSlug = (text) => {
  if (!text) return '';
  return text.toString().toLowerCase()
    .trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const GlobalAdsCarousel = ({ ads }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const topAds = ads?.filter(ad => ad.position !== 'middle' && ad.position !== 'sidebar') || [];

  useEffect(() => {
    if (topAds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % topAds.length);
    }, 5000); 
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
            <button 
              key={idx} 
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-5 bg-indigo-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'}`} 
            />
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
  const [searchQuery, setSearchQuery] = useState('');
  
  // ESTADO GLOBAL DO POP-UP (MODAL DE CADASTRO)
  const [globalFormOpen, setGlobalFormOpen] = useState(null);

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
  const [classifiedsData, setClassifiedsData] = useState([]); 
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
      case 'history': setCurrentPage('history'); break;
      case 'gallery': setCurrentPage('gallery'); break;
      case 'busca': setCurrentPage('search'); break;
      case 'classificados': setCurrentPage('classifieds'); break;
      
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

  const isItemActive = (item, type) => {
    const updated = new Date(item.updatedAt || item.createdAt || item.date || 0).getTime();
    const diffDays = (new Date().getTime() - updated) / (1000 * 60 * 60 * 24);
    const maxActive = (type === 'property' && item.type === 'Temporada') ? 90 : 30;
    return diffDays <= maxActive;
  };

  const autoCleanupDeletions = async (data, type, deleteFn) => {
    const now = new Date().getTime();
    for (const item of data) {
      const updated = new Date(item.updatedAt || item.createdAt || item.date || 0).getTime();
      const diffDays = (now - updated) / (1000 * 60 * 60 * 24);
      const maxDelete = (type === 'property' && item.type === 'Temporada') ? 120 : 60;
      if (diffDays > maxDelete) {
        try { await deleteFn(item.id); } catch(e){}
      }
    }
  };

  const loadAllData = async () => {
    try {
      await db.cleanOldEvents();
      
      const safeFetch = async (fetchPromise, fallback) => {
        try { return await fetchPromise; } catch (err) { return fallback; }
      };

      const [n, e, p, j, v, g, a, o, s, c] = await Promise.all([
        safeFetch(db.getNews(), []),
        safeFetch(db.getEvents(), []),
        safeFetch(db.getProperties(), []),
        safeFetch(db.getJobs(), []),
        safeFetch(db.getVehicles(), []),
        safeFetch(db.getGuide(), []),
        safeFetch(db.getAds(), []),
        safeFetch(db.getOffers(), []),
        safeFetch(db.getSettings(), {}),
        safeFetch(db.getClassifieds(), [])
      ]);

      setNewsData(n); setEventsData(e); setPropertiesData(p); setJobsData(j); setVehiclesData(v); setGuideData(g); setAdsData(a); setOffersData(o); setSettingsData(s); setClassifiedsData(c);
      
      autoCleanupDeletions(p, 'property', db.deleteProperty);
      autoCleanupDeletions(v, 'vehicle', db.deleteVehicle);
      autoCleanupDeletions(j, 'job', db.deleteJob);
      autoCleanupDeletions(c, 'classified', db.deleteClassified);

      resolveUrlPath(window.location.pathname, {
          news: n, events: e, real_estate: p, jobs: j, vehicles: v, guide: g, offers: o, classifieds: c
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
    else if (currentPage === 'history') { newUrl = '/history'; pageTitle = `História de ${CITY_NAME} | ${APP_BRAND} da Cidade`; }
    else if (currentPage === 'gallery') { newUrl = '/gallery'; pageTitle = `Galeria de Fotos | ${APP_BRAND} da Cidade`; }
    else if (currentPage === 'search') { newUrl = '/busca'; pageTitle = `Resultados da Busca | ${APP_BRAND} da Cidade`; }
    else if (currentPage === 'classifieds') { newUrl = '/classificados'; pageTitle = `Classificados da Comunidade | ${APP_BRAND} da Cidade`; }
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
        jobs: jobsData, vehicles: vehiclesData, guide: guideData, offers: offersData, classifieds: classifiedsData
      });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [resolveUrlPath, newsData, eventsData, propertiesData, jobsData, vehiclesData, guideData, offersData, classifiedsData]);
  
  const crud = {
    addNews: async (item) => { await db.addNews(item); setNewsData(await db.getNews()); },
    updateNews: async (item) => { await db.updateNews(item); setNewsData(await db.getNews()); },
    deleteNews: async (id) => { await db.deleteNews(id); setNewsData(await db.getNews()); },
    
    addEvent: async (item) => { await db.addEvent(item); setEventsData(await db.getEvents()); },
    updateEvent: async (item) => { await db.updateEvent(item); setEventsData(await db.getEvents()); },
    deleteEvent: async (id) => { await db.deleteEvent(id); setEventsData(await db.getEvents()); },
    
    addProperty: async (item) => { 
      const i = { ...item, ownerId: user?.id || 'admin', ownerName: user?.name || 'Administrador', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; 
      await db.addProperty(i); setPropertiesData(await db.getProperties()); 
    },
    updateProperty: async (item) => { await db.updateProperty({...item, updatedAt: new Date().toISOString()}); setPropertiesData(await db.getProperties()); },
    deleteProperty: async (id) => { await db.deleteProperty(id); setPropertiesData(await db.getProperties()); },
    
    addJob: async (item) => { 
      const i = { ...item, ownerId: user?.id || 'admin', ownerName: user?.name || 'Administrador', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; 
      await db.addJob(i); setJobsData(await db.getJobs()); 
    },
    updateJob: async (item) => { await db.updateJob({...item, updatedAt: new Date().toISOString()}); setJobsData(await db.getJobs()); },
    deleteJob: async (id) => { await db.deleteJob(id); setJobsData(await db.getJobs()); },
    
    addVehicle: async (item) => { 
      const i = { ...item, ownerId: user?.id || 'admin', ownerName: user?.name || 'Administrador', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; 
      await db.addVehicle(i); setVehiclesData(await db.getVehicles()); 
    },
    updateVehicle: async (item) => { await db.updateVehicle({...item, updatedAt: new Date().toISOString()}); setVehiclesData(await db.getVehicles()); },
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
    
    updateSettings: async (item) => { await db.updateSettings(item); setSettingsData(await db.getSettings()); },

    addClassified: async (item) => { 
      const i = { ...item, ownerId: user?.id || 'admin', ownerName: user?.name || 'Administrador', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; 
      await db.addClassified(i); setClassifiedsData(await db.getClassifieds()); 
    },
    updateClassified: async (item) => { await db.updateClassified({...item, updatedAt: new Date().toISOString()}); setClassifiedsData(await db.getClassifieds()); },
    deleteClassified: async (id) => { await db.deleteClassified(id); setClassifiedsData(await db.getClassifieds()); },
  };

  // FUNÇÕES GLOBAIS DE CADASTRO (Abrem os Modais Diretamente)
  const handleAddClick = (type) => {
    if (!user) { 
      alert("Faça login para anunciar."); 
      setIsLoginOpen(true); 
      return; 
    } 
    let limit = 0;
    if (type === 'property') limit = propertiesData.filter(p => p.ownerId === user.id).length;
    if (type === 'vehicle') limit = vehiclesData.filter(v => v.ownerId === user.id).length;
    if (type === 'job') limit = jobsData.filter(j => j.ownerId === user.id).length;
    if (type === 'classified') limit = classifiedsData.filter(c => c.ownerId === user.id).length;
    
    if (user.role !== 'admin' && type !== 'guide' && limit >= 3) {
      alert("Limite de 3 cadastros atingido para esta categoria. Exclua anúncios antigos no seu Perfil."); 
      return;
    }
    setGlobalFormOpen(type); 
  };
  
  const handleLogin = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    const u = await db.loginUser(e.target.email.value, e.target.password.value);
    setLoading(false);
    if(u) { 
      setUser(u); 
      localStorage.setItem('app_user', JSON.stringify(u)); 
      setIsLoginOpen(false); 
      if(u.role === 'admin') setCurrentPage('admin'); 
    } else { 
      alert("E-mail ou senha incorretos."); 
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      const u = await db.loginWithGoogle();
      if(u) { 
        setUser(u); 
        localStorage.setItem('app_user', JSON.stringify(u)); 
        setIsLoginOpen(false); 
        if(u.role === 'admin') setCurrentPage('admin'); 
      }
    } catch (error) {
      console.error("Erro no login com Google:", error);
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

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.searchQuery.value.trim();
    if (query) {
      setSearchQuery(query);
      setCurrentPage('search');
      window.scrollTo(0,0);
    }
  };

  const NavItem = ({ page, label, icon: Icon }) => (
    <button onClick={() => { setCurrentPage(page); window.scrollTo(0,0); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm w-full ${currentPage === page ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>
      <Icon size={22} strokeWidth={currentPage === page ? 2.5 : 2} /> {label}
    </button>
  );
  
  const MobileTabItem = ({ page, label, icon: Icon }) => (
    <button onClick={() => { setCurrentPage(page); window.scrollTo(0,0); }} className={`flex flex-col items-center justify-center p-2 w-full transition-colors ${currentPage === page ? 'text-indigo-600' : 'text-slate-400'}`}>
      <Icon size={24} strokeWidth={currentPage === page ? 2.5 : 2} /> <span className="text-[10px] font-medium mt-1">{label}</span>
    </button>
  );

  const activeProperties = propertiesData.filter(i => isItemActive(i, 'property'));
  const activeVehicles = vehiclesData.filter(i => isItemActive(i, 'vehicle'));
  const activeJobs = jobsData.filter(i => isItemActive(i, 'job'));
  const activeClassifieds = classifiedsData.filter(i => isItemActive(i, 'classified'));

  if (loading && !newsData.length && !user) return (<div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-400"><Loader className="animate-spin mb-4 text-indigo-600" size={48} /><p>Carregando Link da Cidade...</p></div>);

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans text-slate-900 flex flex-col">
      
      <div className="sticky top-0 z-50">
        
        {/* FAIXA 1: TOPO AZUL */}
        <div className="bg-blue-600 text-blue-50 text-sm py-3 px-4 flex justify-between items-center shadow-md">
          <div className="max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0">
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-5 font-medium tracking-wide">
              
              <div className="flex items-center gap-3">
                {settingsData.facebook && <a href={settingsData.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition transform hover:scale-110"><Facebook size={20} /></a>}
                {settingsData.instagram && <a href={settingsData.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition transform hover:scale-110"><Instagram size={20} /></a>}
                {settingsData.youtube && <a href={settingsData.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white transition transform hover:scale-110"><Youtube size={20} /></a>}
                {settingsData.showWhatsapp && settingsData.whatsapp && <a href={settingsData.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 transition transform hover:scale-110"><WhatsAppIcon size={20} /></a>}
              </div>
              <span className="text-blue-400/50 hidden md:inline">|</span>
              <button onClick={() => setCurrentPage('about')} className={`hover:text-white transition ${currentPage === 'about' ? 'text-white font-bold' : ''}`}>Quem Somos</button>
              <span className="text-blue-400/50 hidden md:inline">|</span>
              <button onClick={() => setCurrentPage('contact')} className={`hover:text-white transition ${currentPage === 'contact' ? 'text-white font-bold' : ''}`}>Contato</button>
              <span className="text-blue-400/50 hidden md:inline">|</span>
              <div className="hidden lg:block text-blue-100">
                {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • <span className="font-bold text-white">{currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            </div>

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

        {/* FAIXA 2: LOGO E BUSCA */}
        <header className="bg-white shadow-sm border-b border-slate-200 relative z-40">
          <div className="max-w-[1600px] mx-auto px-4 h-20 flex items-center justify-between gap-4 md:gap-12">
            
            <div className="flex items-center cursor-pointer group h-14 md:h-16 shrink-0" onClick={() => setCurrentPage('home')}>
              <img src={logoImg} alt="Link da Cidade" className="h-full w-auto object-contain transition-transform group-hover:scale-105" />
            </div>
            
            <form onSubmit={handleSearch} className="flex-1 max-w-3xl flex bg-slate-50 items-center px-4 md:px-5 py-2.5 md:py-3 rounded-full border border-slate-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-inner">
              <Search size={20} className="text-slate-400 mr-2 md:mr-3 shrink-0"/>
              <input name="searchQuery" defaultValue={searchQuery} placeholder="Buscar notícias, vagas, imóveis, empresas..." className="bg-transparent outline-none text-sm md:text-base w-full placeholder:text-slate-400 font-medium text-slate-700"/>
              <button type="submit" className="hidden">Buscar</button>
            </form>
            
          </div>
        </header>
      </div>

      {/* ÁREA PRINCIPAL COM FLEX-1 PARA EMPURRAR O RODAPÉ PARA O FUNDO */}
      <div className="max-w-[1600px] mx-auto w-full pt-6 px-0 md:px-4 flex gap-6 flex-1">
        <aside className="hidden lg:block w-64 shrink-0 sticky top-36 h-fit space-y-2">
          <NavItem page="home" label="Feed Inicial" icon={Home} />
          <NavItem page="offers" label="Shopping / Ofertas" icon={ShoppingBag} />
          <NavItem page="news" label="Notícias" icon={List} />
          <NavItem page="events" label="Agenda & Eventos" icon={Calendar} />
          <div className="my-4 border-t border-slate-200 mx-4"></div>
          <p className="px-4 text-xs font-bold text-slate-400 uppercase mb-1">Classificados</p>
          <NavItem page="classifieds" label="Anúncios da Comunidade" icon={Tag} />
          <NavItem page="real_estate" label="Imóveis" icon={Home} />
          <NavItem page="jobs" label="Vagas de Emprego" icon={Briefcase} />
          <NavItem page="vehicles" label="Veículos" icon={Car} />
          <div className="my-4 border-t border-slate-200 mx-4"></div>
          <p className="px-4 text-xs font-bold text-slate-400 uppercase mb-1">Serviços</p>
          <NavItem page="guide" label="Guia Comercial" icon={Store} />
        </aside>

        <main className="flex-1 w-full min-w-0 pb-10">
          
          {currentPage === 'home' && (
            <div className="px-4 md:px-0">
               <GlobalAdsCarousel ads={adsData} />
            </div>
          )}

          {/* AS PÁGINAS RECEBEM AS LISTAS FILTRADAS */}
          {currentPage === 'home' && <HomePage navigate={setCurrentPage} newsData={newsData} eventsData={eventsData} offersData={offersData} jobsData={activeJobs} adsData={adsData} user={user} onNewsClick={handleNewsClick} onJobClick={(j) => { setSelectedJob(j); setCurrentPage('job_detail'); window.scrollTo(0,0); }} onCadastrarVagaClick={() => handleAddClick('job')} />}
          
          {currentPage === 'search' && <SearchPage query={searchQuery} newsData={newsData} guideData={guideData} jobsData={activeJobs} propertiesData={activeProperties} vehiclesData={activeVehicles} eventsData={eventsData} offersData={offersData} onNewsClick={handleNewsClick} onGuideClick={(item) => { setSelectedGuideItem(item); setCurrentPage('guide_detail'); window.scrollTo(0,0); }} onJobClick={(j) => { setSelectedJob(j); setCurrentPage('job_detail'); window.scrollTo(0,0); }} onPropertyClick={(p) => { setSelectedProperty(p); setCurrentPage('property_detail'); window.scrollTo(0,0); }} onVehicleClick={(v) => { setSelectedVehicle(v); setCurrentPage('vehicle_detail'); window.scrollTo(0,0); }} onEventClick={(evt) => { setSelectedEvent(evt); setCurrentPage('event_detail'); window.scrollTo(0,0); }} onOfferClick={(o) => { setSelectedOffer(o); setCurrentPage('offer_detail'); window.scrollTo(0,0); }} />}

          {currentPage === 'offers' && <OffersPage offersData={offersData} onOfferClick={(o) => { setSelectedOffer(o); setCurrentPage('offer_detail'); window.scrollTo(0,0); }} />}
          {currentPage === 'offer_detail' && <OfferDetailPage offer={selectedOffer} onBack={() => setCurrentPage('offers')} />}
          {currentPage === 'news_detail' && <NewsDetailPage news={selectedNews} user={user} onBack={() => setCurrentPage('news')} />}
          {currentPage === 'news' && <NewsPage newsData={newsData} user={user} onNewsClick={handleNewsClick} />}
          {currentPage === 'events' && <EventsPage eventsData={eventsData} onEventClick={(evt) => { setSelectedEvent(evt); setCurrentPage('event_detail'); window.scrollTo(0,0); }} />}
          {currentPage === 'event_detail' && <EventDetailPage event={selectedEvent} onBack={() => setCurrentPage('events')} />}
          
          {currentPage === 'classifieds' && <ClassifiedsPage classifiedsData={activeClassifieds} onAddClick={() => handleAddClick('classified')} />}
          
          {currentPage === 'real_estate' && <RealEstatePage user={user} navigate={setCurrentPage} propertiesData={activeProperties} onCrud={crud} checkLimit={() => handleAddClick('property')} onSelectProperty={(p) => { setSelectedProperty(p); setCurrentPage('property_detail'); window.scrollTo(0,0); }} />}
          {currentPage === 'property_detail' && <PropertyDetailPage property={selectedProperty} onBack={() => setCurrentPage('real_estate')} />}
          {currentPage === 'jobs' && <JobsPage jobsData={activeJobs} user={user} onJobClick={(j) => { setSelectedJob(j); setCurrentPage('job_detail'); window.scrollTo(0,0); }} onCrud={crud} checkLimit={() => handleAddClick('job')} />}
          {currentPage === 'job_detail' && <JobDetailPage job={selectedJob} onBack={() => setCurrentPage('jobs')} />}
          {currentPage === 'vehicles' && <VehiclesPage vehiclesData={activeVehicles} user={user} onCrud={crud} checkLimit={() => handleAddClick('vehicle')} onVehicleClick={(v) => { setSelectedVehicle(v); setCurrentPage('vehicle_detail'); window.scrollTo(0,0); }} />}
          {currentPage === 'vehicle_detail' && <VehicleDetailPage vehicle={selectedVehicle} onBack={() => setCurrentPage('vehicles')} />}
          {currentPage === 'guide' && <GuidePage guideData={guideData} crud={crud} onLocalClick={(item) => { setSelectedGuideItem(item); setCurrentPage('guide_detail'); window.scrollTo(0,0); }} />}
          {currentPage === 'guide_detail' && <GuideDetailPage item={selectedGuideItem} onBack={() => setCurrentPage('guide')} />}
          
          {/* AS PÁGINAS DE ADMINISTRAÇÃO RECEBEM TODA A BASE DE DADOS */}
          {currentPage === 'admin' && user?.role === 'admin' && <AdminPage newsData={newsData} eventsData={eventsData} propertiesData={propertiesData} jobsData={jobsData} vehiclesData={vehiclesData} guideData={guideData} classifiedsData={classifiedsData} adsData={adsData} offersData={offersData} settingsData={settingsData} crud={crud} />}
          {currentPage === 'profile' && user && <ProfilePage user={user} db={db} setUser={setUser} onBack={() => setCurrentPage('home')} propertiesData={propertiesData} vehiclesData={vehiclesData} jobsData={jobsData} classifiedsData={classifiedsData} crud={crud} />}
          
          {currentPage === 'about' && <AboutPage />}
          {currentPage === 'contact' && <ContactPage settingsData={settingsData} />}

          {/* NOVAS PÁGINAS EM CONSTRUÇÃO */}
          {currentPage === 'history' && (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-slate-200 animate-in fade-in">
              <h2 className="text-2xl font-black text-slate-800 mb-2">História de Ouro Branco</h2>
              <p className="text-slate-500">Página em construção. Em breve disponível!</p>
            </div>
          )}
          {currentPage === 'gallery' && (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-slate-200 animate-in fade-in">
              <h2 className="text-2xl font-black text-slate-800 mb-2">Galeria de Fotos</h2>
              <p className="text-slate-500">Página em construção. Em breve disponível!</p>
            </div>
          )}
        </main>

        <aside className="hidden xl:block w-80 shrink-0 sticky top-36 h-fit space-y-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl group-hover:scale-110 transition duration-700"></div>
            <div className="relative z-10"><WeatherWidget /></div>
          </div>
          
          <MiniOffersCarousel offers={offersData} navigate={setCurrentPage} onOfferClick={(o) => { setSelectedOffer(o); setCurrentPage('offer_detail'); window.scrollTo(0,0); }} />
          
          <SidebarAd ads={adsData} />
          
          <MiniPropertiesCarousel properties={activeProperties} navigate={setCurrentPage} onPropertyClick={(p) => { setSelectedProperty(p); setCurrentPage('property_detail'); window.scrollTo(0,0); }} onCadastrarClick={() => handleAddClick('property')} />
        </aside>
      </div>

      {/* RODAPÉ GLOBAL */}
      <footer className="bg-blue-700 text-blue-50 py-10 pb-24 lg:pb-10 border-t-4 border-blue-500 w-full mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* SOBRE O PORTAL */}
          <div>
            <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => {setCurrentPage('home'); window.scrollTo(0,0);}}>
              <div className="bg-white p-2 rounded-lg shadow-md"><Grid className="text-blue-600" size={24} /></div>
              <div>
                <h2 className="font-extrabold text-2xl tracking-tight text-white leading-none">{APP_BRAND}<span className="text-blue-300">daCidade</span></h2>
                <p className="text-[10px] text-blue-200 font-bold tracking-[0.2em] uppercase mt-0.5">{CITY_NAME}</p>
              </div>
            </div>
            <p className="text-sm text-blue-200 leading-relaxed mb-6">O portal mais completo de notícias, classificados e guia comercial de {CITY_NAME} e região.</p>
            <div className="flex items-center gap-3">
               {settingsData.facebook && <a href={settingsData.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-500 transition"><Facebook size={18} /></a>}
               {settingsData.instagram && <a href={settingsData.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-500 transition"><Instagram size={18} /></a>}
               {settingsData.youtube && <a href={settingsData.youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-500 transition"><Youtube size={18} /></a>}
            </div>
          </div>

          {/* INSTITUCIONAL */}
          <div>
            <h3 className="font-bold text-lg text-white mb-4 uppercase tracking-wider">Institucional</h3>
            <ul className="space-y-3 text-sm text-blue-200 font-medium">
              <li><button onClick={() => { setCurrentPage('about'); window.scrollTo(0,0); }} className="hover:text-white transition">Quem Somos</button></li>
              <li><button onClick={() => { setCurrentPage('contact'); window.scrollTo(0,0); }} className="hover:text-white transition">Contato</button></li>
              <li><button onClick={() => { setCurrentPage('history'); window.scrollTo(0,0); }} className="hover:text-white transition">História de Ouro Branco</button></li>
              <li><button onClick={() => { setCurrentPage('gallery'); window.scrollTo(0,0); }} className="hover:text-white transition">Galeria de Fotos</button></li>
            </ul>
          </div>

          {/* INTERATIVIDADE */}
          <div>
            <h3 className="font-bold text-lg text-white mb-4 uppercase tracking-wider">Interatividade</h3>
            <ul className="space-y-3 text-sm text-blue-200 font-medium">
              <li><button onClick={() => handleAddClick('classified')} className="hover:text-white transition">Anunciar nos Classificados</button></li>
              <li><button onClick={() => handleAddClick('property')} className="hover:text-white transition">Anunciar Imóvel</button></li>
              <li><button onClick={() => handleAddClick('vehicle')} className="hover:text-white transition">Anunciar Veículo</button></li>
              <li><button onClick={() => handleAddClick('job')} className="hover:text-white transition">Cadastrar Vaga de Emprego</button></li>
              <li><button onClick={() => handleAddClick('guide')} className="hover:text-white transition">Cadastrar Empresa no Guia</button></li>
            </ul>
          </div>

          {/* CONTEÚDO */}
          <div>
            <h3 className="font-bold text-lg text-white mb-4 uppercase tracking-wider">Conteúdo</h3>
            <ul className="space-y-3 text-sm text-blue-200 font-medium">
              <li><button onClick={() => { setCurrentPage('news'); window.scrollTo(0,0); }} className="hover:text-white transition">Notícias</button></li>
              <li><button onClick={() => { setCurrentPage('classifieds'); window.scrollTo(0,0); }} className="hover:text-white transition">Classificados</button></li>
              <li><button onClick={() => { setCurrentPage('real_estate'); window.scrollTo(0,0); }} className="hover:text-white transition">Imóveis</button></li>
              <li><button onClick={() => { setCurrentPage('vehicles'); window.scrollTo(0,0); }} className="hover:text-white transition">Veículos</button></li>
              <li><button onClick={() => { setCurrentPage('jobs'); window.scrollTo(0,0); }} className="hover:text-white transition">Vagas de Emprego</button></li>
              <li><button onClick={() => { setCurrentPage('guide'); window.scrollTo(0,0); }} className="hover:text-white transition">Guia Comercial</button></li>
            </ul>
          </div>

        </div>
        
        <div className="max-w-[1600px] mx-auto px-4 mt-10 pt-6 border-t border-blue-600/50 text-center text-xs text-blue-300 font-medium">
          <p>&copy; {new Date().getFullYear()} {APP_BRAND} da Cidade {CITY_NAME}. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* NAVEGAÇÃO MOBILE */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          <MobileTabItem page="home" label="Início" icon={Home} />
          <MobileTabItem page="classifieds" label="Classificados" icon={Tag} />
          <div className="relative -top-5">
            <button onClick={() => { setIsLoginOpen(true); }} className="bg-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-200 hover:scale-105 transition">
              <PlusCircle size={24} />
            </button>
          </div>
          <MobileTabItem page="guide" label="Guia" icon={Store} />
          <MobileTabItem page="offers" label="Shopping" icon={ShoppingBag} />
        </div>
      </nav>

      {/* MODAL GLOBAL PARA RENDERIZAR OS FORMULÁRIOS DE CADASTRO */}
      {globalFormOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto custom-scrollbar relative">
            <button onClick={() => setGlobalFormOpen(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition z-10">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black text-slate-800 mb-6 border-b border-slate-100 pb-4">
              {globalFormOpen === 'property' && 'Anunciar Imóvel'}
              {globalFormOpen === 'vehicle' && 'Anunciar Veículo'}
              {globalFormOpen === 'job' && 'Cadastrar Vaga de Emprego'}
              {globalFormOpen === 'guide' && 'Cadastrar Empresa no Guia'}
              {globalFormOpen === 'classified' && 'Criar Anúncio na Comunidade'}
            </h2>
            
            {globalFormOpen === 'property' && (
              <PropertyForm 
                isAdmin={user?.role === 'admin'} 
                onSuccess={(data) => { crud.addProperty(data); setGlobalFormOpen(null); alert("Imóvel publicado com sucesso!"); }} 
                onCancel={() => setGlobalFormOpen(null)} 
              />
            )}
            
            {globalFormOpen === 'vehicle' && (
              <VehicleForm 
                user={user} 
                onSuccess={(data) => { crud.addVehicle(data); setGlobalFormOpen(null); alert("Veículo publicado com sucesso!"); }} 
                onCancel={() => setGlobalFormOpen(null)} 
              />
            )}
            
            {globalFormOpen === 'job' && (
              <JobForm 
                onSuccess={(data) => { crud.addJob(data); setGlobalFormOpen(null); alert("Vaga publicada com sucesso!"); }} 
                onCancel={() => setGlobalFormOpen(null)} 
              />
            )}
            
            {globalFormOpen === 'guide' && (
              <GuideForm 
                onSuccess={(data) => { crud.addGuideItem({...data, status: 'pending'}); setGlobalFormOpen(null); alert("Empresa enviada para aprovação!"); }} 
                onCancel={() => setGlobalFormOpen(null)} 
              />
            )}

            {globalFormOpen === 'classified' && (
              <ClassifiedForm 
                user={user} 
                onSuccess={(data) => { crud.addClassified(data); setGlobalFormOpen(null); alert("Anúncio publicado nos Classificados!"); }} 
                onCancel={() => setGlobalFormOpen(null)} 
              />
            )}
          </div>
        </div>
      )}

      {/* MODAL DE LOGIN */}
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} title={authMode === 'login' ? "Bem-vindo de volta" : "Criar nova conta"}>
        {authMode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input name="email" placeholder="E-mail" className="input w-full bg-slate-50 border-slate-200 focus:bg-white" required/>
            <input name="password" type="password" placeholder="Senha" className="input w-full bg-slate-50 border-slate-200 focus:bg-white" required/>
            <button className="btn-primary w-full bg-indigo-600 hover:bg-indigo-700">Entrar na conta</button>
            <div className="relative flex items-center py-4"><div className="flex-grow border-t border-slate-200"></div><span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase tracking-wider font-bold">OU</span><div className="flex-grow border-t border-slate-200"></div></div>
            <button type="button" onClick={handleGoogleLogin} className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition flex items-center justify-center gap-3 shadow-sm">
              <GoogleIcon />
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
               <GoogleIcon />
               Inscrever com Google
            </button>
            <div className="text-center text-xs mt-2">Já tem conta? <span className="cursor-pointer text-indigo-600 hover:underline font-bold" onClick={() => setAuthMode('login')}>Faça Login</span></div>
          </form>
        )}
      </Modal>
    </div>
  );
}