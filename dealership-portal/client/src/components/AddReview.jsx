import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

export default function AddReview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = sessionStorage.getItem('username')
  const [makes, setMakes] = useState([])
  const [models, setModels] = useState([])
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    review: '', purchase: false, purchase_date: '',
    car_make: '', car_model: '', car_year: ''
  })

  useEffect(() => {
    if (!user) navigate('/login')
    fetch('/api/get_cars/').then(r => r.json()).then(d => setMakes(d.CarMakes || []))
  }, [])

  const onMakeChange = (make) => {
    setForm({ ...form, car_make: make, car_model: '' })
    fetch('/api/get_car_models/').then(r => r.json()).then(d =>
      setModels((d.CarModels || []).filter(m => m.car_make__name === make))
    )
  }

  const submit = async e => {
    e.preventDefault()
    const payload = {
      user_id: 1, name: user, dealership: parseInt(id),
      review: form.review, purchase: form.purchase,
      purchase_date: form.purchase_date,
      car_make: form.car_make, car_model: form.car_model,
      car_year: parseInt(form.car_year) || 0,
    }
    const res = await fetch('/api/add_review/', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (data.status === 200) navigate(`/dealer/${id}`)
    else setError(data.message || 'Failed to submit review')
  }

  const years = Array.from({ length: 25 }, (_, i) => 2024 - i)

  return (
    <div className="container py-5" style={{ maxWidth: 700 }}>
      <h2 className="mb-4">Write a Review</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit} className="card shadow-sm p-4">
        <div className="mb-3">
          <label className="form-label fw-semibold">Your Review</label>
          <textarea className="form-control" rows="4" required
            value={form.review} onChange={e => setForm({ ...form, review: e.target.value })}
            placeholder="Share your experience..." />
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="purchased"
            checked={form.purchase} onChange={e => setForm({ ...form, purchase: e.target.checked })} />
          <label className="form-check-label" htmlFor="purchased">I purchased a vehicle here</label>
        </div>
        {form.purchase && (
          <>
            <div className="mb-3">
              <label className="form-label">Purchase Date</label>
              <input type="date" className="form-control"
                value={form.purchase_date} onChange={e => setForm({ ...form, purchase_date: e.target.value })} />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label">Car Make</label>
                <select className="form-select" value={form.car_make} onChange={e => onMakeChange(e.target.value)}>
                  <option value="">Select Make</option>
                  {makes.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Car Model</label>
                <select className="form-select" value={form.car_model} onChange={e => setForm({ ...form, car_model: e.target.value })}>
                  <option value="">Select Model</option>
                  {models.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Year</label>
                <select className="form-select" value={form.car_year} onChange={e => setForm({ ...form, car_year: e.target.value })}>
                  <option value="">Select Year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </>
        )}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary px-4">Submit Review</button>
          <Link to={`/dealer/${id}`} className="btn btn-outline-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
