import { db as firestoreDB } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';

// Função auxiliar
const mapList = (snapshot) => {
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const database = {
  // --- NOTÍCIAS ---
  getNews: async () => { const q = await getDocs(collection(firestoreDB, "news")); return mapList(q); },
  addNews: async (item) => { const { id, ...data } = item; await addDoc(collection(firestoreDB, "news"), data); },
  updateNews: async (item) => { const { id, ...data } = item; await updateDoc(doc(firestoreDB, "news", id), data); },
  deleteNews: async (id) => { await deleteDoc(doc(firestoreDB, "news", id)); },

  // --- EVENTOS ---
  getEvents: async () => { const q = await getDocs(collection(firestoreDB, "events")); return mapList(q); },
  addEvent: async (item) => { const { id, ...data } = item; await addDoc(collection(firestoreDB, "events"), data); },
  updateEvent: async (item) => { const { id, ...data } = item; await updateDoc(doc(firestoreDB, "events", id), data); },
  deleteEvent: async (id) => { await deleteDoc(doc(firestoreDB, "events", id)); },

  // --- IMÓVEIS (Agora salva o ownerId) ---
  getProperties: async () => { const q = await getDocs(collection(firestoreDB, "properties")); return mapList(q); },
  addProperty: async (item) => { const { id, ...data } = item; await addDoc(collection(firestoreDB, "properties"), data); },
  updateProperty: async (item) => { const { id, ...data } = item; await updateDoc(doc(firestoreDB, "properties", id), data); },
  deleteProperty: async (id) => { await deleteDoc(doc(firestoreDB, "properties", id)); },

  // --- EMPREGOS ---
  getJobs: async () => { const q = await getDocs(collection(firestoreDB, "jobs")); return mapList(q); },
  addJob: async (item) => { const { id, ...data } = item; await addDoc(collection(firestoreDB, "jobs"), data); },
  updateJob: async (item) => { const { id, ...data } = item; await updateDoc(doc(firestoreDB, "jobs", id), data); },
  deleteJob: async (id) => { await deleteDoc(doc(firestoreDB, "jobs", id)); },

  // --- VEÍCULOS (Agora salva o ownerId) ---
  getVehicles: async () => { const q = await getDocs(collection(firestoreDB, "vehicles")); return mapList(q); },
  addVehicle: async (item) => { const { id, ...data } = item; await addDoc(collection(firestoreDB, "vehicles"), data); },
  updateVehicle: async (item) => { const { id, ...data } = item; await updateDoc(doc(firestoreDB, "vehicles", id), data); },
  deleteVehicle: async (id) => { await deleteDoc(doc(firestoreDB, "vehicles", id)); },

  // --- GUIA ---
  getGuide: async () => { const q = await getDocs(collection(firestoreDB, "guide")); return mapList(q); },
  addGuideItem: async (item) => { const { id, ...data } = item; await addDoc(collection(firestoreDB, "guide"), data); },
  updateGuideItem: async (item) => { const { id, ...data } = item; await updateDoc(doc(firestoreDB, "guide", id), data); },
  deleteGuideItem: async (id) => { await deleteDoc(doc(firestoreDB, "guide", id)); },

  // --- USUÁRIOS E AUTH ---
  findUser: async (email, password) => {
    // 1. Verifica se é o Admin Supremo (Seus dados novos)
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
    // Nota: O ideal é usar Firebase Auth no futuro, mas mantendo a lógica atual:
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
    return !querySnapshot.empty; // Retorna true se achar o CPF
  },

  checkEmailExists: async (email) => {
    const q = query(collection(firestoreDB, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  },

  saveUser: async (user) => {
    // Salva o usuário na coleção 'users'
    await addDoc(collection(firestoreDB, "users"), user);
  }
};

export const db = database;