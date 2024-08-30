import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chatapplication-989a6.firebaseapp.com",
  projectId: "chatapplication-989a6",
  storageBucket: "chatapplication-989a6.appspot.com",
  messagingSenderId: "1096230143334",
  appId: "1:1096230143334:web:7992badcdd2b4b4156f4a7",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
