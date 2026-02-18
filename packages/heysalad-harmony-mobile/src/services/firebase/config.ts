import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, initializeFirestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
// @ts-ignore
import { getReactNativePersistence } from 'firebase/auth/react-native';

const expoExtra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;

const selectConfigValue = (...values: (string | undefined | null)[]) => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }
  return undefined;
};

const firebaseConfig = {
  apiKey: selectConfigValue(
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    expoExtra.firebaseApiKey as string | undefined
  ),
  authDomain: selectConfigValue(
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    expoExtra.firebaseAuthDomain as string | undefined
  ),
  projectId: selectConfigValue(
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    expoExtra.firebaseProjectId as string | undefined
  ),
  storageBucket: selectConfigValue(
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    expoExtra.firebaseStorageBucket as string | undefined
  ),
  messagingSenderId: selectConfigValue(
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    expoExtra.firebaseMessagingSenderId as string | undefined
  ),
  appId: selectConfigValue(
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    expoExtra.firebaseAppId as string | undefined
  ),
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  app = initializeApp(firebaseConfig);
  
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  
  // Initialize Firestore with the specific database ID
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true, // Better for React Native
  }, 'bereit'); // <- Specify your database name here
  
  storage = getStorage(app);
  
  console.log('✅ Firebase v9 initialized successfully with bereit database');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

export { app, auth, db, storage };
