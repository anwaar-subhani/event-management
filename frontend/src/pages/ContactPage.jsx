import Navbar from "../components/Navbar";
import "./ContactPage.css";

function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="contact-container">
      <h1>Contact Us</h1>
        <div className="contact-content">
          <div className="contact-form">
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <textarea placeholder="Your Message"></textarea>
            <button>Send Message</button>
          </div>
          <div className="contact-map">
            <iframe
              title="map"
              src="https://www.google.com/maps?q=Lahore&output=embed"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
        <div className="contact-info">
          <p><span style={{ fontWeight: "bold" }}>Feel free to contact us any time at <span style={{ fontStyle: "oblique" }}>support@events.com</span></span></p>
        </div>
      </div>
    </>
  );
}

export default ContactPage;