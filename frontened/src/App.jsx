
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './components/Home'
import Signup from './components/Signup'
import Login from './components/Login'
import { Dashboard } from './components/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
