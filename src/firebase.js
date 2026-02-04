import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// --- COLE AQUI O CÓDIGO QUE VOCÊ COPIOU DO FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyD...", // (O seu código real vai estar aqui)
  authDomain: "link-ouro-branco.firebaseapp.com",
  projectId: "link-ouro-branco",
  storageBucket: "link-ouro-branco.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
// -------------------------------------------------------

// Inicia a conexão
const app = initializeApp(firebaseConfig);

// Exporta o banco de dados para ser usado no resto do site
export const db = getFirestore(app);