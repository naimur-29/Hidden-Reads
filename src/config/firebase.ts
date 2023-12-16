// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { doc, getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "hidden-reads.firebaseapp.com",
  projectId: "hidden-reads",
  storageBucket: "hidden-reads.appspot.com",
  messagingSenderId: "89955039049",
  appId: "1:89955039049:web:12ca631339f019ab9e0c98",
  measurementId: "G-EFFM70KWZ2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);

// get refs:
export const getBooksRef = (id: string) => doc(db, "books", id);
export const getBookDownloadsRef = (id: string) => doc(db, "bookDownloads", id);
export const getStatsRef = (id: string) => doc(db, "stats", id);
