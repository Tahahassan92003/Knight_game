import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAA8PP5UY1CswJJ3AUPDY4hhNSz9ZnjX78",
  authDomain: "knightgame-772dd.firebaseapp.com",
  projectId: "knightgame-772dd",
  storageBucket: "knightgame-772dd.appspot.com",
  messagingSenderId: "1098954363319",
  appId: "1:1098954363319:web:41466d0f3f9ed767e3d832",
  measurementId: "G-6SMVCLQ88G"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
