import Navbar from "../components/Navbar";
import "./ContactPage.css";

const defaultLat = parseFloat(import.meta.env.VITE_DEFAULT_LAT)
const defaultLng = parseFloat(import.meta.env.VITE_DEFAULT_LNG)
const defaultAddress = import.meta.env.VITE_DEFAULT_ADDRESS || 'FAST NUCES, Block B, Faisal Town, Lahore'

const mapSrc = !Number.isNaN(defaultLat) && !Number.isNaN(defaultLng)
  ? `https://www.google.com/maps?q=${encodeURIComponent(`${defaultLat},${defaultLng}`)}&z=17&output=embed`
  : `https://www.google.com/maps?q=${encodeURIComponent(defaultAddress)}&z=17&output=embed`

function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="page contact-page">
        <div className="contact-page-container">
          <h1>Contact Us</h1>
          <p className="contact-description">
            Have questions, feedback, or partnership ideas? Send us a message and
            we&apos;ll get back to you soon.
          </p>

          <div className="contact-content">
            <form className="contact-form-card" onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="contact-name">Your Name</label>
              <input id="contact-name" type="text" placeholder="Enter your name" />

              <label htmlFor="contact-email">Your Email</label>
              <input id="contact-email" type="email" placeholder="Enter your email" />

              <label htmlFor="contact-message">Your Message</label>
              <textarea id="contact-message" placeholder="Write your message"></textarea>

              <button type="submit">Send Message</button>
            </form>

            <div className="contact-map-card">
              <h3>Our Location</h3>
              <iframe
                title="map"
                src={mapSrc}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
              <p className="contact-map-address">{defaultAddress}</p>
            </div>
          </div>

          <div className="contact-info-card">
            <p>
              Feel free to contact us any time at{' '}
              <strong>
                <em>support@events.com</em>
              </strong>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default ContactPage;