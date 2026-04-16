import { useContext } from 'react'
import { ProfileContext } from '../contexts/profile-context'

export function useProfile() {
  return useContext(ProfileContext)
}
