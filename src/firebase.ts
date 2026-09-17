import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app'

// Firebase web configuration identifies this public client; it is not a server secret.
export const firebaseConfig = {
  apiKey: 'AIzaSyDMB2_z28kgC5AWALhvJs-vakbcHSDnRkk',
  authDomain: 'atomic-kissa.firebaseapp.com',
  projectId: 'atomic-kissa',
  storageBucket: 'atomic-kissa.firebasestorage.app',
  messagingSenderId: '889011220036',
  appId: '1:889011220036:web:92f5052c6319e4301a1611',
} satisfies FirebaseOptions

// Reuse the default app during Vite hot reloads instead of initializing twice.
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
