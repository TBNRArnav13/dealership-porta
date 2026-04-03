import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function DealerDetail() {
  const { id } = useParams()
  const [dealer, setDealer] = useState(null)
  const [reviews, setReviews] = useState([])
  const user = sessionStorage.getItem('username')

  useEffect(() => {
    fetch(`/api/get_dealer/${id}/`).then(r => r.json()).then(d => setDealer(d.dealer))
    fetch(`/api/get_reviews/${id}/`).then(r => r.json()).then(d => setReviews(d.reviews || []))
  }, [id])

  if (!dealer) return <div className="container py-5"><div className="spinner-border text-primary"></div></div>

  const d = Array.isArray(dealer) ? dealer[0] : dealer

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body d-flex justify-content-between align-items-start">
          <div>
            <h2>{d.full_name}</h2>
            <p className="text-muted mb-1"><i className="fas fa-map-marker-alt me-2"></i>{d.address}, {d.city}, {d.state} {d.zip}</p>
            <p className="text-muted mb-0"><i className="fas fa-phone me-2"></i>{d.phone || 'N/A'}</p>
          </div>
          {user && <Link to={`/add_review/${id}`} className="btn btn-success"><i className="fas fa-pen me-2"></i>Write a Review</Link>}
        </div>
      </div>

      <h3 className="mb-3">Customer Reviews</h3>
      {reviews.length === 0
        ? <p className="text-muted">No reviews yet. Be the first!</p>
        : <div className="row g-3">
            {reviews.map((r, i) => (
              <div key={i} className="col-md-6">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <strong>{r.name}</strong>
                      <small className="text-muted">{r.purchase_date}</small>
                    </div>
                    <p className="card-text">{r.review}</p>
                    {r.purchase && <small className="text-success"><i className="fas fa-check-circle me-1"></i>Verified – {r.car_make} {r.car_model} ({r.car_year})</small>}
                    <div className="mt-2">
                      <span className={`sentiment-${r.sentiment || 'neutral'}`}>
                        <i className="fas fa-circle-dot me-1"></i>{(r.sentiment || 'neutral').charAt(0).toUpperCase() + (r.sentiment || 'neutral').slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>}
    </div>
  )
}
