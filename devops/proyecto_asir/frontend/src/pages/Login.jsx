import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/api'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [message, setMessage] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)

    const result = await authService.login(formData)

    if (result.success) {
      // Notificar al Navbar que cambió la sesión
      window.dispatchEvent(new Event('userChanged'))
      navigate('/')
    } else {
      setMessage({ type: 'error', text: result.message })
    }
  }

  return (
    <main className="auth-wrapper container">
      <div className="auth-box">
        <h2>Bienvenido de nuevo</h2>
        <p>Ingresa tus datos para acceder a tu cuenta.</p>

        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              required
              placeholder="tu@correo.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Iniciar sesión
          </button>
        </form>

        <div className="auth-footer">
          ¿No tienes cuenta? <Link to="/register">Regístrate ahora</Link>
        </div>
      </div>
    </main>
  )
}

export default Login
