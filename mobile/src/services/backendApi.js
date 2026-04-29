import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { updateProfile as updateAuthProfile } from 'firebase/auth'
import axios from 'axios'
import { getFirebaseAuth, getFirebaseDb } from '../lib/firebase'
import { ENV, requireEnv } from '../config/env'

const api = axios.create({
  baseURL: requireEnv('EXPO_PUBLIC_API_BASE_URL', ENV.API_BASE_URL),
})

function authHeaders(idToken) {
  return { Authorization: `Bearer ${idToken}` }
}

function isFirestorePermissionError(error) {
  return error?.code === 'permission-denied' || String(error?.message || '').includes('Missing or insufficient permissions')
}

function canUseApiFallback(idToken) {
  return Boolean(idToken && ENV.API_BASE_URL)
}

function getCurrentUid() {
  const auth = getFirebaseAuth()
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('Usuario nao autenticado')
  return uid
}

function userRoot(uid) {
  const db = getFirebaseDb()
  return {
    libraryCol: collection(db, 'users', uid, 'library'),
    profileDoc: doc(db, 'users', uid),
  }
}

export async function fetchLibrary(idToken) {
  const uid = getCurrentUid()
  try {
    const { libraryCol } = userRoot(uid)
    const snapshot = await getDocs(libraryCol)
    const items = snapshot.docs.map((itemDoc) => ({
      ...itemDoc.data(),
      gameId: itemDoc.data()?.gameId ?? Number(itemDoc.id),
    }))

    return items.sort((a, b) => {
      const aTime = a.updatedAt?.seconds || 0
      const bTime = b.updatedAt?.seconds || 0
      return bTime - aTime
    })
  } catch (error) {
    if (!isFirestorePermissionError(error) || !canUseApiFallback(idToken)) {
      throw error
    }

    const response = await api.get('/library', { headers: authHeaders(idToken) })
    return response.data.items || []
  }
}

export async function upsertLibrary(idToken, payload) {
  if (!payload?.gameId) throw new Error('gameId is required in payload')

  try {
    const uid = getCurrentUid()
    const db = getFirebaseDb()
    const entryDoc = doc(db, 'users', uid, 'library', String(payload.gameId))

    await setDoc(entryDoc, {
      ...payload,
      updatedAt: serverTimestamp(),
    }, { merge: true })

    return { ok: true }
  } catch (error) {
    if (!isFirestorePermissionError(error) || !canUseApiFallback(idToken)) {
      throw error
    }

    const response = await api.post('/library', payload, { headers: authHeaders(idToken) })
    return response.data
  }
}

export async function deleteLibraryEntry(idToken, gameId) {
  if (!gameId) throw new Error('gameId is required')

  try {
    const uid = getCurrentUid()
    const db = getFirebaseDb()
    const entryDoc = doc(db, 'users', uid, 'library', String(gameId))
    await deleteDoc(entryDoc)

    return { ok: true }
  } catch (error) {
    if (!isFirestorePermissionError(error) || !canUseApiFallback(idToken)) {
      throw error
    }

    const response = await api.delete('/library', {
      headers: authHeaders(idToken),
      params: { gameId },
    })
    return response.data
  }
}

export async function fetchProfile(idToken) {
  const uid = getCurrentUid()
  try {
    const { profileDoc } = userRoot(uid)
    const snapshot = await getDoc(profileDoc)

    if (!snapshot.exists()) return null
    const data = snapshot.data() || {}
    return {
      nickname: data.nickname || '',
      bio: data.bio || '',
      displayName: data.displayName || '',
      email: data.email || '',
      photoURL: data.photoURL || '',
      updatedAt: data.updatedAt || null,
    }
  } catch (error) {
    if (!isFirestorePermissionError(error) || !canUseApiFallback(idToken)) {
      throw error
    }

    const response = await api.get('/profile', { headers: authHeaders(idToken) })
    return response.data.profile || null
  }
}

export async function updateProfile(idToken, payload = {}) {
  const uid = getCurrentUid()
  const auth = getFirebaseAuth()
  try {
    const { profileDoc } = userRoot(uid)
    const profile = {
      nickname: payload.nickname || '',
      bio: payload.bio || '',
      displayName: payload.nickname?.trim() || auth.currentUser?.displayName || '',
      email: auth.currentUser?.email || '',
      photoURL: auth.currentUser?.photoURL || '',
      updatedAt: serverTimestamp(),
    }

    await setDoc(profileDoc, profile, { merge: true })

    if (auth.currentUser && payload.nickname?.trim()) {
      await updateAuthProfile(auth.currentUser, { displayName: payload.nickname.trim() })
    }

    return profile
  } catch (error) {
    if (!isFirestorePermissionError(error) || !canUseApiFallback(idToken)) {
      throw error
    }

    const response = await api.post('/profile', payload, { headers: authHeaders(idToken) })

    if (auth.currentUser && payload.nickname?.trim()) {
      await updateAuthProfile(auth.currentUser, { displayName: payload.nickname.trim() })
    }

    return response.data.profile || null
  }
}
