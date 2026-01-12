// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE,
  authDomain: "foodapp-fff5d.firebaseapp.com",
  projectId: "foodapp-fff5d",
  storageBucket: "foodapp-fff5d.appspot.com",
  messagingSenderId: "829969386465",
  appId: "1:829969386465:web:663be18d896b8ffc51a0a0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {auth,app}