// ------------------------------------------------------------
// CHEERFUL HOTEL – Firebase Setup
// ------------------------------------------------------------

// Import required Firebase features
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKkL2xpEMjYtLXYPnYN799evcXD1nPi20",
  authDomain: "cheerfulhotel.firebaseapp.com",
  projectId: "cheerfulhotel",
  storageBucket: "cheerfulhotel.firebasestorage.app",
  messagingSenderId: "779251690994",
  appId: "1:779251690994:web:cdfecd272ff3fc57200f6b",
  
  // ⭐ THIS IS THE MOST IMPORTANT PART ⭐
  // Without this, your dashboard will show EMPTY data.
  databaseURL: "https://cheerfulhotel-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const db = getDatabase(app);

console.log("Firebase connected successfully.");
