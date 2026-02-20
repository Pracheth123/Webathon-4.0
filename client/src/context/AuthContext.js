import { createContext, useContext, useState, createElement, useEffect } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [role, setRole] = useState('citizen')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Verify token on app load
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await authApi.verifyToken()
          if (response.success) {
            setUser(response.user)
            setRole(response.user.role)
          } else {
            localStorage.removeItem('token')
            setToken(null)
          }
        } catch (err) {
          console.error('Token verification failed:', err)
          localStorage.removeItem('token')
          setToken(null)
        }
      }
      setIsInitialized(true)
    }
    verifyToken()
  }, [])

  const login = async (email, password, societyId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authApi.login(email, password, societyId)
      setUser(response.user)
      setToken(response.token)
      setRole(response.user.role)
      return { success: true, user: response.user }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authApi.register(userData)
      setUser(response.user)
      setToken(response.token)
      setRole(response.user.role)
      return { success: true, user: response.user }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    try {
      authApi.logout()
    } catch (err) {
      console.error('Logout error:', err)
    }
    setUser(null)
    setToken(null)
    setRole('citizen')
    setError(null)
  }

  const value = {
    user,
    token,
    role,
    login,
    register,
    logout,
    setRole,
    loading,
    error,
    isAuthenticated: !!user && !!token,
    isInitialized
  }

  return createElement(
    AuthContext.Provider,
    { value },
    children
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
