// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Validate environment variables
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('Missing Firebase environment variables:', missingVars);
}

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

let app, auth, db, storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
  auth = null;
  db = null;
  storage = null;
}

export const provider = new GoogleAuthProvider();
export { auth, db, storage, signInWithPopup };

// Profile management functions with proper error handling
export const saveUserProfile = async (userId, profileData) => {
  if (!db) {
    console.error("Firestore not initialized");
    return false;
  }
  
  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, profileData, { merge: true });
    console.log("Profile saved to Firebase successfully");
    return true;
  } catch (error) {
    console.error("Error saving user profile:", error);
    return false;
  }
};

export const getUserProfile = async (userId) => {
  if (!db) {
    console.error("Firestore not initialized");
    return null;
  }
  
  if (!userId) {
    console.error("No userId provided to getUserProfile");
    return null;
  }
  
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      console.log("Profile loaded from Firebase successfully");
      return userDoc.data();
    }
    console.log("No profile found in Firebase for user:", userId);
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

export const uploadProfileImage = async (userId, imageFile) => {
  if (!storage) {
    throw new Error("Firebase Storage not initialized");
  }
  
  if (!userId || !imageFile) {
    throw new Error("Missing userId or imageFile");
  }
  
  try {
    const imageRef = ref(storage, `profile-images/${userId}/${Date.now()}_${imageFile.name}`);
    console.log("Uploading image to Firebase Storage...");
    const snapshot = await uploadBytes(imageRef, imageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("Image uploaded successfully:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};

export const deleteProfileImage = async (imageUrl) => {
  if (!storage) {
    console.error("Firebase Storage not initialized");
    return false;
  }
  
  if (!imageUrl || !imageUrl.includes('firebase')) {
    console.log("Not a Firebase Storage URL, skipping deletion");
    return true;
  }
  
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    console.log("Old profile image deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting profile image:", error);
    return false;
  }
};

// Test function to check Firebase connection
export const testFirebaseConnection = async () => {
  try {
    if (!auth) {
      throw new Error("Firebase Auth not initialized");
    }
    console.log("Firebase connection test passed");
    return true;
  } catch (error) {
    console.error("Firebase connection test failed:", error);
    return false;
  }
};
