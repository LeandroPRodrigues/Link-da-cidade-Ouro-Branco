import { db as firestoreDB } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

// Função auxiliar
const mapList = (snapshot) => {
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const database = {
  // --- NOTÍCIAS (Agora inicia com likes e comments vazios) ---
  getNews: async () => { const q = await getDocs(collection(firestoreDB, "news")); return mapList(q); },
  addNews: async (item) => { const { id, ...data } = item; await addDoc(collection(firestoreDB, "news"), { ...data, likes: [], comments: [] }); },
  updateNews: async (item) => { const { id, ...data } = item; await updateDoc(doc(firestoreDB, "news", id), data); },
  deleteNews: async (id) => { await deleteDoc(doc(firestoreDB, "news", id)); },

  // --- EVENTOS (Agora inicia com likes e comments vazios) ---
  getEvents: async () => { const q = await getDocs(collection(firestoreDB, "events")); return mapList(q); },
  addEvent: async (item) => { const { id, ...data } = item; await addDoc(collection(firestoreDB, "events"), { ...data, likes: [], comments: [] }); },
  updateEvent: async (item) => { const { id, ...data } = item; await updateDoc(doc(firestoreDB, "events", id), data); },
  deleteEvent: async (id) => { await deleteDoc(doc(firestoreDB, "events", id)); },

  // --- IMÓVEIS ---
  getProperties: async () => { const q = await getDocs(collection(firestoreDB, "properties")); return mapList(q); },
  addProperty: async (item) => { const { id, ...data } = item; await addDoc(collection(firestoreDB, "properties"), data); },
  updateProperty: async (item) => { const { id, ...data } = item; await updateDoc(doc(firestoreDB, "properties", id), data); },
  deleteProperty: async (id) => { await deleteDoc(doc(firestoreDB, "properties", id)); },

  // --- EMPREGOS ---
  getJobs: async () => { const q = await getDocs(collection(firestoreDB, "jobs")); return mapList(q); },
  addJob: async (item) => { const { id, ...data } = item; await addDoc(collection(firestoreDB, "jobs"), data); },
  updateJob: async (item) => { const { id, ...data } = item; await updateDoc(doc(firestoreDB, "jobs", id), data); },
  deleteJob: async (id) => { await deleteDoc(doc(firestoreDB, "jobs", id)); },

  // --- VEÍCULOS ---
  getVehicles: async () => { const q = await getDocs(collection(firestoreDB, "vehicles")); return mapList(q); },
  addVehicle: async (item) => { const { id, ...data } = item; await addDoc(collection(firestoreDB, "vehicles"), data); },
  updateVehicle: async (item) => { const { id, ...data } = item; await updateDoc(doc(firestoreDB, "vehicles", id), data); },
  deleteVehicle: async (id) => { await deleteDoc(doc(firestoreDB, "vehicles", id)); },

  // --- GUIA ---
  getGuide: async () => { const q = await getDocs(collection(firestoreDB, "guide")); return mapList(q); },
  addGuideItem: async (item) => { const { id, ...data } = item; await addDoc(collection(firestoreDB, "guide"), data); },
  updateGuideItem: async (item) => { const { id, ...data } = item; await updateDoc(doc(firestoreDB, "guide", id), data); },
  deleteGuideItem: async (id) => { await deleteDoc(doc(firestoreDB, "guide", id)); },

  // --- INTERAÇÕES SOCIAIS (NOVO) ---
  toggleLike: async (collectionName, itemId, userId) => {
    const itemRef = doc(firestoreDB, collectionName, itemId);
    const itemSnap = await getDoc(itemRef);
    
    if (itemSnap.exists()) {
      const data = itemSnap.data();
      const likes = data.likes || [];
      
      if (likes.includes(userId)) {
        // Se já curtiu, remove (Descurtir)
        await updateDoc(itemRef, { likes: arrayRemove(userId) });
      } else {
        // Se não curtiu, adiciona (Curtir)
        await updateDoc(itemRef, { likes: arrayUnion(userId) });
      }
    }
  },

  addComment: async (collectionName, itemId, comment) => {
    const itemRef = doc(firestoreDB, collectionName, itemId);
    await updateDoc(itemRef, { comments: arrayUnion(comment) });
  },

  // --- USUÁRIOS E AUTH (Mantido Original) ---
  findUser: async (email, password) => {
    // 1. Verifica se é o Admin Supremo
    if (email === 'leandro122005@hotmail.com' && password === 'Leolure123!') {
      return { 
        id: 'admin_master', 
        name: 'Leandro Admin', 
        email, 
        role: 'admin', 
        type: 'admin' 
      };
    }
    // 2. Verifica usuários comuns no banco
    const q = query(collection(firestoreDB, "users"), where("email", "==", email), where("password", "==", password));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0];
      return { id: docData.id, ...docData.data(), role: 'user' };
    }
    return null;
  },

  checkCpfExists: async (cpf) => {
    const q = query(collection(firestoreDB, "users"), where("cpf", "==", cpf));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; 
  },

  checkEmailExists: async (email) => {
    const q = query(collection(firestoreDB, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  },

  saveUser: async (user) => {
    await addDoc(collection(firestoreDB, "users"), user);
  }
};

export const db = database;