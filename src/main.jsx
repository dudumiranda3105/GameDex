import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './contexts/AuthContext'
import { LibraryProvider } from './contexts/LibraryContext'
import { ProfileProvider } from './contexts/ProfileContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ProfileProvider>
        <LibraryProvider>
          <App />
        </LibraryProvider>
      </ProfileProvider>
    </AuthProvider>
  </StrictMode>,
)

