import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getStorage } from "firebase/storage"; 

// This pulls keys from Vite env variables.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const requiredFirebaseKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const hasPlaceholderValue = (value = '') => {
  const normalized = String(value).toLowerCase();
  return normalized.includes('xxxx') || normalized.includes('your_');
};

const missingFirebaseKeys = requiredFirebaseKeys.filter((key) => {
  const value = firebaseConfig[key];
  return !value || hasPlaceholderValue(value);
});

export const firebaseConfigured = missingFirebaseKeys.length === 0;

if (!firebaseConfigured) {
  console.warn(`[firebase] Disabled: missing/placeholder Vite env keys: ${missingFirebaseKeys.join(', ')}`);
}

// Initialize only when the config is present, so routes still render without Firebase.
const app = firebaseConfigured ? initializeApp(firebaseConfig) : null;

// Export the services you want to use in your app
export const auth = app ? getAuth(app) : null;
export const storage = app ? getStorage(app) : null;

export default app;