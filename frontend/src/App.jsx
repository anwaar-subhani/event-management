import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import BlogsPage from './pages/BlogsPage'
import BlogDetails from './pages/BlogDetails'
import ContactPage from './pages/ContactPage'
import LoginSignupPage from './pages/LoginSignupPage'
import EventDetails from './pages/EventDetails'
import OrganizerDashboard from './pages/OrganizerDashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:eventId" element={<EventDetails />} />
      <Route path="/blogs" element={<BlogsPage />} />
      <Route path="/blogs/:blogId" element={<BlogDetails />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginSignupPage />} />
      <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
    </Routes>
  )
}

export default App