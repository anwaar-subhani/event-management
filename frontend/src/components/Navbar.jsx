import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink className="brand-link" to="/">
          <span className="brand-main">Event</span>
          <span className="brand-accent">um</span>
        </NavLink>

        <div className="nav-left">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Events
          </NavLink>
          <NavLink to="/blogs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Blogs
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Contact
          </NavLink>
        </div>

        <div className="nav-right">
          <NavLink to="/login" className={({ isActive }) => `nav-cta ${isActive ? 'active' : ''}`}>
            Be an Event Organizer
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
