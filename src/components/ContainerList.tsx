import { useState, useEffect } from 'react';
import './ContainerList.css';

interface Container {
  id: string;
  name: string;
  image: string;
  state: string;
  status: string;
}

interface Host {
  host: string;
  addr: string;
}

interface ContainerApiResponse {
  success: boolean;
  data: Container[];
}

interface HostApiResponse {
  success: boolean;
  data: Host[];
}

type StateFilter = 'all' | 'running' | 'exited';

function ContainerList() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [selectedHost, setSelectedHost] = useState<string>('');
  const [stateFilter, setStateFilter] = useState<StateFilter>('all');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch hosts list
  const fetchHosts = async () => {
    try {
      const response = await fetch('/api/hosts', {
        cache: 'no-store',
        headers: { 'Accept': 'application/json' },
      });
      const result: HostApiResponse = await response.json();
      if (result.success && result.data.length > 0) {
        setHosts(result.data);
        setSelectedHost(result.data[0].host);
      }
    } catch (err) {
      console.error('Failed to fetch hosts:', err);
    }
  };

  // Fetch containers for selected host
  const fetchContainers = async () => {
    if (!selectedHost) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ps2/${selectedHost}`, {
        cache: 'no-store',
        headers: { 'Accept': 'application/json' },
      });
      const result: ContainerApiResponse = await response.json();
      if (result.success) {
        setContainers(result.data);
      } else {
        setError('Failed to fetch containers');
      }
    } catch (err) {
      setError('Failed to connect to server');
      setContainers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHosts();
  }, []);

  useEffect(() => {
    if (selectedHost) {
      fetchContainers();
    }
  }, [selectedHost]);

  const getStateClass = (state: string) => {
    switch (state) {
      case 'running':
        return 'running';
      case 'exited':
        return 'stopped';
      case 'paused':
        return 'paused';
      default:
        return 'stopped';
    }
  };

  const filteredContainers = containers.filter(container => {
    if (stateFilter === 'all') return true;
    return container.state === stateFilter;
  });

  // Start container
  const startContainer = async (containerId: string) => {
    setActionLoading(containerId);
    setError(null);
    try {
      const response = await fetch('/api/start2', {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          id: containerId,
          host: selectedHost,
        }),
      });

      if (response.ok) {
        await fetchContainers();
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to start container');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setActionLoading(null);
    }
  };

  // Stop container
  const stopContainer = async (containerId: string) => {
    setActionLoading(containerId);
    setError(null);
    try {
      const response = await fetch('/api/stop2', {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          id: containerId,
          host: selectedHost,
        }),
      });

      if (response.ok) {
        await fetchContainers();
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to stop container');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="container-list">
      <div className="list-header">
        <h2>Containers</h2>
        <div className="header-controls">
          <select
            className="host-select"
            value={selectedHost}
            onChange={(e) => setSelectedHost(e.target.value)}
          >
            {hosts.map(host => (
              <option key={host.host} value={host.host}>
                {host.host}
              </option>
            ))}
          </select>
          <button
            className="refresh-btn"
            onClick={fetchContainers}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="filter-bar">
        <span className="filter-label">State:</span>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${stateFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStateFilter('all')}
          >
            All ({containers.length})
          </button>
          <button
            className={`filter-btn ${stateFilter === 'running' ? 'active' : ''}`}
            onClick={() => setStateFilter('running')}
          >
            Running ({containers.filter(c => c.state === 'running').length})
          </button>
          <button
            className={`filter-btn ${stateFilter === 'exited' ? 'active' : ''}`}
            onClick={() => setStateFilter('exited')}
          >
            Exited ({containers.filter(c => c.state === 'exited').length})
          </button>
        </div>
      </div>

      <div className="list-table">
        <div className="table-header">
          <div className="col-id">ID</div>
          <div className="col-name">Name</div>
          <div className="col-image">Image</div>
          <div className="col-status">State</div>
          <div className="col-created">Status</div>
          <div className="col-actions">Actions</div>
        </div>

        {filteredContainers.map(container => (
          <div key={container.id} className="table-row">
            <div className="col-id">{container.id.substring(0, 12)}</div>
            <div className="col-name">{container.name}</div>
            <div className="col-image">{container.image}</div>
            <div className="col-status">
              <span className={`status-badge ${getStateClass(container.state)}`}>
                {container.state}
              </span>
            </div>
            <div className="col-created">{container.status}</div>
            <div className="col-actions">
              <button
                className="action-btn start"
                disabled={container.state === 'running' || actionLoading === container.id}
                onClick={() => startContainer(container.id)}
              >
                {actionLoading === container.id ? 'Starting...' : 'Start'}
              </button>
              <button
                className="action-btn stop"
                disabled={container.state === 'exited' || actionLoading === container.id}
                onClick={() => stopContainer(container.id)}
              >
                {actionLoading === container.id ? 'Stopping...' : 'Stop'}
              </button>
              <button className="action-btn inspect">
                Inspect
              </button>
            </div>
          </div>
        ))}

        {!loading && filteredContainers.length === 0 && !error && (
          <div className="empty-state">
            {stateFilter === 'all' ? 'No containers found' : `No ${stateFilter} containers`}
          </div>
        )}
      </div>

      <div className="container-summary">
        Showing {filteredContainers.length} of {containers.length} containers
      </div>
    </div>
  );
}

export default ContainerList;
