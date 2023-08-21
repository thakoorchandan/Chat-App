import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCw1VJaB-0RDvebSimmAi4FA5VAhv6uIEQ",
  authDomain: "riktam-chat.firebaseapp.com",
  projectId: "riktam-chat",
  storageBucket: "riktam-chat.appspot.com",
  messagingSenderId: "116095993428",
  appId: "1:116095993428:web:fbb0fea172f3e6186f8fc1",
  measurementId: "G-G6PWM2DSNR",
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
