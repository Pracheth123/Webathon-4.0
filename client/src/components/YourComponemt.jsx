import { useEffect } from 'react'
import { api } from '../services/api'

export default function TestConnection() {
  useEffect(() => {
    testBackend()
  }, [])

  const testBackend = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/health')
      const data = await response.json()
      console.log('✅ Backend Connected!', data)
    } catch (error) {
      console.error('❌ Connection Error:', error)
    }
  }

  return <div>Check console logs</div>
}