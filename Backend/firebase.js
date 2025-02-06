import { initializeApp } from "firebase/app";

require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINSENDERID,
  appId: process.env.FIREBASE_APPID
};

const app = initializeApp(firebaseConfig);