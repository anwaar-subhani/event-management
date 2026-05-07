import { useState } from "react";

function CreateEvent({ onCreateEvent }) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    city: "",
    location: "",
    category: "",
    about: "",
    details: "",
    ticketPrice: "",
    totalTicketsAvailable: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [posterFile, setPosterFile] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePosterChange = (event) => {
    const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
    setPosterFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!onCreateEvent) return;

    setIsLoading(true);

    try {
      await onCreateEvent({
        ...formData,
        ticketPrice: Number(formData.ticketPrice) || 0,
        totalTicketsAvailable: Number(formData.totalTicketsAvailable) || 0,
        posterFile
      });

      setMessage('Event created successfully');
      setFormData({
        title: "",
        date: "",
        city: "",
        location: "",
        category: "",
        about: "",
        details: "",
        ticketPrice: "",
        totalTicketsAvailable: ""
      });
      setPosterFile(null);
    } catch (error) {
      setMessage(error.message || 'Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-panel">
      <h2>Create Event</h2>
      <form className="create-event-form" onSubmit={handleSubmit}>
        <div className="create-event-grid">
          <label>
            Title
            <input
              type="text"
              name="title"
              placeholder="Enter event title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Date
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            City
            <input
              type="text"
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Location
            <input
              type="text"
              name="location"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Category
            <input
              type="text"
              name="category"
              placeholder="Enter category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </label>
          <label className="full-width-field">
            About
            <textarea
              name="about"
              placeholder="Short overview about the event"
              value={formData.about}
              onChange={handleChange}
              required
            ></textarea>
          </label>
          <label className="full-width-field">
            Details
            <textarea
              name="details"
              placeholder="Detailed information for attendees"
              value={formData.details}
              onChange={handleChange}
              required
            ></textarea>
          </label>
          <label>
            Ticket Price
            <input
              type="number"
              min="0"
              name="ticketPrice"
              placeholder="0"
              value={formData.ticketPrice}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Total Tickets Available
            <input
              type="number"
              min="0"
              name="totalTicketsAvailable"
              placeholder="0"
              value={formData.totalTicketsAvailable}
              onChange={handleChange}
              required
            />
          </label>
          <label className="full-width-field">
            Event Poster
            <input
              type="file"
              accept="image/*"
              name="poster"
              onChange={handlePosterChange}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create'}</button>
        {message ? <p>{message}</p> : null}
      </form>
    </div>
  );
}

export default CreateEvent;