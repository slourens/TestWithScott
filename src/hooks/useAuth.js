import { useState, useCallback } from 'react'
import { ADMIN_CREDENTIALS } from '../config/adminCredentials'

const SESSION_KEY = 'plant_admin_session'

function isSessionValid() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return false
    const { expiresAt } = JSON.parse(raw)
    return Date.now() < expiresAt
  } catch {
    return false
  }
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(isSessionValid)

  const login = useCallback((username, password) => {
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      // 8-hour session
      const session = { expiresAt: Date.now() + 8 * 60 * 60 * 1000 }
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
      setIsAuthenticated(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setIsAuthenticated(false)
  }, [])

  return { isAuthenticated, login, logout }
}
