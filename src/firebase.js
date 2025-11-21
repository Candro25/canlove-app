import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyCWJniryFIOMEJ6v-CN_khn4U-xRZyRsnU",
authDomain: "canlove-25.firebaseapp.com",
projectId: "canlove-25",
storageBucket: "canlove-25.firebasestorage.app",
messagingSenderId: "158705473002",
appId: "1:158705473002:web:d8e1e48139635e65070e93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);