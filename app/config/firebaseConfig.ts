// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: '',
  authDomain: 'hirebizz-chat.firebaseapp.com',
  databaseURL: 'https://hirebizz-chat-default-rtdb.firebaseio.com',
  projectId: 'hirebizz-chat',
  storageBucket: 'hirebizz-chat.appspot.com',
  messagingSenderId: '',
  appId: '',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export { db }
