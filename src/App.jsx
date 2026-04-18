import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import './App.css'
import DownloadPage from './pages/DownloadPage'
import GameDetailsPage from './pages/GameDetailsPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import LibraryPage from './pages/LibraryPage'
import ProfilePage from './pages/ProfilePage'
import SearchPage from './pages/SearchPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/game/:id" element={<GameDetailsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/app" element={<DownloadPage />} />
          <Route path="/download" element={<Navigate to="/app" replace />} />
          <Route path="/about" element={<Navigate to="/app" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
