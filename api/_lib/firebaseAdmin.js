import { getApps, cert, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function readFirebaseEnv() {
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error(
      'Variaveis do Firebase ausentes. Defina FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY.',
    )
  }

  return {
    projectId,
    clientEmail,
    privateKey: privateKeyRaw.replace(/\\n/g, '\n'),
  }
}

function getOrInitFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0]
  }

  const serviceAccount = readFirebaseEnv()
  return initializeApp({
    credential: cert(serviceAccount),
  })
}

export function getFirebaseServices() {
  const app = getOrInitFirebaseAdmin()

  return {
    auth: getAuth(app),
    db: getFirestore(app),
  }
}
