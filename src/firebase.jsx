import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDB_ZVLwMTRuMRIzYKQdHgSUrc0Q6u-Kn8",
  authDomain: "riktam-chat-application.firebaseapp.com",
  projectId: "riktam-chat-application",
  storageBucket: "riktam-chat-application.appspot.com",
  messagingSenderId: "1065032724244",
  appId: "1:1065032724244:web:b3df3e147c8840c5c2dc01",
  measurementId: "G-LKG62XCGSJ",
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
