function Sidebar({ setActive, onLogout }) {
  return (
    <div className="sidebar">
      <h2>EventHub</h2>
      <button onClick={() => setActive("dashboard")}>Dashboard</button>
      <button onClick={() => setActive("create")}>Create Event</button>
      <button onClick={() => setActive("manage")}>Manage Events</button>
      <button onClick={() => setActive("blogs")}>Manage Blogs</button>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Sidebar;