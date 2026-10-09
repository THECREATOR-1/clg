import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBj96CMxPzAsaNQYuYIsp5P3bwb2I59eas",
  authDomain: "gen-lang-client-0195499892.firebaseapp.com",
  projectId: "gen-lang-client-0195499892",
  storageBucket: "gen-lang-client-0195499892.firebasestorage.app",
  messagingSenderId: "248006975583",
  appId: "1:248006975583:web:02bbe6f5da1b0cfbd2bbea"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-45902758-5912-4165-823f-2328dc8b0182");
