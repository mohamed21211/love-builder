import { initializeApp } from "firebase/app";
import { getFirestore, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBDW8UaO573PhHA3vrroU5c2AfRnOHG_K0",
  authDomain: "love-builder.firebaseapp.com",
  projectId: "love-builder",
  storageBucket: "love-builder.firebasestorage.app",
  messagingSenderId: "806283303667",
  appId: "1:806283303667:web:638c0b06917ef86d00f586",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

enableNetwork(db);