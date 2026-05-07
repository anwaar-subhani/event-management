import { useMemo, useState } from 'react';
import LocationPicker from './LocationPicker';

function ManageEvents({ events, onDeleteEvent, deletingEventId, onUpdateEvent, updatingEventId }) {
  const [editingId, setEditingId] = useState('');
  const [message, setMessage] = useState('');
  const [editPoster, setEditPoster] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    category: '',
    about: '',
    details: '',
    ticketPrice: '',
    totalTicketsAvailable: '',
    isPublished: true,
    isActive: true,
  });

  const editingEvent = useMemo(
    () => events.find((event) => event.id === editingId),
    [events, editingId]
  );

  const startEdit = (event) => {
    setEditingId(event.id);
    setMessage('');
    setEditPoster(null);
    setFormData({
      title: event.title || '',
      date: event.dateInput || '',
      location: event.location || '',
      category: event.category || '',
      about: event.about || '',
      details: event.details || '',
      ticketPrice: event.ticketPrice ?? '',
      totalTicketsAvailable: event.totalTicketsAvailable ?? '',
      isPublished: event.isPublished !== false,
      isActive: event.isActive !== false,
    });
  };

  const cancelEdit = () => {
    setEditingId('');
    setMessage('');
    setEditPoster(null);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePosterChange = (event) => {
    const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
    setEditPoster(file);
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!editingId || !onUpdateEvent) return;

    try {
      await onUpdateEvent(editingId, {
        ...formData,
        ticketPrice: Number(formData.ticketPrice) || 0,
        totalTicketsAvailable: Number(formData.totalTicketsAvailable) || 0,
        posterFile: editPoster,
      });

      setMessage('Event updated successfully.');
      setEditingId('');
      setEditPoster(null);
    } catch (error) {
      setMessage(error.message || 'Failed to update event');
    }
  };

  return (
    <div className="dashboard-panel">
      <h2>Manage Events</h2>

      {events.length === 0 ? (
        <p>No events created yet.</p>
      ) : (
        <div className="events-table-wrap">
          <table className="events-summary-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Category</th>
                <th>Tickets Sold</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.dateLabel}</td>
                  <td>{event.category}</td>
                  <td>{event.ticketsSold}</td>
                  <td>{event.isActive ? 'Active' : 'Inactive'}</td>
                  <td style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="button" onClick={() => startEdit(event)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteEvent(event.id)}
                      disabled={deletingEventId === event.id}
                    >
                      {deletingEventId === event.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingEvent ? (
        <form className="create-event-form" onSubmit={handleUpdateSubmit}>
          <h3>Edit Event</h3>
          <div className="create-event-grid">
            <label>
              Title
              <input name="title" value={formData.title} onChange={handleInputChange} required />
            </label>
            <label>
              Date
              <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
            </label>
            <label className="full-width-field">
              Location
              <LocationPicker
                value={formData.location}
                onChange={(address) =>
                  setFormData((previous) => ({
                    ...previous,
                    location: address,
                  }))
                }
              />
            </label>
            <label>
              Category
              <input name="category" value={formData.category} onChange={handleInputChange} required />
            </label>
            <label>
              Ticket Price
              <input type="number" min="0" name="ticketPrice" value={formData.ticketPrice} onChange={handleInputChange} required />
            </label>
            <label>
              Total Tickets Available
              <input type="number" min="0" name="totalTicketsAvailable" value={formData.totalTicketsAvailable} onChange={handleInputChange} required />
            </label>
            <label className="full-width-field">
              About
              <textarea name="about" value={formData.about} onChange={handleInputChange} required />
            </label>
            <label className="full-width-field">
              Details
              <textarea name="details" value={formData.details} onChange={handleInputChange} required />
            </label>
            <label className="full-width-field">
              Replace Poster (optional)
              <input type="file" accept="image/*" onChange={handlePosterChange} />
            </label>
            <label>
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleInputChange}
              />{' '}
              Published
            </label>
            <label>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />{' '}
              Active
            </label>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" disabled={updatingEventId === editingId}>
              {updatingEventId === editingId ? 'Updating...' : 'Update Event'}
            </button>
            <button type="button" onClick={cancelEdit}>Cancel</button>
          </div>
        </form>
      ) : null}

      {message ? <p>{message}</p> : null}
    </div>
  );
}

export default ManageEvents;