import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCx_SliAbdg3mou7p08kR0lq_16KNV5XI1",
  authDomain: "re-global-2d9bc.firebaseapp.com",
  projectId: "re-global-2d9bc",
  storageBucket: "re-global-2d9bc.firebasestorage.app",
  messagingSenderId: "690182944594",
  appId: "1:690182944594:web:cf6899b34f9a97ad64ec8b",
  measurementId: "G-J62M98F7Y4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);