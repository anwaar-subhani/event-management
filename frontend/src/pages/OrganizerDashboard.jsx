import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import CreateEvent from "../components/CreateEvent";
import ManageEvents from "../components/ManageEvents";
import ManageBlogs from "../components/ManageBlogs";
import { apiRequest, clearAuth, getAuthToken } from '../utils/api';
import { mapEventFromApi } from '../utils/eventMapper';
import "./Dashboard.css";

function OrganizerDashboard() {
  const [active, setActive] = useState("dashboard");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingEventId, setDeletingEventId] = useState('');
  const [updatingEventId, setUpdatingEventId] = useState('');
  const navigate = useNavigate();

  const token = getAuthToken();

  const fetchOrganizerEvents = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await apiRequest('/events/organizer/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mappedEvents = (response?.data?.events || []).map(mapEventFromApi);
      setEvents(mappedEvents);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load organizer events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizerEvents();
  }, []);


  const handleCreateEvent = async (eventData) => {
    if (!token) {
      throw new Error('Please login as organizer first');
    }

    const formData = new FormData();
    formData.append('title', eventData.title);
    formData.append('date', eventData.date);
    formData.append('city', eventData.city);
    formData.append('location', eventData.location);
    formData.append('category', eventData.category);
    formData.append('about', eventData.about);
    formData.append('details', eventData.details);
    formData.append('ticketPrice', String(eventData.ticketPrice));
    formData.append('totalTicketsAvailable', String(eventData.totalTicketsAvailable));

    if (eventData.posterFile) {
      formData.append('poster', eventData.posterFile);
    }

    await apiRequest('/events', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    await fetchOrganizerEvents();
    setActive('dashboard');
  };

  const handleDeleteEvent = async (eventId) => {
    if (!token) {
      setErrorMessage('Please login as organizer first');
      return;
    }

    setDeletingEventId(eventId);
    setErrorMessage('');

    try {
      await apiRequest(`/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents((previous) => previous.filter((event) => event.id !== eventId));
    } catch (error) {
      setErrorMessage(error.message || 'Failed to delete event');
    } finally {
      setDeletingEventId('');
    }
  };

  const handleUpdateEvent = async (eventId, eventData) => {
    if (!token) {
      throw new Error('Please login as organizer first');
    }

    setUpdatingEventId(eventId);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('title', eventData.title);
      formData.append('date', eventData.date);
      formData.append('city', eventData.city);
      formData.append('location', eventData.location);
      formData.append('category', eventData.category);
      formData.append('about', eventData.about);
      formData.append('details', eventData.details);
      formData.append('ticketPrice', String(eventData.ticketPrice));
      formData.append('totalTicketsAvailable', String(eventData.totalTicketsAvailable));
      formData.append('isPublished', String(eventData.isPublished));
      formData.append('isActive', String(eventData.isActive));

      if (eventData.posterFile) {
        formData.append('poster', eventData.posterFile);
      }

      await apiRequest(`/events/${eventId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      await fetchOrganizerEvents();
    } catch (error) {
      throw new Error(error.message || 'Failed to update event');
    } finally {
      setUpdatingEventId('');
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const activeEvents = useMemo(() => events.filter((event) => event.isActive), [events]);
  const totalActiveEvents = activeEvents.length;
  const totalTicketsPurchased = activeEvents.reduce((sum, event) => sum + Number(event.ticketsSold || 0), 0);
  const totalRevenue = activeEvents.reduce((sum, event) => sum + Number(event.ticketsSold || 0) * Number(event.ticketPrice || 0), 0);

  if (!token) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-panel">
            <h2>Organizer Dashboard</h2>
            <p>Please login as an organizer first.</p>
            <Link className="details-back-link" to="/login">Go to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="dashboard-panel">
      <h2>Organizer Dashboard</h2>
      {errorMessage ? <p>{errorMessage}</p> : null}
      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-card">
          <h3>Total Active Events</h3>
          <p>{totalActiveEvents}</p>
        </div>
        <div className="dashboard-stat-card">
          <h3>Total Tickets Purchased</h3>
          <p>{totalTicketsPurchased}</p>
        </div>
        <div className="dashboard-stat-card">
          <h3>Total Revenue</h3>
          <p>PKR {totalRevenue.toLocaleString()}</p>
          <small>Calculated from sold tickets × ticket price.</small>
        </div>
      </div>
      <div className="events-summary-block">
        <h3>Tickets Purchased and Revenue for Each Event</h3>
        {isLoading ? (
          <p>Loading your events...</p>
        ) : activeEvents.length === 0 ? (
          <p>No active events yet.</p>
        ) : (
          <div className="events-table-wrap">
            <table className="events-summary-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Category</th>
                  <th>Tickets Purchased</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {activeEvents.map((event) => {
                  const eventRevenue = Number(event.ticketsSold || 0) * Number(event.ticketPrice || 0);
                  return (
                    <tr key={event.id}>
                      <td>{event.title}</td>
                      <td>{event.category}</td>
                      <td>{event.ticketsSold}</td>
                      <td>PKR {eventRevenue.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    if (active === "create") return <CreateEvent onCreateEvent={handleCreateEvent} />;
    if (active === "manage") {
      return (
        <ManageEvents
          events={events}
          onDeleteEvent={handleDeleteEvent}
          deletingEventId={deletingEventId}
          onUpdateEvent={handleUpdateEvent}
          updatingEventId={updatingEventId}
        />
      );
    }
    if (active === "blogs") {
      return <ManageBlogs token={token} />;
    }
    return renderDashboard();
  };

  return (
    <div className="dashboard-container">
      <Sidebar setActive={setActive} onLogout={handleLogout} />
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default OrganizerDashboard;