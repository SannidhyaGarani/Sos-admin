import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
     apiKey: "AIzaSyDjeQQ8tmvgd7aNZTCmXx0v-k-0GiHIOVI",
  authDomain: "mahanta-group-b342f.firebaseapp.com",
  projectId: "mahanta-group-b342f",
  storageBucket: "mahanta-group-b342f.firebasestorage.app",
  messagingSenderId: "658979847198",
  appId: "1:658979847198:web:4bce685e9692682566020f",
  measurementId: "G-QF690L6NQ0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
