import { getApp, getApps, initializeApp } from 'firebase/app'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth'
import { ENV, requireEnv } from '../config/env'

export function isFirebaseConfigured() {
  return Boolean(
    ENV.FIREBASE_API_KEY
    && ENV.FIREBASE_AUTH_DOMAIN
    && ENV.FIREBASE_PROJECT_ID
    && ENV.FIREBASE_APP_ID,
  )
}

const firebaseConfig = {
  apiKey: requireEnv('EXPO_PUBLIC_FIREBASE_API_KEY', ENV.FIREBASE_API_KEY),
  authDomain: requireEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', ENV.FIREBASE_AUTH_DOMAIN),
  projectId: requireEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID', ENV.FIREBASE_PROJECT_ID),
  storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
  appId: requireEnv('EXPO_PUBLIC_FIREBASE_APP_ID', ENV.FIREBASE_APP_ID),
}

export function getFirebaseApp() {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase mobile nao configurado neste build. Defina EXPO_PUBLIC_FIREBASE_* no EAS.')
  }

  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
}

export function getFirebaseAuth() {
  const app = getFirebaseApp()

  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    })
  } catch {
    return getAuth(app)
  }
}
