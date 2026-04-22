function ManageEvents() {
  const events = [
    { id: 1, title: "Tech Conference" },
    { id: 2, title: "AI Workshop" }
  ];
  return (
    <div>
      <h2>Manage Events</h2>
      {events.map(event => (
        <div key={event.id}>
          <span>{event.title}</span>
          <button>Edit</button>
          <button>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default ManageEvents;