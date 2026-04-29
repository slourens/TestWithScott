import { useState, useEffect, useRef } from 'react'
import './AdminLogin.css'

export default function AdminLogin({ onLogin, onClose }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const usernameRef = useRef(null)

  useEffect(() => {
    usernameRef.current?.focus()
    const handleKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const success = onLogin(username.trim(), password)
    if (!success) {
      setError('Incorrect username or password.')
      setPassword('')
    }
  }

  return (
    <div className="login-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="login-modal" role="dialog" aria-modal="true" aria-label="Admin login">
        <button className="login-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="login-header">
          <span className="login-lock">🔒</span>
          <h2 className="login-title">Admin Access</h2>
          <p className="login-subtitle">Sign in to manage the plant library</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="field-label" htmlFor="username">Username</label>
            <input
              ref={usernameRef}
              id="username"
              className="field-input"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError('') }}
              placeholder="Enter username"
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="password">Password</label>
            <div className="password-wrap">
              <input
                id="password"
                className="field-input"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                placeholder="Enter password"
              />
              <button
                type="button"
                className="toggle-pw"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <p className="login-error" role="alert">{error}</p>}

          <button
            className="login-submit"
            type="submit"
            disabled={!username || !password}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
