import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadFile = async (file, folder) => {
  if (!file) return null;
  
  // Cria um nome único para o arquivo (ex: news/123456789_foto.jpg)
  const filename = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `${folder}/${filename}`);
  
  // Sobe o arquivo
  const snapshot = await uploadBytes(storageRef, file);
  
  // Pega o link da internet para salvar no banco
  const url = await getDownloadURL(snapshot.ref);
  return url;
};