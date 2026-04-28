import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { authService } from '../services/api'

function Navbar() {
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const user = authService.getCurrentUser()
    setCurrentUser(user)
  }, [])

  // Escuchar cambios de sesión desde otros componentes
  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(authService.getCurrentUser())
    }
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('userChanged', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userChanged', handleStorageChange)
    }
  }, [])

  const handleLogout = () => {
    authService.logout()
    setCurrentUser(null)
    window.dispatchEvent(new Event('userChanged'))
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          Pet<span>Store</span>
        </Link>
        <div className="nav-actions">
          {currentUser ? (
            <>
              <span className="nav-user-greeting">
                Hola, <strong>{currentUser.nombre}</strong>
              </span>
              <button className="btn btn-outline" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Iniciar sesión</Link>
              <Link to="/register" className="btn btn-primary">Crear una cuenta</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
