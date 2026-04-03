import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const US_STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
  "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri",
  "Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York",
  "North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
  "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington",
  "West Virginia","Wisconsin","Wyoming"]

export default function Dealers() {
  const [dealers, setDealers] = useState([])
  const [state, setState] = useState('All')
  const [loading, setLoading] = useState(true)
  const user = sessionStorage.getItem('username')

  const fetchDealers = (s) => {
    setLoading(true)
    const url = s === 'All' ? '/api/get_dealers/' : `/api/get_dealers/${s}/`
    fetch(url).then(r => r.json()).then(d => { setDealers(d.dealers || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchDealers('All') }, [])

  return (
    <div className="container py-5">
      <h2 className="mb-4">Dealerships</h2>
      <div className="row mb-3">
        <div className="col-md-4">
          <select className="form-select" value={state} onChange={e => setState(e.target.value)}>
            <option value="All">Show All States</option>
            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={() => fetchDealers(state)}>Filter</button>
        </div>
      </div>
      {loading ? <div className="spinner-border text-primary" role="status"></div> : (
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr><th>#</th><th>Dealer Name</th><th>City</th><th>State</th><th>Zip</th><th>Action</th></tr>
          </thead>
          <tbody>
            {dealers.length === 0
              ? <tr><td colSpan="6" className="text-center">No dealers found.</td></tr>
              : dealers.map((d, i) => (
                <tr key={d.id}>
                  <td>{i + 1}</td>
                  <td><Link to={`/dealer/${d.id}`}>{d.full_name}</Link></td>
                  <td>{d.city}</td><td>{d.state}</td><td>{d.zip}</td>
                  <td>
                    {user
                      ? <Link to={`/add_review/${d.id}`} className="btn btn-sm btn-success">Review</Link>
                      : <Link to="/login" className="btn btn-sm btn-outline-secondary">Login to Review</Link>}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
