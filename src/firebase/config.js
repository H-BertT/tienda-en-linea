import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'; // Importa el módulo de almacenamiento

const firebaseConfig = {
    apiKey: "AIzaSyBRf6CwTPYpot5u46F6QBeieMYp2q5k8hE",
    authDomain: "tienda-de-ropa-sta.firebaseapp.com",
    projectId: "tienda-de-ropa-sta",
    storageBucket: "tienda-de-ropa-sta.appspot.com",
    messagingSenderId: "1037452781992",
    appId: "1:1037452781992:web:489e02e38c676dfd4f559d",
    measurementId: "G-9K6C5J658E"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); // Configurar persistencia local

const db = firebase.firestore();
const storage = firebase.storage(); // Crea una instancia de Firebase Storage

export { auth, db, storage };
