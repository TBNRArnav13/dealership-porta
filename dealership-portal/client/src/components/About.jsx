const team = [
  { name: 'Sarah Johnson', role: 'CEO & Founder', email: 'sarah@bestcars.com', description: 'Sarah founded Best Cars in 2010 with a vision to bring transparency to car buying.', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Michael Chen', role: 'CTO', email: 'michael@bestcars.com', description: 'Michael leads our engineering team, building the platform that powers 500+ dealerships.', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Emily Rodriguez', role: 'Head of Operations', email: 'emily@bestcars.com', description: 'Emily ensures every dealership meets our quality and service standards.', image: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { name: 'David Park', role: 'Lead Developer', email: 'david@bestcars.com', description: 'David architects our microservices and keeps the platform running smoothly.', image: 'https://randomuser.me/api/portraits/men/75.jpg' },
]

export default function About() {
  return (
    <>
      <section className="hero text-center py-5">
        <div className="container">
          <h1 className="display-5 fw-bold">About Best Cars Dealership</h1>
          <p className="lead">Connecting customers with trusted dealerships across the US since 2010.</p>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-md-6">
              <h2>Our Mission</h2>
              <p className="text-muted">We believe every customer deserves transparency when buying a car. Our platform aggregates real reviews from verified buyers so you can make informed decisions at any of our 500+ dealership locations nationwide.</p>
            </div>
            <div className="col-md-6 text-center">
              <img src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500&q=80" className="img-fluid rounded shadow" alt="Dealership" />
            </div>
          </div>
          <h2 className="text-center mb-4">Meet Our Team</h2>
          <div className="row g-4">
            {team.map(m => (
              <div key={m.name} className="col-md-3">
                <div className="card text-center h-100">
                  <img src={m.image} className="card-img-top" alt={m.name} style={{ height: 200, objectFit: 'cover' }} />
                  <div className="card-body">
                    <h5 className="card-title">{m.name}</h5>
                    <p className="text-primary fw-semibold">{m.role}</p>
                    <p className="card-text text-muted small">{m.description}</p>
                    <a href={`mailto:${m.email}`} className="btn btn-outline-primary btn-sm">
                      <i className="fas fa-envelope me-1"></i>{m.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
