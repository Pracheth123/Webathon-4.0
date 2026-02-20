import { createContext, useContext, useState, createElement } from 'react'
import { currentUser } from '../data/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(currentUser)
  const [role, setRole] = useState('citizen') // 'citizen' | 'local_head' | 'municipal'

  const login = (email, _password, selectedRole = 'citizen') => {
    setUser(currentUser)
    setRole(selectedRole)
    return true
  }

  const logout = () => {
    setUser(null)
    setRole('citizen')
  }

  return createElement(
    AuthContext.Provider,
    { value: { user, role, login, logout, setRole } },
    children
  )
}

export const useAuth = () => useContext(AuthContext)
