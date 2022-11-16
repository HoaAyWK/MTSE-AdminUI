// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeSSO1NM_Ko32KGfx28xckBgF5wsZ6MVk",
  authDomain: "mtse-ba6db.firebaseapp.com",
  projectId: "mtse-ba6db",
  storageBucket: "mtse-ba6db.appspot.com",
  messagingSenderId: "220246540792",
  appId: "1:220246540792:web:a2b3639c531e88fa66d60d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
