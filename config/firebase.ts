// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMUUfe4rJQw8Kim-Z4_pEif9WVe1cy9MA",
  authDomain: "torodofarms.firebaseapp.com",
  projectId: "torodofarms",
  storageBucket: "torodofarms.appspot.com",
  messagingSenderId: "365803794501",
  appId: "1:365803794501:android:e6b2bab2a3d1490b03b32c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth and Firestore instances
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app; 