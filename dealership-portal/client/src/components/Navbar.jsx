import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [user, setUser] = useState(sessionStorage.getItem('username'))
  const navigate = useNavigate()

  useEffect(() => {
    const onStorage = () => setUser(sessionStorage.getItem('username'))
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const logout = () => {
    fetch('/api/logout/').then(() => {
      sessionStorage.clear()
      setUser(null)
      navigate('/')
    })
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/"><i className="fas fa-car me-2"></i>Best Cars</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/dealers">Dealers</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
          </ul>
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <span className="text-light">Hello, <strong>{user}</strong></span>
                <button className="btn btn-outline-light btn-sm" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
