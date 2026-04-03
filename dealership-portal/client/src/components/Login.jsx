import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [form, setForm] = useState({ userName: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    const res = await fetch('/api/login/', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (data.status === 'Authenticated') {
      sessionStorage.setItem('username', data.userName)
      navigate('/')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 440 }}>
      <div className="card shadow-sm p-4">
        <h3 className="mb-4 text-center">Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input name="userName" className="form-control" required onChange={handle} value={form.userName} />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-control" required onChange={handle} value={form.password} />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <p className="text-center mt-3 mb-0">No account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  )
}
