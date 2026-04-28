import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/api'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: ''
  })
  const [message, setMessage] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)

    const result = await authService.register(formData)

    if (result.success) {
      setMessage({ type: 'success', text: result.message })
      setTimeout(() => navigate('/login'), 1500)
    } else {
      setMessage({ type: 'error', text: result.message })
    }
  }

  return (
    <main className="auth-wrapper container">
      <div className="auth-box">
        <h2>Únete a nuestra manada</h2>
        <p>Disfruta de beneficios exclusivos para tu mascota.</p>

        {/* Banner Promocional */}
        <div className="promo-banner">
          <strong>¡Oferta Especial!</strong>
          <span>Obtén un <b>20% de descuento</b> en tu primera compra al registrarte hoy.</span>
        </div>

        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="form-control"
              required
              placeholder="Tu nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              className="form-control"
              required
              placeholder="Tu apellido"
              value={formData.apellido}
              onChange={handleChange}
            />
          </div>
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
            <label htmlFor="telefono">Número telefónico</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              className="form-control"
              required
              placeholder="+34 600 000 000"
              value={formData.telefono}
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
            Crear mi cuenta y obtener el descuento
          </button>
        </form>

        <div className="auth-footer">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </main>
  )
}

export default Register
