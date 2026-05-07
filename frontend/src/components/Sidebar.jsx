import Logo from './Logo'

function Sidebar({ setActive, canManageBlogs, onLogout }) {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <Logo isLink={true} />
      </div>
      <button onClick={() => setActive("dashboard")}>Dashboard</button>
      <button onClick={() => setActive("create")}>Create Event</button>
      <button onClick={() => setActive("manage")}>Manage Events</button>
      {canManageBlogs ? <button onClick={() => setActive("blogs")}>Manage Blogs</button> : null}
      {onLogout && <button onClick={onLogout}>Logout</button>}
    </div>
  );
}

export default Sidebar;