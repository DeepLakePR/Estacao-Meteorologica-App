// Setup
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// https://firebase.google.com/docs/web/setup#available-libraries

// .Env
const EnvKeys = process.env;

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: EnvKeys.EXPO_PUBLIC_FIREBASE_GOOGLE_API_KEY,
    authDomain: "estacao-meteorologica-szy.firebaseapp.com",
    projectId: "estacao-meteorologica-szy",
    storageBucket: "estacao-meteorologica-szy.appspot.com",
    messagingSenderId: EnvKeys.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: EnvKeys.EXPO_PUBLIC_FIREBASE_APP_ID,
    measurementId: EnvKeys.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export { app as Firebase, database as Database };
