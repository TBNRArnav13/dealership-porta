import { useState } from 'react'

export default function Contact() {
  const [sent, setSent] = useState(false)

  const submit = e => { e.preventDefault(); setSent(true); e.target.reset() }

  return (
    <>
      <section className="hero text-center py-5">
        <div className="container">
          <h1 className="display-5 fw-bold">Contact Us</h1>
          <p className="lead">We'd love to hear from you.</p>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-md-6">
              <h3 className="mb-4">Send Us a Message</h3>
              {sent && <div className="alert alert-success">Message sent! We'll get back to you soon.</div>}
              <form onSubmit={submit}>
                <div className="mb-3"><label className="form-label">Full Name</label><input className="form-control" required /></div>
                <div className="mb-3"><label className="form-label">Email</label><input type="email" className="form-control" required /></div>
                <div className="mb-3"><label className="form-label">Subject</label><input className="form-control" /></div>
                <div className="mb-3"><label className="form-label">Message</label><textarea className="form-control" rows="5" required></textarea></div>
                <button type="submit" className="btn btn-primary px-4">Send Message</button>
              </form>
            </div>
            <div className="col-md-6">
              <h3 className="mb-4">Our Offices</h3>
              <div className="card mb-3 border-0 shadow-sm">
                <div className="card-body">
                  <h5><i className="fas fa-map-marker-alt text-primary me-2"></i>Headquarters</h5>
                  <p className="text-muted mb-1">1234 Auto Drive, Suite 100, New York, NY 10001</p>
                  <p className="text-muted mb-1"><i className="fas fa-phone me-2"></i>+1 (800) 555-0100</p>
                  <p className="text-muted mb-0"><i className="fas fa-envelope me-2"></i>info@bestcars.com</p>
                </div>
              </div>
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Business Hours</h5>
                  <table className="table table-sm mb-0">
                    <tbody>
                      <tr><td>Monday – Friday</td><td className="text-end">9:00 AM – 6:00 PM</td></tr>
                      <tr><td>Saturday</td><td className="text-end">10:00 AM – 4:00 PM</td></tr>
                      <tr><td>Sunday</td><td className="text-end text-muted">Closed</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
