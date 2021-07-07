import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: "vuegram-67465.firebaseapp.com",
  projectId: "vuegram-67465",
  storageBucket: "vuegram-67465.appspot.com",
  messagingSenderId: "253255325083",
  appId: "1:253255325083:web:ff5baf9eb51373bd2a3d3e",
  measurementId: "G-N3ZNN83JY7",
};

firebase.initializeApp(firebaseConfig);

// utils
const db = firebase.firestore();
const auth = firebase.auth();

// collection references
const usersCollection = db.collection("users");
const postsCollection = db.collection("posts");
const commentsCollection = db.collection("comments");
const likesCollection = db.collection("likes");

export {
  db,
  auth,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection,
};
