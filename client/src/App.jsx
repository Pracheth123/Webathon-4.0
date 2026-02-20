import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/common/Navbar'
import Landing from './pages/Landing'
import Issues from './pages/Issues'
import Dashboard from './pages/Dashboard'
import Escalations from './pages/Escalations'
import Analytics from './pages/Analytics'
import VolunteerTask from './pages/VolunteerTask'
import Login from './pages/Login'
import Municipal from './pages/Municipal'

function Layout() {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <Outlet />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/map" element={<Issues />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/head" element={<Escalations />} />
            <Route path="/municipal" element={<Municipal />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/volunteer/:taskId" element={<VolunteerTask />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
