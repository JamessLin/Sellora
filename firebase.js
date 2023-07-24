// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import {serverTimestamp} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjyHIv6oNcTEY-2p5UrVkQcouOCnQwkes",
  authDomain: "appnmi-auth.firebaseapp.com",
  projectId: "appnmi-auth",
  storageBucket: "appnmi-auth.appspot.com",
  messagingSenderId: "9666754771",
  appId: "1:9666754771:web:c20d7f05b9295332bd3c26"
};

// Initialize Firebase

const fireApp = firebase.initializeApp(firebaseConfig);

initializeAuth(fireApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

if(!firebase.apps.length) {firebase.initializeApp(firebaseConfig)}

const auth = firebase.auth()
const db = firebase.firestore()
const timestamp = serverTimestamp();
export { db, auth, timestamp };