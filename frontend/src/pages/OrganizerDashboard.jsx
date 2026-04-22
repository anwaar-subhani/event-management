import { useState } from "react";
import Sidebar from "../components/Sidebar";
import CreateEvent from "../components/CreateEvent";
import ManageEvents from "../components/ManageEvents";
import "./Dashboard.css";

function OrganizerDashboard() {
  const [active, setActive] = useState("dashboard");
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Tech Conference",
      date: "2026-05-15",
      location: "Bangalore",
      category: "Technology",
      about: "A one-day technology conference.",
      details: "Talks, networking, and product demos.",
      ticketPrice: 1200,
      totalTicketsAvailable: 300,
      ticketsPurchased: 180,
      isActive: true
    },
    {
      id: 2,
      title: "AI Workshop",
      date: "2026-06-02",
      location: "Mumbai",
      category: "Workshop",
      about: "Hands-on AI workshop.",
      details: "Model building, deployment, and Q&A session.",
      ticketPrice: 2500,
      totalTicketsAvailable: 120,
      ticketsPurchased: 72,
      isActive: true
    }
  ]);

  const handleCreateEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now(),
      ticketsPurchased: 0,
      isActive: true
    };
    setEvents((prevEvents) => [newEvent, ...prevEvents]);
    setActive("dashboard");
  };

  const activeEvents = events.filter((event) => event.isActive);
  const totalActiveEvents = activeEvents.length;
  const totalTicketsPurchased = activeEvents.reduce((sum, event) => sum + event.ticketsPurchased, 0);
  const revenueAll = activeEvents.reduce((sum, event) => sum + event.ticketsPurchased * event.ticketPrice, 0);
  const totalRevenue = totalActiveEvents * revenueAll;

  const renderDashboard = () => (
    <div className="dashboard-panel">
      <h2>Organizer Dashboard</h2>
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
          <small>Total Revenue = Total Active Events x Revenue (All Events)</small>
        </div>
      </div>
      <div className="events-summary-block">
        <h3>Tickets Purchased and Revenue for Each Event</h3>
        {activeEvents.length === 0 ? (
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
                  const eventRevenue = event.ticketsPurchased * event.ticketPrice;
                  return (
                    <tr key={event.id}>
                      <td>{event.title}</td>
                      <td>{event.category}</td>
                      <td>{event.ticketsPurchased}</td>
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
    if (active === "manage") return <ManageEvents />;
    return renderDashboard();
  };

  return (
    <div className="dashboard-container">
      <Sidebar setActive={setActive} />
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default OrganizerDashboard;