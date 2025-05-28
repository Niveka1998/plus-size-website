// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhm_lg0x_ufTFPtMQyuYOy98RCKoNC-sI",
  authDomain: "first-ever-3xl-clothing-site.firebaseapp.com",
  projectId: "first-ever-3xl-clothing-site",
  storageBucket: "first-ever-3xl-clothing-site.appspot.com", // FIXED
  messagingSenderId: "27060481145",
  appId: "1:27060481145:web:52ef6ded6b4a34c9c0f8a8",
  measurementId: "G-3TLGHYZZCD"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
