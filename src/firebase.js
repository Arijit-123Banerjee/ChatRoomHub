import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCx10CdSQ-fkak12miBcIOlBQFJvN5TDZU",
  authDomain: "chatapplication-45ccd.firebaseapp.com",
  projectId: "chatapplication-45ccd",
  storageBucket: "chatapplication-45ccd.appspot.com",
  messagingSenderId: "507336206155",
  appId: "1:507336206155:web:de984e2e91d2913bc56ace",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getFirestore(app);

export { auth, provider, database };
