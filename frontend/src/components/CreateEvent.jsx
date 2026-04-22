import { useState } from "react";

function CreateEvent({ onCreateEvent }) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    category: "",
    about: "",
    details: "",
    ticketPrice: "",
    totalTicketsAvailable: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!onCreateEvent) return;

    onCreateEvent({
      ...formData,
      ticketPrice: Number(formData.ticketPrice) || 0,
      totalTicketsAvailable: Number(formData.totalTicketsAvailable) || 0
    });

    setFormData({
      title: "",
      date: "",
      location: "",
      category: "",
      about: "",
      details: "",
      ticketPrice: "",
      totalTicketsAvailable: ""
    });
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
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateEvent;