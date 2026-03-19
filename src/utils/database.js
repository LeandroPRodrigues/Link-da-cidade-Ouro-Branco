import { db as firestoreDB, auth, googleProvider } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, getDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup } from 'firebase/auth';

const mapList = (snapshot) => {
  return snapshot.docs.map(doc => {
    const data = doc.data();
    Object.keys(data).forEach(key => {
      if (data[key] && typeof data[key].toDate === 'function') {
        data[key] = data[key].toDate().toISOString();
      }
    });
    return { id: doc.id, ...data };
  });
};

export const database = {
  // CONFIGURAÇÕES DO SITE (REDES SOCIAIS ETC)
  getSettings: async () => {
    const snap = await getDocs(collection(firestoreDB, "settings"));
    if (snap.empty) return { facebook: '', instagram: '', youtube: '', whatsapp: '', showWhatsapp: false };
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  },
  updateSettings: async (item) => {
    if (item.id) { await updateDoc(doc(firestoreDB, "settings", item.id), item); }
    else { await addDoc(collection(firestoreDB, "settings"), item); }
  },

  getNews: async () => { 
    const [newsQ, noticiasQ] = await Promise.all([ getDocs(collection(firestoreDB, "news")), getDocs(collection(firestoreDB, "noticias")) ]);
    const formatarNoticia = (doc, nomeColecao) => {
      const data = doc.data();
      Object.keys(data).forEach(key => {
        if (data[key] && typeof data[key].toDate === 'function') data[key] = data[key].toDate().toISOString();
      });
      return { id: doc.id, _collection: nomeColecao, ...data };
    };
    const combined = [...newsQ.docs.map(doc => formatarNoticia(doc, 'news')), ...noticiasQ.docs.map(doc => formatarNoticia(doc, 'noticias'))];
    combined.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    return combined; 
  },
  addNews: async (item) => { const { id, _collection, ...data } = item; await addDoc(collection(firestoreDB, "news"), { ...data, likes: [], comments: [], views: 0 }); },
  updateNews: async (item) => { const { id, _collection, ...data } = item; await updateDoc(doc(firestoreDB, _collection || "news", id), data); },
  deleteNews: async (id) => { await deleteDoc(doc(firestoreDB, "news", id)); await deleteDoc(doc(firestoreDB, "noticias", id)); },

  incrementNewsView: async (id, collectionName = "news") => {
    try { await updateDoc(doc(firestoreDB, collectionName, id), { views: increment(1) }); } 
    catch (error) { console.error("Erro ao registrar visualização:", error); }
  },

  getEvents: async () => { const q = await getDocs(collection(firestoreDB, "events")); return mapList(q); },
  addEvent: async (item) => { const { id, ...data } = item; await addDoc(collection(firestoreDB, "events"), { ...data, likes: [], comments: [] }); },
  updateEvent: async (item) => { const { id, ...data } = item; await updateDoc(doc(firestoreDB, "events", id), data); },
  deleteEvent: async (id) => { await deleteDoc(doc(firestoreDB, "events", id)); },
  cleanOldEvents: async () => { },

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

  // --- NOVA COLEÇÃO: CLASSIFICADOS (PRODUTOS USADOS E SERVIÇOS) ---
  getClassifieds: async () => { const q = await getDocs(collection(firestoreDB, "classifieds")); return mapList(q); },
  addClassified: async (item) => { const { id, ...data } = item; await addDoc(collection(firestoreDB, "classifieds"), data); },
  updateClassified: async (item) => { const { id, ...data } = item; await updateDoc(doc(firestoreDB, "classifieds", id), data); },
  deleteClassified: async (id) => { await deleteDoc(doc(firestoreDB, "classifieds", id)); },

  toggleLike: async (colName, itemId, userId) => {
    const itemRef = doc(firestoreDB, colName, itemId);
    const snap = await getDoc(itemRef);
    if (snap.exists()) {
      const data = snap.data();
      const likes = data.likes || [];
      if (likes.includes(userId)) await updateDoc(itemRef, { likes: arrayRemove(userId) });
      else await updateDoc(itemRef, { likes: arrayUnion(userId) });
    }
  },
  addComment: async (colName, itemId, comment) => { await updateDoc(doc(firestoreDB, colName, itemId), { comments: arrayUnion(comment) }); },

  // --- GESTÃO DE USUÁRIOS ---
  getAllUsers: async () => { 
    const q = await getDocs(collection(firestoreDB, "users")); 
    return mapList(q); 
  },
  updateUserAdmin: async (docId, data) => { 
    await updateDoc(doc(firestoreDB, "users", docId), data); 
  },

  loginUser: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Bypass para o Admin principal
      if (user.email === 'leandro122005@hotmail.com') {
        return { id: user.uid, name: 'Leandro Admin', email: user.email, role: 'admin', type: 'admin', permissions: { unlimitedProperties: true, unlimitedVehicles: true, unlimitedJobs: true } };
      }
      
      const q = query(collection(firestoreDB, "users"), where("uid", "==", user.uid));
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        const userData = snap.docs[0].data();
        const docId = snap.docs[0].id;
        
        // Verifica Banimento
        if (userData.status === 'banned') {
          await signOut(auth);
          return { error: "Sua conta foi banida permanentemente por violar as regras do portal." };
        }
        
        // Verifica Suspensão Temporária
        if (userData.status === 'suspended' && userData.suspensionEnd) {
          const now = new Date().getTime();
          const end = new Date(userData.suspensionEnd).getTime();
          
          if (now < end) {
            await signOut(auth);
            const diasRestantes = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
            return { error: `Sua conta está suspensa temporariamente. Faltam ${diasRestantes} dia(s) para o desbloqueio.` };
          } else {
            // Se o tempo já passou, reativa a conta automaticamente
            await updateDoc(doc(firestoreDB, "users", docId), { status: 'active', suspensionEnd: null });
            userData.status = 'active';
            userData.suspensionEnd = null;
          }
        }

        return { id: user.uid, docId: docId, ...userData, role: userData.role || 'user' };
      }
      return { id: user.uid, name: 'Usuário', email: email, role: 'user' };
    } catch (error) {
      console.error("Erro no login:", error);
      return null;
    }
  },

  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      if (user.email === 'leandro122005@hotmail.com') {
        return { id: user.uid, name: 'Leandro Admin', email: user.email, role: 'admin', type: 'admin', permissions: { unlimitedProperties: true, unlimitedVehicles: true, unlimitedJobs: true } };
      }
      
      const q = query(collection(firestoreDB, "users"), where("uid", "==", user.uid));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        const newUser = { 
          uid: user.uid, 
          name: user.displayName || 'Usuário', 
          email: user.email, 
          type: 'user', 
          role: 'user', 
          status: 'active',
          permissions: { unlimitedProperties: false, unlimitedVehicles: false, unlimitedJobs: false },
          createdAt: new Date().toISOString() 
        };
        const docRef = await addDoc(collection(firestoreDB, "users"), newUser);
        return { id: user.uid, docId: docRef.id, ...newUser };
      } else {
        const userData = snap.docs[0].data();
        const docId = snap.docs[0].id;

        // Verifica Banimento
        if (userData.status === 'banned') {
          await signOut(auth);
          return { error: "Sua conta foi banida permanentemente por violar as regras do portal." };
        }
        
        // Verifica Suspensão Temporária
        if (userData.status === 'suspended' && userData.suspensionEnd) {
          const now = new Date().getTime();
          const end = new Date(userData.suspensionEnd).getTime();
          
          if (now < end) {
            await signOut(auth);
            const diasRestantes = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
            return { error: `Sua conta está suspensa temporariamente. Faltam ${diasRestantes} dia(s) para o desbloqueio.` };
          } else {
            await updateDoc(doc(firestoreDB, "users", docId), { status: 'active', suspensionEnd: null });
            userData.status = 'active';
            userData.suspensionEnd = null;
          }
        }

        return { id: user.uid, docId: docId, ...userData, role: userData.role || 'user' };
      }
    } catch (error) {
      console.error("Erro no login com Google:", error);
      return null;
    }
  },

  registerUser: async (userData) => {
    const { email, password, ...rest } = userData;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await addDoc(collection(firestoreDB, "users"), { 
      uid: userCredential.user.uid, 
      email, 
      status: 'active',
      permissions: { unlimitedProperties: false, unlimitedVehicles: false, unlimitedJobs: false },
      ...rest 
    });
    return true;
  },

  updateUserProfile: async (uid, updatedData) => {
    try {
      const q = query(collection(firestoreDB, "users"), where("uid", "==", uid));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const userDocRef = doc(firestoreDB, "users", snap.docs[0].id);
        await updateDoc(userDocRef, updatedData);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      return false;
    }
  },

  logoutUser: async () => {
    await signOut(auth);
  },

  checkCpfExists: async (cpf) => { 
    const q = query(collection(firestoreDB, "users"), where("cpf", "==", cpf)); 
    return !(await getDocs(q)).empty; 
  }
};

export const db = database;