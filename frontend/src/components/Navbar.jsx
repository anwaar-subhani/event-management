import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/blogs">Blogs</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="nav-right">
        <Link to="/login">Login/Signup</Link>
      </div>
    </nav>
  )
}
