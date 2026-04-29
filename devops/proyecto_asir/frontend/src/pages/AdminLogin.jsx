import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService } from '../services/api'

function AdminLogin() {
  const [form, setForm]       = useState({ username: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const navigate              = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await adminService.login(form.username, form.password)
    setLoading(false)
    if (res.success) {
      navigate('/dashboard')
    } else {
      setError(res.message || 'Credenciales incorrectas.')
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Panel de Control</h2>
        <p>Acceso restringido. Introduce tus credenciales de administrador.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-control"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Verificando...' : 'Acceder al panel'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
