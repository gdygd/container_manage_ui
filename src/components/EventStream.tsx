import { useState, useMemo } from 'react';
import { useEvents, type DockerEvent } from '../contexts/EventContext';
import './EventStream.css';

type EventType = 'all' | 'container' | 'network' | 'image' | 'volume' | 'daemon';

function EventStream() {
  const { events, isConnected, clearEvents, connect, disconnect } = useEvents();
  const [typeFilter, setTypeFilter] = useState<EventType>('all');
  const [isPaused, setIsPaused] = useState(false);
  const [pausedEvents, setPausedEvents] = useState<DockerEvent[]>([]);

  const displayEvents = isPaused ? pausedEvents : events;

  const filteredEvents = useMemo(() => {
    if (typeFilter === 'all') return displayEvents;
    return displayEvents.filter(event => event.type === typeFilter);
  }, [displayEvents, typeFilter]);

  const handlePause = () => {
    if (!isPaused) {
      setPausedEvents([...events]);
    }
    setIsPaused(!isPaused);
  };

  const handleClear = () => {
    clearEvents();
    setPausedEvents([]);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getEventTypeClass = (type: string, action: string) => {
    if (type === 'container') {
      switch (action) {
        case 'start':
        case 'create':
        case 'unpause':
          return 'event-success';
        case 'stop':
        case 'die':
        case 'kill':
        case 'destroy':
          return 'event-error';
        case 'pause':
        case 'restart':
          return 'event-warning';
        default:
          return 'event-info';
      }
    }
    switch (type) {
      case 'network':
        return 'event-network';
      case 'image':
        return 'event-image';
      case 'volume':
        return 'event-volume';
      case 'daemon':
        return 'event-daemon';
      default:
        return 'event-info';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'container':
        return 'type-container';
      case 'network':
        return 'type-network';
      case 'image':
        return 'type-image';
      case 'volume':
        return 'type-volume';
      case 'daemon':
        return 'type-daemon';
      default:
        return '';
    }
  };

  const eventCounts = useMemo(() => {
    const counts = {
      all: events.length,
      container: 0,
      network: 0,
      image: 0,
      volume: 0,
      daemon: 0,
    };
    events.forEach(event => {
      if (counts[event.type] !== undefined) {
        counts[event.type]++;
      }
    });
    return counts;
  }, [events]);

  return (
    <div className="event-stream">
      <div className="stream-header">
        <h2>Event Stream</h2>
        <div className="stream-controls">
          <button
            className={`control-btn ${!isPaused ? 'active' : ''}`}
            onClick={() => setIsPaused(false)}
          >
            Live
          </button>
          <button
            className={`control-btn ${isPaused ? 'active' : ''}`}
            onClick={handlePause}
          >
            Pause
          </button>
          <button className="clear-btn" onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>

      <div className="stream-filters">
        <span className="filter-label">Type:</span>
        <div className="type-filters">
          <button
            className={`type-btn ${typeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTypeFilter('all')}
          >
            All ({eventCounts.all})
          </button>
          <button
            className={`type-btn type-container ${typeFilter === 'container' ? 'active' : ''}`}
            onClick={() => setTypeFilter('container')}
          >
            Container ({eventCounts.container})
          </button>
          <button
            className={`type-btn type-network ${typeFilter === 'network' ? 'active' : ''}`}
            onClick={() => setTypeFilter('network')}
          >
            Network ({eventCounts.network})
          </button>
          <button
            className={`type-btn type-image ${typeFilter === 'image' ? 'active' : ''}`}
            onClick={() => setTypeFilter('image')}
          >
            Image ({eventCounts.image})
          </button>
          <button
            className={`type-btn type-volume ${typeFilter === 'volume' ? 'active' : ''}`}
            onClick={() => setTypeFilter('volume')}
          >
            Volume ({eventCounts.volume})
          </button>
          <button
            className={`type-btn type-daemon ${typeFilter === 'daemon' ? 'active' : ''}`}
            onClick={() => setTypeFilter('daemon')}
          >
            Daemon ({eventCounts.daemon})
          </button>
        </div>
      </div>

      <div className="events-list">
        {filteredEvents.length === 0 ? (
          <div className="empty-events">
            {events.length === 0
              ? 'Waiting for events...'
              : `No ${typeFilter} events`}
          </div>
        ) : (
          filteredEvents.map(event => (
            <div
              key={event.id}
              className={`event-item ${getEventTypeClass(event.type, event.action)}`}
            >
              <div className="event-timestamp">{formatTimestamp(event.timestamp)}</div>
              <div className="event-host">{event.host}</div>
              <div className="event-type">
                <span className={`type-badge ${getTypeColor(event.type)}`}>
                  {event.type}
                </span>
              </div>
              <div className="event-action">
                <span className="action-badge">{event.action}</span>
              </div>
              <div className="event-actor">
                <span className="actor-name">{event.actor_name || '-'}</span>
                <span className="actor-id">{event.actor_id.substring(0, 12)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="stream-footer">
        <div className="event-count">
          Showing {filteredEvents.length} of {events.length} events
          {isPaused && ' (Paused)'}
        </div>
        <div className="connection-controls">
          <button
            className={`sse-btn ${isConnected ? 'disconnect' : 'connect'}`}
            onClick={isConnected ? disconnect : connect}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className={`status-dot ${isConnected ? 'live' : 'offline'}`}></span>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventStream;
