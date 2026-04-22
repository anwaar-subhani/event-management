import Navbar from '../components/Navbar'
import './HomePage.css'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    const timerId = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length)
    }, 3000)

    return () => clearInterval(timerId)
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
                <button type="button" className="button-secondary">
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
              <article className="card event-card">
                <div className="event-image" aria-hidden="true">
                  Event Image
                </div>
                <h5>Tech Innovation Summit</h5>
                <p className="meta">April 28, 2026</p>
                <button type="button">View Details</button>
              </article>

              <article className="card event-card">
                <div className="event-image" aria-hidden="true">
                  Event Image
                </div>
                <h5>Music &amp; Arts Festival</h5>
                <p className="meta">May 05, 2026</p>
                <button type="button">View Details</button>
              </article>

              <article className="card event-card">
                <div className="event-image" aria-hidden="true">
                  Event Image
                </div>
                <h5>Startup Networking Night</h5>
                <p className="meta">May 14, 2026</p>
                <button type="button">View Details</button>
              </article>
            </div>
          </div>
        </section>

        <section className="section stories-section full-screen-section">
          <div className="container">
            <h2 className="section-title">Top Stories</h2>
            <div className="events-grid stories-grid">
              <article className="card event-card">
                <div className="event-image" aria-hidden="true">
                  Blog Cover
                </div>
                <h5>How I Sold Out My First Workshop</h5>
                <p className="meta">By Event Organizer • 5 min read</p>
                <button type="button">Read Story</button>
              </article>

              <article className="card event-card">
                <div className="event-image" aria-hidden="true">
                  Blog Cover
                </div>
                <h5>Best Tips to Choose the Right Event</h5>
                <p className="meta">By Participant • 4 min read</p>
                <button type="button">Read Story</button>
              </article>

              <article className="card event-card">
                <div className="event-image" aria-hidden="true">
                  Blog Cover
                </div>
                <h5>Managing Attendees Without Stress</h5>
                <p className="meta">By Community Lead • 6 min read</p>
                <button type="button">Read Story</button>
              </article>
            </div>
          </div>
        </section>

        <section className="section footer-section">
          <div className="container footer-content">
            <div className="footer-brand">
              <h3 className="footer-brand-title">
                <span className="brand-main">Event</span>
                <span className="brand-accent">um</span>
              </h3>
              <p className="meta">Smart event discovery and management platform.</p>
            </div>
            <div className="footer-links">
              <p><strong>Email:</strong> support@eventhub.com</p>
              <p><strong>Phone:</strong> +1 (555) 014-2026</p>
              <p><strong>Address:</strong> 12 Event Street, Downtown</p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
