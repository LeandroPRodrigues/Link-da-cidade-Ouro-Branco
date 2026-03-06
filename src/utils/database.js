import { db as firestoreDB } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const mapList = (snapshot) => {
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const database = {
  // === ATUALIZADO: Puxa e mistura as duas coleções ('news' e 'noticias') ===
  getNews: async () => { 
    const [newsQ, noticiasQ] = await Promise.all([
      getDocs(collection(firestoreDB, "news")),
      getDocs(collection(firestoreDB, "noticias"))
    ]);
    
    // FUNÇÃO SALVA-VIDAS: Transforma o Timestamp do Firebase em Texto para o React não quebrar
    const formatarNoticia = (doc, nomeColecao) => {
      const data = doc.data();
      // Se a data for um Timestamp (tiver a função toDate), converte para string ISO
      if (data.date && typeof data.date.toDate === 'function') {
        data.date = data.date.toDate().toISOString();
      }
      return { id: doc.id, _collection: nomeColecao, ...data };
    };

    // Mapeia e anota a origem de cada documento passando pelo nosso formatador
    const newsList = newsQ.docs.map(doc => formatarNoticia(doc, 'news'));
    const noticiasList = noticiasQ.docs.map(doc => formatarNoticia(doc, 'noticias'));
    
    // Junta tudo em uma lista só
    const combined = [...newsList, ...noticiasList];
    
    // Organiza pela data, da notícia mais recente para a mais antiga
    combined.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    
    return combined; 
  },
  addNews: async (item) => { 
    const { id, _collection, ...data } = item; 
    // Notícias cadastradas manualmente pelo Admin vão para 'news'
    await addDoc(collection(firestoreDB, "news"), { ...data, likes: [], comments: [] }); 
  },
  updateNews: async (item) => { 
    const { id, _collection, ...data } = item; 
    const col = _collection || "news"; // Descobre de qual aba veio para atualizar na certa
    await updateDoc(doc(firestoreDB, col, id), data); 
  },
  deleteNews: async (id) => { 
    // Deleta de ambas as coleções por garantia para não dar erro
    await deleteDoc(doc(firestoreDB, "news", id)); 
    await deleteDoc(doc(firestoreDB, "noticias", id)); 
  },

  getEvents: async () => { const q = await getDocs(collection(firestoreDB, "events")); return mapList(q); },
  addEvent: async (item) => { const { id, ...data } = item; await addDoc(collection(firestoreDB, "events"), { ...data, likes: [], comments: [] }); },
  updateEvent: async (item) => { const { id, ...data } = item; await updateDoc(doc(firestoreDB, "events", id), data); },
  deleteEvent: async (id) => { await deleteDoc(doc(firestoreDB, "events", id)); },
  
  cleanOldEvents: async () => {
    const currentYear = new Date().getFullYear();
    const q = await getDocs(collection(firestoreDB, "events"));
    const allEvents = mapList(q);
    for (const ev of allEvents) {
      if (ev.date) {
        const evYear = new Date(ev.date + 'T00:00:00').getFullYear();
        if (evYear < currentYear) await deleteDoc(doc(firestoreDB, "events", ev.id));
      }
    }
  },

  getProperties: async () => { const q = await getDocs(collection(firestoreDB, "properties")); return mapList(q); },
  addProperty: async (item) => { const { id, ...data } = item; await addDoc(collection(firestoreDB, "properties"), data); },
  updateProperty: async (item) => { const { id, ...data } = item; await updateDoc(doc(firestoreDB, "properties", id), data); },
  deleteProperty: async (id) => { await deleteDoc(doc(firestoreDB, "properties", id)); },

  getJobs: async () => { const q = await getDocs(collection(firestoreDB, "jobs")); return mapList(q); },
  addJob: async (item) => { const { id, ...data } = item; await addDoc(collection(firestoreDB, "jobs"), data); },
  updateJob: async (item) => { const { id, ...data } = item; await updateDoc(doc(firestoreDB, "jobs", id), data); },
  deleteJob: async (id) => { await deleteDoc(doc(firestoreDB, "jobs", id)); },

  getVehicles: async () => { const q = await getDocs(collection(firestoreDB, "vehicles")); return mapList(q); },
  addVehicle: async (item) => { const { id, ...data } = item; await addDoc(collection(firestoreDB, "vehicles"), data); },
  updateVehicle: async (item) => { const { id, ...data } = item; await updateDoc(doc(firestoreDB, "vehicles", id), data); },
  deleteVehicle: async (id) => { await deleteDoc(doc(firestoreDB, "vehicles", id)); },

  getGuide: async () => { const q = await getDocs(collection(firestoreDB, "guide")); return mapList(q); },
  addGuideItem: async (item) => { const { id, ...data } = item; await addDoc(collection(firestoreDB, "guide"), data); },
  updateGuideItem: async (item) => { const { id, ...data } = item; await updateDoc(doc(firestoreDB, "guide", id), data); },
  deleteGuideItem: async (id) => { await deleteDoc(doc(firestoreDB, "guide", id)); },

  getAds: async () => { const q = await getDocs(collection(firestoreDB, "ads")); return mapList(q); },
  addAd: async (item) => { const { id, ...data } = item; await addDoc(collection(firestoreDB, "ads"), data); },
  updateAd: async (item) => { const { id, ...data } = item; await updateDoc(doc(firestoreDB, "ads", id), data); },
  deleteAd: async (id) => { await deleteDoc(doc(firestoreDB, "ads", id)); },

  getOffers: async () => { const q = await getDocs(collection(firestoreDB, "offers")); return mapList(q); },
  addOffer: async (item) => { const { id, ...data } = item; await addDoc(collection(firestoreDB, "offers"), data); },
  updateOffer: async (item) => { const { id, ...data } = item; await updateDoc(doc(firestoreDB, "offers", id), data); },
  deleteOffer: async (id) => { await deleteDoc(doc(firestoreDB, "offers", id)); },

  toggleLike: async (collectionName, itemId, userId) => {
    const itemRef = doc(firestoreDB, collectionName, itemId);
    const itemSnap = await getDoc(itemRef);
    if (itemSnap.exists()) {
      const data = itemSnap.data();
      const likes = data.likes || [];
      if (likes.includes(userId)) await updateDoc(itemRef, { likes: arrayRemove(userId) });
      else await updateDoc(itemRef, { likes: arrayUnion(userId) });
    }
  },
  addComment: async (collectionName, itemId, comment) => {
    const itemRef = doc(firestoreDB, collectionName, itemId);
    await updateDoc(itemRef, { comments: arrayUnion(comment) });
  },
  findUser: async (email, password) => {
    if (email === 'leandro122005@hotmail.com' && password === 'Leolure123!') return { id: 'admin_master', name: 'Leandro Admin', email, role: 'admin', type: 'admin' };
    const q = query(collection(firestoreDB, "users"), where("email", "==", email), where("password", "==", password));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) { const docData = querySnapshot.docs[0]; return { id: docData.id, ...docData.data(), role: 'user' }; }
    return null;
  },
  checkCpfExists: async (cpf) => { const q = query(collection(firestoreDB, "users"), where("cpf", "==", cpf)); return !(await getDocs(q)).empty; },
  checkEmailExists: async (email) => { const q = query(collection(firestoreDB, "users"), where("email", "==", email)); return !(await getDocs(q)).empty; },
  saveUser: async (user) => { await addDoc(collection(firestoreDB, "users"), user); }
};

export const db = database;