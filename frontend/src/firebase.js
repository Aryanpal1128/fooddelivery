// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1tqPP-dUQtC_JtwEoxHxQfGBTh4hvG6A",
  authDomain: "foodie-ec993.firebaseapp.com",
  projectId: "foodie-ec993",
  storageBucket: "foodie-ec993.firebasestorage.app",
  messagingSenderId: "433205333850",
  appId: "1:433205333850:web:c8635dcf7a7f7c5198ed63",
  measurementId: "G-M2XHYSHHVB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth, app, analytics };