import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBuiwRxvNkOFXCdiky_XAc9oBLtiMIZacQ",
  authDomain: "cms-sociyo.firebaseapp.com",
  projectId: "cms-sociyo",
  storageBucket: "cms-sociyo.firebasestorage.app",
  messagingSenderId: "225805643674",
  appId: "1:225805643674:web:c3e16c344b100c324b5423",
};

// 🔥 initialize app
const app = initializeApp(firebaseConfig);

// 🔥 IMPORTANT: messaging export
export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null;