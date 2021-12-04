import firebase from "firebase/app";
import "firebase/auth";

firebase.initializeApp({
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MSG_SENDER_ID,
    appId: process.env.VUE_APP_FIREBASE_APP_ID
});

export const auth = firebase.auth();
