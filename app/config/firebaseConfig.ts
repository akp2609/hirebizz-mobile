// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsikmz9nyvFLBPXaVfvCuL292G_sk6e5I",
  authDomain: "hirebizz-chat.firebaseapp.com",
  databaseURL: "https://hirebizz-chat-default-rtdb.firebaseio.com",
  projectId: "hirebizz-chat",
  storageBucket: "hirebizz-chat.firebasestorage.app",
  messagingSenderId: "870815556675",
  appId: "1:870815556675:web:86b1a70790900627b920f6",
  measurementId: "G-BMRMM8H08T"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export { db }
