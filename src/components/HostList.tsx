import { useState, useEffect } from 'react';
import './HostList.css';

interface Host {
  host: string;
  addr: string;
}

interface ApiResponse {
  success: boolean;
  data: Host[];
}

function HostList() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/hosts', {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
        },
      });
      const result: ApiResponse = await response.json();
      if (result.success) {
        setHosts(result.data);
      } else {
        setError('Failed to fetch hosts');
      }
    } catch (err) {
      setError('Failed to connect to server');
      // Mock data for development
      setHosts([
        { host: '119server', addr: 'tcp://10.1.0.119:2376' },
        { host: 'dev-server', addr: 'tcp://10.1.0.120:2376' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHosts();
  }, []);

  const parseAddress = (addr: string) => {
    const match = addr.match(/tcp:\/\/([^:]+):(\d+)/);
    if (match) {
      return { ip: match[1], port: match[2] };
    }
    return { ip: addr, port: '-' };
  };

  return (
    <div className="host-list">
      <div className="list-header">
        <h2>Docker Hosts</h2>
        <button className="refresh-btn" onClick={fetchHosts} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error} (showing mock data)
        </div>
      )}

      <div className="list-table">
        <div className="table-header">
          <div className="col-status">Status</div>
          <div className="col-host">Host Name</div>
          <div className="col-ip">IP Address</div>
          <div className="col-port">Port</div>
          <div className="col-actions">Actions</div>
        </div>

        {hosts.map(host => {
          const { ip, port } = parseAddress(host.addr);
          return (
            <div key={host.host} className="table-row">
              <div className="col-status">
                <span className="status-indicator online"></span>
              </div>
              <div className="col-host">{host.host}</div>
              <div className="col-ip">{ip}</div>
              <div className="col-port">{port}</div>
              <div className="col-actions">
                <button className="action-btn connect">Connect</button>
                <button className="action-btn info">Info</button>
              </div>
            </div>
          );
        })}

        {!loading && hosts.length === 0 && (
          <div className="empty-state">No hosts found</div>
        )}
      </div>

      <div className="host-summary">
        Total Hosts: {hosts.length}
      </div>
    </div>
  );
}

export default HostList;
