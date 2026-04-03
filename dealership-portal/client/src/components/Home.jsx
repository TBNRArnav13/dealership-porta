import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <section className="hero text-center">
        <div className="container">
          <h1 className="display-4 fw-bold mb-3">Find Your Perfect Car</h1>
          <p className="lead mb-4">Browse dealerships across the United States and read real customer reviews.</p>
          <Link to="/dealers" className="btn btn-primary btn-lg me-2">View Dealerships</Link>
          <Link to="/about" className="btn btn-outline-light btn-lg">Learn More</Link>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          <div className="row g-4 text-center">
            {[['500+','Dealerships','primary'],['50K+','Happy Customers','success'],['50','States','warning'],['15+','Years','danger']].map(([n,l,c])=>(
              <div key={l} className="col-md-3">
                <div className={`card p-4 border-0 bg-${c} ${c==='warning'?'text-dark':'text-white'}`}>
                  <h2 className="fw-bold">{n}</h2><p className="mb-0">{l}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
