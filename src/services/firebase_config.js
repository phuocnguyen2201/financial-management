// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_DATABASE_API_KEY,
  authDomain: "financial-mgt.firebaseapp.com",
  databaseURL: process.env.EXPO_PUBLIC_DATABSE_URL,
  projectId: "financial-mgt",
  storageBucket: "financial-mgt.firebasestorage.app",
  messagingSenderId: "403741153966",
  appId: "1:403741153966:web:398ab6d421fdb49df8ab3f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);