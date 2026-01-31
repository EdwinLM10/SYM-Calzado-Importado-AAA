import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFuoBBX4puR4AenbXnALSdBB358WCrdFo",
  authDomain: "catalogo-tenis-9a3cd.firebaseapp.com",
  projectId: "catalogo-tenis-9a3cd",
  storageBucket: "catalogo-tenis-9a3cd.firebasestorage.app",
  messagingSenderId: "637390870890",
  appId: "1:637390870890:web:be6048264568bfcbe26d13"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);

