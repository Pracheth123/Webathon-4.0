import { createContext, useContext, useState, createElement } from 'react'
import { currentUser } from '../data/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('citizen') // 'citizen' | 'local_head' | 'municipal'

  const credentials = [
    { email: 'citizen@civicpulse.in', password: 'citizen123', role: 'citizen', user: currentUser },
    { email: 'localhead@civicpulse.in', password: 'local123', role: 'local_head', user: currentUser },
    { email: 'municipal@civicpulse.in', password: 'muni123', role: 'municipal', user: currentUser },
  ]

  const login = (email, password) => {
    const match = credentials.find(
      (c) => c.email === email && c.password === password
    )
    if (!match) return false
    setUser(match.user)
    setRole(match.role)
    return true
  }

  const logout = () => {
    setUser(null)
    setRole('citizen')
  }

  return createElement(
    AuthContext.Provider,
    { value: { user, role, login, logout } },
    children
  )
}

export const useAuth = () => useContext(AuthContext)
