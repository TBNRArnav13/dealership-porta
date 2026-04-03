import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About'
import Contact from './components/Contact'
import Dealers from './components/Dealers'
import DealerDetail from './components/DealerDetail'
import AddReview from './components/AddReview'
import Register from './components/Register'
import Login from './components/Login'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dealers" element={<Dealers />} />
        <Route path="/dealer/:id" element={<DealerDetail />} />
        <Route path="/add_review/:id" element={<AddReview />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <footer className="py-4 mt-5">
        <div className="container text-center">
          <p className="mb-0">&copy; 2026 Best Cars Dealership. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
