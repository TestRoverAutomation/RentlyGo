import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyByh0NrF4LS04VUkazAyhU-mHqyz0_XaZ0",
  authDomain: "rentlygo-5d18a.firebaseapp.com",
  projectId: "rentlygo-5d18a",
  storageBucket: "rentlygo-5d18a.appspot.com",
  messagingSenderId: "534071853565",
  appId: "1:534071853565:web:c300e4a1c66d3d5082d994",
  measurementId: "G-DHK9EDPB8V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth providers
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };