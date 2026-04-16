import { useContext } from 'react'
import { LibraryContext } from '../contexts/library-context'

export function useLibrary() {
  return useContext(LibraryContext)
}
