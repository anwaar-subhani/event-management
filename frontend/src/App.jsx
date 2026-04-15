import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import BlogsPage from './pages/BlogsPage'
import ContactPage from './pages/ContactPage'
import LoginSignupPage from './pages/LoginSignupPage'
import EventDetails from './pages/EventDetails'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:eventId" element={<EventDetails />} />
      <Route path="/blogs" element={<BlogsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginSignupPage />} />
    </Routes>
  )
}

export default App