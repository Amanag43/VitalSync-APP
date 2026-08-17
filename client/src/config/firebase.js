import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";
const firebaseConfig = {
   apiKey: "AIzaSyDvcAwt5xOJNoYomEZUYziFjWLVRhba1HE",
    authDomain: "vitalsync-75922.firebaseapp.com",
    projectId: "vitalsync-75922",
    storageBucket: "vitalsync-75922.firebasestorage.app",
    messagingSenderId: "198685736458",
    appId: "1:198685736458:web:a51a28c8082ffa99b4e9f3",

};
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});