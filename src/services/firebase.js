import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCoRwx66KZcFgyeAc0sgGEEwrUuC1_p75U",
    authDomain: "pizzeria-napoles-4feaa.firebaseapp.com",
    projectId: "pizzeria-napoles-4feaa",
    storageBucket: "pizzeria-napoles-4feaa.firebasestorage.app",
    messagingSenderId: "754721646964",
    appId: "1:754721646964:web:6e45843468a13385572421"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Inicializar Firestore
const db = getFirestore(app)

export { db }
