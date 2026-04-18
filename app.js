// 1. Importamos Firebase y Firestore usando enlaces web directos (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 2. Tu configuración exacta de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBsQ7_U4zdG8l-_x3rG5Jarw2PWqw8w9Ag",
  authDomain: "timmymarusite.firebaseapp.com",
  databaseURL: "https://timmymarusite-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "timmymarusite",
  storageBucket: "timmymarusite.firebasestorage.app",
  messagingSenderId: "59774405576",
  appId: "1:59774405576:web:597997f0be910ca82b0efd"
};

// 3. Inicializamos la aplicación y la base de datos
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Un mensaje para comprobar en la consola que todo va bien
console.log("✨ ¡Firebase conectado con éxito a TimmyMaruSite! ✨");
