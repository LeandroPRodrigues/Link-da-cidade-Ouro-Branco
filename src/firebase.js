import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 
import { getAuth } from "firebase/auth"; // <--- NOVO IMPORT DA AUTENTICAÇÃO

// Estas são as suas chaves reais. Não mudam!
const firebaseConfig = {
  apiKey: "AIzaSyDH062yVHGjXFjlxRv0MO7tewxhPwXolks",
  authDomain: "link-ouro-branco.firebaseapp.com",
  projectId: "link-ouro-branco",
  storageBucket: "link-ouro-branco.firebasestorage.app", 
  messagingSenderId: "886718167183",
  appId: "1:886718167183:web:54ed275b4dd7a8074058fa",
  measurementId: "G-MKBZPJ4RWH"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app); 
export const auth = getAuth(app); // <--- LIGAMOS A SEGURANÇA (COFRE) AQUI