// Renomeamos 'db' para 'firestoreDB' na importação para evitar conflito de nomes
import { db as firestoreDB } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// Função auxiliar para converter o resultado do Firebase em uma lista limpa
const mapList = (snapshot) => {
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const database = {
  // --- NOTÍCIAS ---
  getNews: async () => {
    const querySnapshot = await getDocs(collection(firestoreDB, "news"));
    return mapList(querySnapshot);
  },
  addNews: async (item) => {
    const { id, ...data } = item; 
    await addDoc(collection(firestoreDB, "news"), data);
  },
  updateNews: async (item) => {
    const { id, ...data } = item;
    await updateDoc(doc(firestoreDB, "news", id), data);
  },
  deleteNews: async (id) => {
    await deleteDoc(doc(firestoreDB, "news", id));
  },

  // --- EVENTOS ---
  getEvents: async () => {
    const querySnapshot = await getDocs(collection(firestoreDB, "events"));
    return mapList(querySnapshot);
  },
  addEvent: async (item) => {
    const { id, ...data } = item;
    await addDoc(collection(firestoreDB, "events"), data);
  },
  updateEvent: async (item) => {
    const { id, ...data } = item;
    await updateDoc(doc(firestoreDB, "events", id), data);
  },
  deleteEvent: async (id) => {
    await deleteDoc(doc(firestoreDB, "events", id));
  },

  // --- IMÓVEIS ---
  getProperties: async () => {
    const querySnapshot = await getDocs(collection(firestoreDB, "properties"));
    return mapList(querySnapshot);
  },
  addProperty: async (item) => {
    const { id, ...data } = item;
    await addDoc(collection(firestoreDB, "properties"), data);
  },
  updateProperty: async (item) => {
    const { id, ...data } = item;
    await updateDoc(doc(firestoreDB, "properties", id), data);
  },
  deleteProperty: async (id) => {
    await deleteDoc(doc(firestoreDB, "properties", id));
  },

  // --- EMPREGOS ---
  getJobs: async () => {
    const querySnapshot = await getDocs(collection(firestoreDB, "jobs"));
    return mapList(querySnapshot);
  },
  addJob: async (item) => {
    const { id, ...data } = item;
    await addDoc(collection(firestoreDB, "jobs"), data);
  },
  updateJob: async (item) => {
    const { id, ...data } = item;
    await updateDoc(doc(firestoreDB, "jobs", id), data);
  },
  deleteJob: async (id) => {
    await deleteDoc(doc(firestoreDB, "jobs", id));
  },

  // --- VEÍCULOS ---
  getVehicles: async () => {
    const querySnapshot = await getDocs(collection(firestoreDB, "vehicles"));
    return mapList(querySnapshot);
  },
  addVehicle: async (item) => {
    const { id, ...data } = item;
    await addDoc(collection(firestoreDB, "vehicles"), data);
  },
  updateVehicle: async (item) => {
    const { id, ...data } = item;
    await updateDoc(doc(firestoreDB, "vehicles", id), data);
  },
  deleteVehicle: async (id) => {
    await deleteDoc(doc(firestoreDB, "vehicles", id));
  },

  // --- GUIA COMERCIAL ---
  getGuide: async () => {
    const querySnapshot = await getDocs(collection(firestoreDB, "guide"));
    return mapList(querySnapshot);
  },
  addGuideItem: async (item) => {
    const { id, ...data } = item;
    await addDoc(collection(firestoreDB, "guide"), data);
  },
  updateGuideItem: async (item) => {
    const { id, ...data } = item;
    await updateDoc(doc(firestoreDB, "guide", id), data);
  },
  deleteGuideItem: async (id) => {
    await deleteDoc(doc(firestoreDB, "guide", id));
  },

  // --- USUÁRIOS ---
  findUser: async (email, password) => {
    if (email === 'admin@link.com' && password === 'admin123') {
      return { id: 'admin_master', name: 'Administrador', email, role: 'admin', type: 'admin' };
    }
    const querySnapshot = await getDocs(collection(firestoreDB, "users"));
    const users = mapList(querySnapshot);
    return users.find(u => u.email === email && u.password === password);
  },
  saveUser: async (user) => {
    await addDoc(collection(firestoreDB, "users"), user);
  }
};

// Aqui mantemos a exportação como 'db' para não quebrar o App.jsx
export const db = database;