import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { adminService } from '../services/api'

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    let cancelled = false
    adminService.verify().then(valid => {
      if (!cancelled) setStatus(valid ? 'ok' : 'denied')
    })
    return () => { cancelled = true }
  }, [])

  if (status === 'checking') {
    return (
      <div className="auth-wrapper">
        <p style={{ color: 'var(--text-muted)' }}>Verificando acceso...</p>
      </div>
    )
  }

  if (status === 'denied') {
    return <Navigate to="/admin-login" replace />
  }

  return children
}

export default ProtectedRoute
