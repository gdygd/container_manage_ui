import './EventStream.css';

interface Event {
  timestamp: string;
  type: 'start' | 'stop' | 'create' | 'destroy' | 'die' | 'kill';
  container: string;
  message: string;
}

function EventStream() {
  // Mock data for layout
  const events: Event[] = [
    {
      timestamp: '2025-01-26 14:30:15',
      type: 'start',
      container: 'web-server',
      message: 'Container started successfully',
    },
    {
      timestamp: '2025-01-26 14:29:45',
      type: 'create',
      container: 'web-server',
      message: 'Container created from image nginx:latest',
    },
    {
      timestamp: '2025-01-26 14:25:30',
      type: 'stop',
      container: 'redis-cache',
      message: 'Container stopped',
    },
    {
      timestamp: '2025-01-26 14:20:12',
      type: 'start',
      container: 'database',
      message: 'Container started successfully',
    },
    {
      timestamp: '2025-01-26 14:18:05',
      type: 'die',
      container: 'old-worker',
      message: 'Container died with exit code 0',
    },
  ];

  const getEventTypeClass = (type: string) => {
    switch (type) {
      case 'start':
      case 'create':
        return 'event-success';
      case 'stop':
      case 'die':
      case 'kill':
        return 'event-error';
      case 'destroy':
        return 'event-warning';
      default:
        return 'event-info';
    }
  };

  return (
    <div className="event-stream">
      <div className="stream-header">
        <h2>Event Stream</h2>
        <div className="stream-controls">
          <button className="control-btn active">Live</button>
          <button className="control-btn">Pause</button>
          <button className="clear-btn">Clear</button>
        </div>
      </div>

      <div className="stream-filters">
        <div className="filter-group">
          <label>Event Type:</label>
          <select className="filter-select">
            <option>All Events</option>
            <option>Start</option>
            <option>Stop</option>
            <option>Create</option>
            <option>Destroy</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Container:</label>
          <select className="filter-select">
            <option>All Containers</option>
            <option>web-server</option>
            <option>database</option>
            <option>redis-cache</option>
          </select>
        </div>
      </div>

      <div className="events-list">
        {events.map((event, idx) => (
          <div key={idx} className={`event-item ${getEventTypeClass(event.type)}`}>
            <div className="event-timestamp">{event.timestamp}</div>
            <div className="event-type">
              <span className="event-badge">{event.type.toUpperCase()}</span>
            </div>
            <div className="event-container">{event.container}</div>
            <div className="event-message">{event.message}</div>
          </div>
        ))}
      </div>

      <div className="stream-footer">
        <div className="event-count">Total Events: {events.length}</div>
        <div className="connection-status">
          <span className="status-dot live"></span>
          Connected to Event Stream
        </div>
      </div>
    </div>
  );
}

export default EventStream;
