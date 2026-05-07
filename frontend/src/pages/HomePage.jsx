import Navbar from '../components/Navbar'
import Logo from '../components/Logo'
import './HomePage.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../utils/api'
import { mapEventFromApi, DEFAULT_EVENT_IMAGE } from '../utils/eventMapper'

const heroImages = [
  new URL('../../event-images/basant-2-tikits.jpeg', import.meta.url).href,
  new URL('../../event-images/basant-tikits.jpeg', import.meta.url).href,
  new URL('../../event-images/concert-tikits.jpg', import.meta.url).href,
  new URL('../../event-images/cultural-event-tikits.png', import.meta.url).href,
  new URL('../../event-images/open-mic-tikits.png', import.meta.url).href,
  new URL('../../event-images/tour-tikits.png', import.meta.url).href,
]

const aboutUsImage = new URL(
  '../../other-images/about-us-ems.png',
  import.meta.url,
).href

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [featuredEvents, setFeaturedEvents] = useState([])
  const [topStories, setTopStories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const timerId = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length)
    }, 3000)

    return () => clearInterval(timerId)
  }, [])

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [eventsResponse, blogsResponse] = await Promise.all([
          apiRequest('/events'),
          apiRequest('/blogs'),
        ])

        const events = (eventsResponse?.data?.events || [])
          .map(mapEventFromApi)
          .slice(0, 3)

        const blogs = (blogsResponse?.data?.blogs || []).slice(0, 3)

        setFeaturedEvents(events)
        setTopStories(blogs)
      } catch {
        setFeaturedEvents([])
        setTopStories([])
      }
    }

    loadHomeData()
  }, [])

  return (
    <>
      <Navbar />
      <main className="page home-page">

        <section className="section hero-section">
          <div className="hero-slideshow-full">
            <img
              src={heroImages[activeSlide]}
              alt="Featured event"
              className="hero-slideshow-image"
            />
          </div>
        </section>
  

        <section className="section about-section full-screen-section">
          <div className="container about-layout">
            <div className="about-content">
              <h1>Manage &amp; Discover Events Easily</h1>
              <p className="section-description about-description">
                A simple platform for participants to explore and book event
                tickets, and for organizers to create events and manage
                attendees with ease.
              </p>
              <div className="button-row">
                <button type="button">Explore Events</button>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => navigate('/organizer-dashboard')}
                >
                  Create Event
                </button>
              </div>
            </div>

            <div className="about-visual">
              <img
                src={aboutUsImage}
                alt="About Event Management System"
                className="about-image"
              />
            </div>
          </div>
        </section>



        







        <section className="section full-screen-section">
          <div className="container">
            <h2 className="section-title">Featured Events</h2>
            <div className="events-grid">
              {featuredEvents.length === 0 ? (
                <p className="meta">None</p>
              ) : (
                featuredEvents.map((event) => (
                  <article key={event.id} className="card event-card">
                    <img src={event.image || DEFAULT_EVENT_IMAGE} alt={event.title} className="event-image" />
                    <h5>{event.title}</h5>
                    <p className="meta">{event.dateLabel}</p>
                    <button type="button" onClick={() => navigate(`/events/${event.id}`)}>
                      View Details
                    </button>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="section stories-section full-screen-section">
          <div className="container">
            <h2 className="section-title">Top Stories</h2>
            <div className="events-grid stories-grid">
              {topStories.length === 0 ? (
                <p className="meta">None</p>
              ) : (
                topStories.map((blog) => (
                  <article key={blog._id} className="card event-card">
                    <img src={blog.image || DEFAULT_EVENT_IMAGE} alt={blog.title} className="event-image" />
                    <h5>{blog.title}</h5>
                    <p className="meta">
                      By {blog.author || 'Event Team'} • {blog.readTimeMinutes || 5} min read
                    </p>
                    <button type="button" onClick={() => navigate('/blogs')}>Read Story</button>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="section footer-section">
          <div className="container footer-content">
            <div className="footer-brand">
              <h3 className="footer-brand-title">
                <Logo isLink={false} />
              </h3>
              <p className="meta">Smart event discovery and management platform.</p>
            </div>
            <div className="footer-links">
              <p><strong>Email:</strong> support@eventhub.com</p>
              <p><strong>Phone:</strong> +1 (555) 014-2026</p>
              <p><strong>Address:</strong> FAST NUCES, Block B, Faisal Town, Lahore</p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
