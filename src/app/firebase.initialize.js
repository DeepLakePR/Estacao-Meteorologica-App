// Setup
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCDWQzsbBmGpHi1MxGxfxH120uwPdfU3Ys",
    authDomain: "estacao-meteorologica-szy.firebaseapp.com",
    projectId: "estacao-meteorologica-szy",
    storageBucket: "estacao-meteorologica-szy.appspot.com",
    messagingSenderId: "696732337384",
    appId: "1:696732337384:web:8cc2f15df02089d084755d",
    measurementId: "G-6VM6592Y09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export { app as Firebase, database as Database };
