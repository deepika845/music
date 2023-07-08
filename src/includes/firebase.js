import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyAHAs2N9RNFALo992ld6bVKp68IthGgcmA",
    authDomain: "music-b9267.firebaseapp.com",
    projectId: "music-b9267",
    storageBucket: "music-b9267.appspot.com",
    messagingSenderId: "519814909087",
    appId: "1:519814909087:web:3babf0e37df739525a66aa"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const userCollections = db.collection("users");
const songCollections = db.collection("songs")
const commentsCollections = db.collection("comments")

export { auth, db, userCollections, storage, songCollections, commentsCollections }